import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

// Plan prices in cents for the API
const PLANOS: Record<string, { nome: string; valor: number }> = {
  basico: { nome: "Basico Essencial", valor: 6900 },
  premium: { nome: "Premium Total", valor: 10900 },
  ultra: { nome: "Ultra Maximo", valor: 14900 },
};

// CRC16 CCITT - required for PIX payload
function calcCRC16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
}

// Generate demo PIX response
async function generateDemoPixResponse(
  planoData: { nome: string; valor: number },
  correlationID: string,
  name: string,
  email: string
) {
  // PIX static payload (demo only)
  const pixPayload =
    "00020126580014BR.GOV.BCB.PIX0136streamunity@demo.com" +
    `5204000053039865802BR5925STREAMUNITY DEMO6009SAO PAULO` +
    `62070503***6304`;
  const crc = calcCRC16(pixPayload);
  const brCode = pixPayload + crc;

  const qrCodeImage = await QRCode.toDataURL(brCode, {
    width: 300,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  });

  const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();

  console.log(`[Demo] Cliente: ${name} <${email}> - Plano: ${planoData.nome}`);

  return {
    success: true,
    demo: true,
    correlationID,
    brCode,
    qrCodeImage,
    expiresAt,
    valor: (planoData.valor / 100).toFixed(2),
    plano: planoData.nome,
    status: "ACTIVE",
    message: "MODO DEMO - Configure OPENPIX_API_KEY para pagamentos reais.",
  };
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, plano } = await request.json();

    // Basic validation
    if (!name || !email || !plano) {
      return NextResponse.json(
        { error: "name, email e plano sao obrigatorios." },
        { status: 400 }
      );
    }

    if (!PLANOS[plano]) {
      return NextResponse.json(
        { error: `Plano invalido: ${plano}` },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "E-mail invalido." }, { status: 400 });
    }

    const planoData = PLANOS[plano];
    const correlationID = `su-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Check if OpenPix API key is configured
    const apiKey = process.env.OPENPIX_API_KEY;

    if (!apiKey) {
      // Return demo response
      const demoResponse = await generateDemoPixResponse(
        planoData,
        correlationID,
        name,
        email
      );
      return NextResponse.json(demoResponse);
    }

    // Call OpenPix API
    try {
      const openpixRes = await fetch(
        "https://api.openpix.com.br/api/v1/charge",
        {
          method: "POST",
          headers: {
            Authorization: apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correlationID,
            value: planoData.valor,
            comment: `StreamUnity - Plano ${planoData.nome}`,
            expiresIn: 3600,
            customer: {
              name,
              email,
              taxID: { taxID: "00000000000", type: "CPF" },
            },
            additionalInfo: [
              { key: "Plano", value: planoData.nome },
              { key: "E-mail", value: email },
            ],
          }),
        }
      );

      const openpixData = await openpixRes.json();

      if (!openpixRes.ok || openpixData.error) {
        console.error("OpenPix error:", openpixData);
        const demoResponse = await generateDemoPixResponse(
          planoData,
          correlationID,
          name,
          email
        );
        return NextResponse.json(demoResponse);
      }

      const charge = openpixData.charge;

      // Generate QR Code as base64 if API doesn't return one
      let qrCodeImage = charge.qrCodeImage;
      if (!qrCodeImage && charge.brCode) {
        qrCodeImage = await QRCode.toDataURL(charge.brCode, {
          width: 300,
          margin: 2,
          color: { dark: "#000000", light: "#ffffff" },
        });
      }

      return NextResponse.json({
        success: true,
        correlationID: charge.correlationID,
        brCode: charge.brCode,
        qrCodeImage,
        expiresAt: charge.expiresDate,
        valor: (planoData.valor / 100).toFixed(2),
        plano: planoData.nome,
        status: charge.status,
      });
    } catch (err) {
      console.error("OpenPix connection error:", err);
      const demoResponse = await generateDemoPixResponse(
        planoData,
        correlationID,
        name,
        email
      );
      return NextResponse.json(demoResponse);
    }
  } catch (err) {
    console.error("Request error:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

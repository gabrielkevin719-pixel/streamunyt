import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

// Plan prices in BRL
const PLANOS: Record<string, { nome: string; valor: number }> = {
  basico: { nome: "Basico Essencial", valor: 69.00 },
  premium: { nome: "Premium Total", valor: 109.00 },
  ultra: { nome: "Ultra Maximo", valor: 149.00 },
};

// Generate demo PIX response when API key is not configured
async function generateDemoPixResponse(
  planoData: { nome: string; valor: number },
  correlationID: string,
  name: string,
  email: string
) {
  const demoPixCode = `00020126580014BR.GOV.BCB.PIX0136${correlationID}@demo.streamunity.com.br5204000053039865802BR5925STREAMUNITY DEMO6009SAO PAULO62070503***6304`;

  const qrCodeImage = await QRCode.toDataURL(demoPixCode, {
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
    brCode: demoPixCode,
    qrCodeImage,
    expiresAt,
    valor: planoData.valor.toFixed(2),
    plano: planoData.nome,
    status: "PENDING",
    message: "MODO DEMO - Configure SYNCPAY_API_KEY para pagamentos reais.",
  };
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, cpf, phone, plano } = await request.json();

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

    // Check if SyncPay API key is configured
    const apiKey = process.env.SYNCPAY_API_KEY;

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

    // Call SyncPay API - Cash-in (deposit via PIX)
    try {
      const baseUrl = process.env.SYNCPAY_API_URL || "https://api.syncpayments.com.br";
      const webhookUrl = process.env.SYNCPAY_WEBHOOK_URL || `${request.nextUrl.origin}/api/webhook/syncpay`;

      const syncpayRes = await fetch(`${baseUrl}/api/partner/v1/cash-in`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          amount: planoData.valor,
          description: `StreamUnity - Plano ${planoData.nome}`,
          webhook_url: webhookUrl,
          client: {
            name: name,
            cpf: cpf?.replace(/\D/g, "") || "00000000000",
            email: email,
            phone: phone?.replace(/\D/g, "") || "11999999999",
          },
        }),
      });

      const syncpayData = await syncpayRes.json();

      if (!syncpayRes.ok || syncpayData.message === "Unauthenticated.") {
        console.error("SyncPay error:", syncpayData);
        // Fallback to demo mode if API fails
        const demoResponse = await generateDemoPixResponse(
          planoData,
          correlationID,
          name,
          email
        );
        return NextResponse.json({
          ...demoResponse,
          message: `Erro na API SyncPay: ${syncpayData.message || "Erro desconhecido"}. Usando modo demo.`,
        });
      }

      // Generate QR Code image from pix_code
      const qrCodeImage = await QRCode.toDataURL(syncpayData.pix_code, {
        width: 300,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      });

      const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();

      return NextResponse.json({
        success: true,
        correlationID: syncpayData.identifier,
        brCode: syncpayData.pix_code,
        qrCodeImage,
        expiresAt,
        valor: planoData.valor.toFixed(2),
        plano: planoData.nome,
        status: "PENDING",
      });
    } catch (err) {
      console.error("SyncPay connection error:", err);
      const demoResponse = await generateDemoPixResponse(
        planoData,
        correlationID,
        name,
        email
      );
      return NextResponse.json({
        ...demoResponse,
        message: "Erro de conexao com SyncPay. Usando modo demo.",
      });
    }
  } catch (err) {
    console.error("Request error:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

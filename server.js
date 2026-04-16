/**
 * StreamUnity — Backend de Pagamento via PIX
 * Provedor: OpenPix (Woovi) — https://developers.openpix.com.br
 *
 * Para usar:
 * 1. Crie uma conta em https://app.openpix.com.br
 * 2. Gere uma API Key em Configurações → API/Plugins
 * 3. Copie a chave para o .env
 * 4. npm install && node server.js
 */

require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const fetch    = require('node-fetch');
const QRCode   = require('qrcode');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

// ─────────────────────────────────────────────────────────────
// Planos disponíveis (valores em centavos para a API)
// ─────────────────────────────────────────────────────────────
const PLANOS = {
  basico:   { nome: 'Básico Essencial',  valor: 6900  },
  premium:  { nome: 'Premium Total',     valor: 10900 },
  ultra:    { nome: 'Ultra Máximo',      valor: 14900 },
};

// ─────────────────────────────────────────────────────────────
// POST /api/payment — Criar cobrança PIX
// Body: { name, email, plano }
// ─────────────────────────────────────────────────────────────
app.post('/api/payment', async (req, res) => {
  const { name, email, plano } = req.body;

  // ── Validação básica ──────────────────────────────────────
  if (!name || !email || !plano) {
    return res.status(400).json({ error: 'name, email e plano são obrigatórios.' });
  }
  if (!PLANOS[plano]) {
    return res.status(400).json({ error: `Plano inválido: ${plano}` });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'E-mail inválido.' });
  }

  const planoData = PLANOS[plano];
  const correlationID = `su-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;

  // ── Chamar API OpenPix ────────────────────────────────────
  try {
    const openpixRes = await fetch('https://api.openpix.com.br/api/v1/charge', {
      method: 'POST',
      headers: {
        'Authorization': process.env.OPENPIX_API_KEY || 'SUA_CHAVE_AQUI',
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        correlationID,
        value:   planoData.valor,
        comment: `StreamUnity — Plano ${planoData.nome}`,
        expiresIn: 3600, // 1 hora em segundos
        customer: {
          name,
          email,
          taxID: { taxID: '00000000000', type: 'CPF' }, // CPF placeholder
        },
        additionalInfo: [
          { key: 'Plano',  value: planoData.nome },
          { key: 'E-mail', value: email },
        ],
      }),
    });

    const openpixData = await openpixRes.json();

    // ── Tratar erros da API OpenPix ───────────────────────
    if (!openpixRes.ok || openpixData.error) {
      console.error('OpenPix error:', openpixData);
      // Fallback: gerar QR fake para demo quando sem chave real
      return res.json(await generateDemoPixResponse(planoData, correlationID, name, email));
    }

    const charge = openpixData.charge;

    // Gerar QR Code como imagem base64 caso a API não retorne
    let qrCodeImage = charge.qrCodeImage;
    if (!qrCodeImage && charge.brCode) {
      qrCodeImage = await QRCode.toDataURL(charge.brCode, {
        width: 300, margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      });
    }

    return res.json({
      success:       true,
      correlationID: charge.correlationID,
      brCode:        charge.brCode,       // PIX copia e cola
      qrCodeImage,                        // base64 PNG
      expiresAt:     charge.expiresDate,
      valor:         (planoData.valor / 100).toFixed(2),
      plano:         planoData.nome,
      status:        charge.status,
    });

  } catch (err) {
    console.error('Erro interno:', err.message);
    // Fallback demo quando não há conexão com OpenPix
    return res.json(await generateDemoPixResponse(planoData, correlationID, name, email));
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/payment/status — Consultar status de pagamento
// Body: { correlationID }
// ─────────────────────────────────────────────────────────────
app.get('/api/payment/status/:correlationID', async (req, res) => {
  const { correlationID } = req.params;
  try {
    const openpixRes = await fetch(
      `https://api.openpix.com.br/api/v1/charge/${correlationID}`,
      { headers: { 'Authorization': process.env.OPENPIX_API_KEY || '' } }
    );
    const data = await openpixRes.json();
    return res.json({
      status: data.charge?.status || 'ACTIVE',
      paidAt: data.charge?.paidAt || null,
    });
  } catch (err) {
    return res.json({ status: 'ACTIVE' });
  }
});

// ─────────────────────────────────────────────────────────────
// DEMO fallback — gera PIX fake para testar sem chave real
// ─────────────────────────────────────────────────────────────
async function generateDemoPixResponse(planoData, correlationID, name, email) {
  // Payload PIX estático padrão do Banco Central (apenas demo)
  const pixPayload =
    '00020126580014BR.GOV.BCB.PIX0136streamunity@demo.com' +
    `5204000053039865802BR5925STREAMUNITY DEMO6009SAO PAULO` +
    `62070503***6304`;
  const crc = calcCRC16(pixPayload);
  const brCode = pixPayload + crc;

  const qrCodeImage = await QRCode.toDataURL(brCode, {
    width: 300, margin: 2,
    color: { dark: '#000', light: '#fff' },
  });

  const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();

  console.log(`⚠️  MODO DEMO — sem chave OpenPix real.`);
  console.log(`   Cliente: ${name} <${email}> → Plano: ${planoData.nome}`);

  return {
    success:       true,
    demo:          true,
    correlationID,
    brCode,
    qrCodeImage,
    expiresAt,
    valor:         (planoData.valor / 100).toFixed(2),
    plano:         planoData.nome,
    status:        'ACTIVE',
    message:       'MODO DEMO — Configure OPENPIX_API_KEY no .env para pagamentos reais.',
  };
}

// CRC16 CCITT — necessário no payload PIX
function calcCRC16(str) {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return ((crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0'));
}

// ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 StreamUnity Backend rodando em http://localhost:${PORT}`);
  console.log(`   PIX Provider: OpenPix (Woovi)`);
  console.log(`   API Key: ${process.env.OPENPIX_API_KEY ? '✓ Configurada' : '⚠ Não configurada (modo demo)'}\n`);
});

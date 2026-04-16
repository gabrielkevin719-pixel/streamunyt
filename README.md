# StreamUnity — Backend de Pagamento PIX

## Requisitos
- Node.js 18+
- Conta na [OpenPix/Woovi](https://app.openpix.com.br) (gratuita)

## Setup rápido

```bash
# 1. Instale as dependências
npm install

# 2. Configure o .env
cp .env.example .env
# Edite o .env e insira sua OPENPIX_API_KEY

# 3. Inicie o servidor
node server.js
```

O backend roda em **http://localhost:3001**

## Como obter a API Key OpenPix

1. Crie conta gratuita em https://app.openpix.com.br
2. Acesse **Configurações → API/Plugins**
3. Clique em **Nova Aplicação**
4. Copie a chave gerada para o `.env`

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/payment` | Criar cobrança PIX |
| `GET`  | `/api/payment/status/:id` | Consultar status |

### POST /api/payment

**Body:**
```json
{
  "name":  "João Silva",
  "email": "joao@email.com",
  "plano": "premium"
}
```

**Resposta:**
```json
{
  "success": true,
  "correlationID": "su-1234567890-abc123",
  "brCode": "00020126...",
  "qrCodeImage": "data:image/png;base64,...",
  "expiresAt": "2026-04-15T23:00:00Z",
  "valor": "109.00",
  "plano": "Premium Total",
  "status": "ACTIVE"
}
```

## Modo Demo

Se `OPENPIX_API_KEY` não estiver configurada, o servidor roda em **modo demo** — gera QR codes de teste sem cobrar ninguém. Perfeito para desenvolver o frontend.

## Planos disponíveis

| Plano | Valor |
|-------|-------|
| `basico`   | R$69,00  |
| `premium`  | R$109,00 |
| `ultra`    | R$149,00 |

/**
 * SyncPay API Client
 * Handles authentication (token caching) and API calls for PIX Cash-In.
 *
 * Docs: https://syncpay.apidog.io
 *
 * Auth flow:
 *   POST /api/partner/v1/auth-token  { client_id, client_secret }
 *   -> { access_token, token_type, expires_in, expires_at }
 *   Token is valid for 1 hour. We cache it in-memory and refresh 5 min before expiry.
 */

const SYNCPAY_BASE_URL =
  process.env.SYNCPAY_API_URL || "https://api.syncpayments.com.br";

// In-memory token cache
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0; // epoch ms

/**
 * Get a valid Bearer token, reusing the cached one when possible.
 */
export async function getSyncPayToken(): Promise<string> {
  const now = Date.now();
  // Reuse token if still valid (with 5 min buffer)
  if (cachedToken && tokenExpiresAt - now > 5 * 60 * 1000) {
    return cachedToken;
  }

  const clientId = process.env.SYNCPAY_CLIENT_ID;
  const clientSecret = process.env.SYNCPAY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "SYNCPAY_CLIENT_ID and SYNCPAY_CLIENT_SECRET must be set."
    );
  }

  const res = await fetch(`${SYNCPAY_BASE_URL}/api/partner/v1/auth-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[SyncPay] Auth failed:", res.status, body);
    throw new Error(`SyncPay auth failed (${res.status}): ${body}`);
  }

  const data = await res.json();

  if (!data.access_token) {
    console.error("[SyncPay] No access_token in response:", data);
    throw new Error("SyncPay auth response missing access_token");
  }

  cachedToken = data.access_token;
  // expires_in is in seconds; convert to ms and set absolute expiry
  tokenExpiresAt = now + (data.expires_in || 3600) * 1000;

  console.log(
    `[SyncPay] Token obtained, expires in ${data.expires_in || 3600}s`
  );

  return cachedToken!;
}

// ── Cash-In (PIX deposit) ──────────────────────────────────

export interface CashInParams {
  amount: number; // e.g. 69.00
  description: string;
  webhookUrl: string;
  client: {
    name: string;
    cpf: string; // 11 digits, no punctuation
    email: string;
    phone: string; // 10-11 digits
  };
}

export interface CashInResponse {
  message: string;
  pix_code: string;
  identifier: string;
}

export async function createCashIn(
  params: CashInParams
): Promise<CashInResponse> {
  const token = await getSyncPayToken();

  const res = await fetch(`${SYNCPAY_BASE_URL}/api/partner/v1/cash-in`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      amount: params.amount,
      description: params.description,
      webhook_url: params.webhookUrl,
      client: {
        name: params.client.name,
        cpf: params.client.cpf,
        email: params.client.email,
        phone: params.client.phone,
      },
    }),
  });

  const data = await res.json();

  if (!res.ok || data.message === "Unauthenticated.") {
    // Invalidate cached token so next call gets a fresh one
    cachedToken = null;
    tokenExpiresAt = 0;
    console.error("[SyncPay] Cash-in error:", res.status, data);
    throw new Error(
      `SyncPay cash-in failed: ${data.message || JSON.stringify(data)}`
    );
  }

  return data as CashInResponse;
}

// ── Transaction status ─────────────────────────────────────

export interface TransactionData {
  reference_id: string;
  currency: string;
  amount: number;
  transaction_date: string;
  status: "pending" | "completed" | "failed" | "refunded" | "med";
  description: string | null;
  pix_code: string | null;
}

export async function getTransactionStatus(
  identifier: string
): Promise<TransactionData> {
  const token = await getSyncPayToken();

  const res = await fetch(
    `${SYNCPAY_BASE_URL}/api/partner/v1/transaction/${identifier}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  const body = await res.json();

  if (!res.ok) {
    cachedToken = null;
    tokenExpiresAt = 0;
    console.error("[SyncPay] Transaction status error:", res.status, body);
    throw new Error(
      `SyncPay transaction query failed: ${body.message || JSON.stringify(body)}`
    );
  }

  return body.data as TransactionData;
}

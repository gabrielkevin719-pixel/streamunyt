import { NextRequest, NextResponse } from "next/server";

/**
 * SyncPay Webhook Handler
 *
 * Events come via headers:
 *   - event: "cashin.create" | "cashin.update"
 *   - Authorization: "Bearer {TOKEN}"
 *
 * Body format (both events):
 * {
 *   "data": {
 *     "id": "uuid",
 *     "client": { "name", "email", "document" },
 *     "pix_code": "...",
 *     "amount": 10,
 *     "final_amount": 9.4,
 *     "currency": "BRL",
 *     "status": "pending" | "completed" | "failed" | "refunded" | "med",
 *     "payment_method": "PIX",
 *     "created_at": "...",
 *     "updated_at": "...",
 *     // Only on update:
 *     "end_to_end": "...",
 *     "debtor_account": { "name", "document" }
 *   }
 * }
 *
 * IMPORTANT: All webhooks have a 5 second timeout.
 */

interface SyncPayWebhookData {
  id: string;
  end_to_end?: string;
  client: {
    name: string;
    email: string;
    document: string;
  };
  debtor_account?: {
    name: string;
    document: string;
  };
  pix_code: string;
  amount: number;
  final_amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded" | "med";
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export async function POST(request: NextRequest) {
  try {
    // Event type comes from header
    const event = request.headers.get("event") || "unknown";
    const payload: { data: SyncPayWebhookData } = await request.json();
    const { data } = payload;

    console.log(
      `[SyncPay Webhook] Event: ${event} | ID: ${data.id} | Status: ${data.status} | Amount: R$ ${data.amount}`
    );

    switch (event) {
      case "cashin.create":
        console.log(
          `[SyncPay] Payment created: ${data.id} - Client: ${data.client.name} <${data.client.email}>`
        );
        break;

      case "cashin.update":
        console.log(
          `[SyncPay] Payment updated: ${data.id} - Status: ${data.status}`
        );

        if (data.status === "completed") {
          console.log(`[SyncPay] Payment CONFIRMED: ${data.id}`);
          console.log(
            `[SyncPay] Client: ${data.client.name} <${data.client.email}>`
          );
          console.log(`[SyncPay] Amount: R$ ${data.amount} (final: R$ ${data.final_amount})`);
          console.log(`[SyncPay] End-to-end: ${data.end_to_end}`);

          if (data.debtor_account) {
            console.log(
              `[SyncPay] Debtor: ${data.debtor_account.name} (${data.debtor_account.document})`
            );
          }

          // TODO: Add your business logic here
          // - Update database with payment confirmation
          // - Send confirmation email to client
          // - Activate subscription for the user
        }

        if (data.status === "failed") {
          console.log(`[SyncPay] Payment FAILED: ${data.id}`);
          // TODO: Handle failed payment
        }

        if (data.status === "refunded") {
          console.log(`[SyncPay] Payment REFUNDED: ${data.id}`);
          // TODO: Handle refund
        }
        break;

      default:
        console.log(`[SyncPay] Unknown event: ${event}`);
    }

    // Always return 200 to acknowledge receipt (within 5s timeout)
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[SyncPay Webhook] Error:", err);
    // Return 200 even on error to prevent retries
    return NextResponse.json({ success: false });
  }
}

// Health check for webhook endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "SyncPay Webhook",
    timestamp: new Date().toISOString(),
  });
}

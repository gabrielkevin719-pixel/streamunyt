import { NextRequest, NextResponse } from "next/server";

// SyncPay Webhook Handler
// Receives payment status updates from SyncPay

interface SyncPayWebhookPayload {
  event: string;
  identifier: string;
  status: string;
  amount: number;
  paid_at?: string;
  created_at?: string;
  updated_at?: string;
  client?: {
    name: string;
    cpf: string;
    email: string;
    phone: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const payload: SyncPayWebhookPayload = await request.json();

    console.log("[SyncPay Webhook] Received:", JSON.stringify(payload, null, 2));

    const { event, identifier, status, amount, paid_at, client } = payload;

    // Handle different webhook events
    switch (event) {
      case "cashin.created":
        console.log(`[SyncPay] Payment created: ${identifier} - Amount: R$ ${amount}`);
        break;

      case "cashin.updated":
      case "cashin.completed":
      case "cashin.paid":
        console.log(`[SyncPay] Payment updated: ${identifier} - Status: ${status}`);
        
        if (status === "completed" || status === "paid") {
          console.log(`[SyncPay] Payment CONFIRMED: ${identifier}`);
          console.log(`[SyncPay] Client: ${client?.name} <${client?.email}>`);
          console.log(`[SyncPay] Amount: R$ ${amount}`);
          console.log(`[SyncPay] Paid at: ${paid_at}`);
          
          // TODO: Add your business logic here
          // - Update database
          // - Send confirmation email
          // - Activate subscription
          // - etc.
        }
        break;

      case "cashin.expired":
        console.log(`[SyncPay] Payment expired: ${identifier}`);
        break;

      case "cashin.failed":
        console.log(`[SyncPay] Payment failed: ${identifier}`);
        break;

      default:
        console.log(`[SyncPay] Unknown event: ${event}`);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({
      success: true,
      message: "Webhook received",
      identifier,
    });
  } catch (err) {
    console.error("[SyncPay Webhook] Error:", err);
    
    // Return 200 even on error to prevent retries
    // Log the error for debugging
    return NextResponse.json({
      success: false,
      message: "Webhook processing error",
    });
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

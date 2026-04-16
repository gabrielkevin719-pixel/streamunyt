import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ correlationID: string }> }
) {
  const { correlationID } = await params;

  try {
    const apiKey = process.env.SYNCPAY_API_KEY;

    if (!apiKey) {
      // Demo mode - return pending status
      return NextResponse.json({
        status: "PENDING",
        paidAt: null,
        demo: true,
      });
    }

    const baseUrl = process.env.SYNCPAY_API_URL || "https://api.syncpayments.com.br";

    // Call SyncPay API to check transaction status
    const syncpayRes = await fetch(
      `${baseUrl}/api/partner/v1/transactions/${correlationID}`,
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Accept": "application/json",
        },
      }
    );

    const data = await syncpayRes.json();

    if (!syncpayRes.ok) {
      console.error("SyncPay status check error:", data);
      return NextResponse.json({
        status: "PENDING",
        paidAt: null,
        error: data.message,
      });
    }

    // Map SyncPay status to our status format
    // SyncPay statuses: pending, processing, completed, failed, expired
    const statusMap: Record<string, string> = {
      pending: "PENDING",
      processing: "PROCESSING",
      completed: "COMPLETED",
      paid: "COMPLETED",
      failed: "FAILED",
      expired: "EXPIRED",
      cancelled: "CANCELLED",
    };

    const status = statusMap[data.status?.toLowerCase()] || data.status || "PENDING";

    return NextResponse.json({
      status,
      paidAt: data.paid_at || data.completed_at || null,
      identifier: data.identifier,
      amount: data.amount,
    });
  } catch (err) {
    console.error("Status check error:", err);
    return NextResponse.json({
      status: "PENDING",
      paidAt: null,
    });
  }
}

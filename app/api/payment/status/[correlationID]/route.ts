import { NextRequest, NextResponse } from "next/server";
import { getTransactionStatus } from "@/lib/syncpay";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ correlationID: string }> }
) {
  const { correlationID } = await params;

  try {
    const clientId = process.env.SYNCPAY_CLIENT_ID;
    const clientSecret = process.env.SYNCPAY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      // Demo mode - return pending status
      return NextResponse.json({
        status: "PENDING",
        paidAt: null,
        demo: true,
      });
    }

    const data = await getTransactionStatus(correlationID);

    // Map SyncPay status to our status format
    // SyncPay statuses: pending, completed, failed, refunded, med
    const statusMap: Record<string, string> = {
      pending: "PENDING",
      completed: "COMPLETED",
      failed: "FAILED",
      refunded: "REFUNDED",
      med: "MED",
    };

    const status = statusMap[data.status] || data.status?.toUpperCase() || "PENDING";

    return NextResponse.json({
      status,
      paidAt: data.transaction_date || null,
      identifier: data.reference_id,
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

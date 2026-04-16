import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ correlationID: string }> }
) {
  const { correlationID } = await params;

  try {
    const apiKey = process.env.OPENPIX_API_KEY;

    if (!apiKey) {
      // Demo mode - always return active
      return NextResponse.json({
        status: "ACTIVE",
        paidAt: null,
      });
    }

    const openpixRes = await fetch(
      `https://api.openpix.com.br/api/v1/charge/${correlationID}`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    const data = await openpixRes.json();

    return NextResponse.json({
      status: data.charge?.status || "ACTIVE",
      paidAt: data.charge?.paidAt || null,
    });
  } catch {
    return NextResponse.json({
      status: "ACTIVE",
      paidAt: null,
    });
  }
}

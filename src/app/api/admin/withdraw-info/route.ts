import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token tidak ditemukan" }, { status: 400 });
    }

    const snapshot = await adminDb.collection("withdrawals")
      .where("adminToken", "==", token)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ error: "Link sudah kadaluarsa atau tidak valid" }, { status: 404 });
    }

    const withdrawal = snapshot.docs[0].data();

    if (withdrawal.status !== "PENDING") {
      return NextResponse.json({ error: "Permintaan pencairan ini sudah diproses sebelumnya" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: snapshot.docs[0].id,
        email: withdrawal.email,
        amount: withdrawal.amount,
        methodType: withdrawal.methodType,
        provider: withdrawal.provider,
        accountNumber: withdrawal.accountNumber,
        accountName: withdrawal.accountName,
        createdAt: withdrawal.createdAt,
      }
    });
  } catch (error: any) {
    console.error("Fetch withdraw info error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

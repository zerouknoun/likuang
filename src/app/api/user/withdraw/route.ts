import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { admin, adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { amount, methodType, provider, accountNumber, accountName } = await req.json();

    // Validation
    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount < 50000) {
      return NextResponse.json({ error: "Minimal pencairan adalah Rp 50.000" }, { status: 400 });
    }
    
    if (!methodType || !provider || !accountNumber || !accountName) {
      return NextResponse.json({ error: "Semua data pencairan harus diisi lengkap" }, { status: 400 });
    }

    const userRef = adminDb.collection("users").doc(userId);
    const withdrawRef = adminDb.collection("withdrawals").doc();

    await adminDb.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists) {
        throw new Error("User not found");
      }

      const userData = userDoc.data();
      const currentBalance = userData?.balance || 0;

      if (currentBalance < parsedAmount) {
        throw new Error("Saldo tidak mencukupi");
      }

      // Deduct balance
      transaction.update(userRef, {
        balance: admin.firestore.FieldValue.increment(-parsedAmount)
      });

      // Create withdrawal record
      transaction.set(withdrawRef, {
        userId,
        email: userData?.email || "",
        amount: parsedAmount,
        methodType,
        provider,
        accountNumber,
        accountName,
        status: "PENDING",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    return NextResponse.json({ success: true, message: "Permintaan pencairan berhasil dibuat" });

  } catch (error: any) {
    console.error("Withdraw error:", error);
    if (error.message === "Saldo tidak mencukupi") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

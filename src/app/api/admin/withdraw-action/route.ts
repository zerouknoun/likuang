import { NextRequest, NextResponse } from "next/server";
import { admin, adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { token, action } = await req.json();

    if (!token || !action || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Permintaan tidak valid" }, { status: 400 });
    }

    const snapshot = await adminDb.collection("withdrawals")
      .where("adminToken", "==", token)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ error: "Link sudah kadaluarsa atau tidak valid" }, { status: 404 });
    }

    const withdrawDoc = snapshot.docs[0];
    const withdrawData = withdrawDoc.data();

    if (withdrawData.status !== "PENDING") {
      return NextResponse.json({ error: "Permintaan pencairan ini sudah diproses sebelumnya" }, { status: 400 });
    }

    await adminDb.runTransaction(async (transaction) => {
      // Re-read withdrawal to ensure safety inside transaction
      const wDoc = await transaction.get(withdrawDoc.ref);
      if (!wDoc.exists) throw new Error("Withdrawal not found");
      
      const wData = wDoc.data();
      if (wData?.status !== "PENDING") {
        throw new Error("Already processed");
      }

      if (action === "approve") {
        transaction.update(withdrawDoc.ref, {
          status: "APPROVED",
          adminToken: admin.firestore.FieldValue.delete(),
          processedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      } else if (action === "reject") {
        const userRef = adminDb.collection("users").doc(wData.userId);
        
        transaction.update(withdrawDoc.ref, {
          status: "REJECTED",
          adminToken: admin.firestore.FieldValue.delete(),
          processedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Refund balance
        transaction.update(userRef, {
          balance: admin.firestore.FieldValue.increment(wData.amount)
        });
      }
    });

    return NextResponse.json({ success: true, message: "Berhasil diproses" });
  } catch (error: any) {
    console.error("Withdraw action error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

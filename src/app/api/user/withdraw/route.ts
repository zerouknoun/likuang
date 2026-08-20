import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { admin, adminDb } from "@/lib/firebaseAdmin";
import crypto from "crypto";
import nodemailer from "nodemailer";

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
    const adminToken = crypto.randomBytes(32).toString("hex");

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
        adminToken,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    const host = req.headers.get("host") || "likuang.vercel.app";
    const protocol = host.includes("localhost") ? "http" : "https";
    const approveUrl = `${protocol}://${host}/admin/withdraw/${adminToken}`;

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_PORT === "465",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const formatter = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });

      await transporter.sendMail({
        from: `"LinkUang Admin" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        subject: "Permintaan Pencairan Saldo Baru - LinkUang",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
            <h2 style="color: #4f46e5; text-align: center;">Permintaan Pencairan Saldo</h2>
            <p>Ada pengguna yang melakukan penarikan saldo:</p>
            <ul style="background: #f8fafc; padding: 20px; border-radius: 10px; list-style: none;">
              <li><strong>User Email:</strong> ${session.user.email}</li>
              <li><strong>Nominal:</strong> <span style="color: #10b981; font-weight: bold;">${formatter.format(parsedAmount)}</span></li>
              <li><strong>Metode:</strong> ${methodType} - ${provider}</li>
              <li><strong>Tujuan:</strong> ${accountNumber} (A.n ${accountName})</li>
            </ul>
            <p style="text-align: center; margin-top: 30px;">
              <a href="${approveUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Tinjau & Setujui</a>
            </p>
            <p style="text-align: center; font-size: 12px; color: #64748b; margin-top: 20px;">
              Link ini bersifat rahasia. Jangan berikan kepada siapapun.
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Gagal mengirim email admin:", emailErr);
    }

    return NextResponse.json({ success: true, message: "Permintaan pencairan berhasil dibuat" });

  } catch (error: any) {
    console.error("Withdraw error:", error);
    if (error.message === "Saldo tidak mencukupi") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

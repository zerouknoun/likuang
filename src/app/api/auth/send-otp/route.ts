import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { admin, adminDb } from "@/lib/firebaseAdmin";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email dan password diperlukan" }, { status: 400 });
    }

    const usersRef = adminDb.collection("users");
    let snapshot = await usersRef.where("email", "==", email).get();

    let userDoc: any;
    let isPending = false;

    if (!snapshot.empty) {
      userDoc = snapshot.docs[0];
    } else {
      const pendingRef = adminDb.collection("pending_users").doc(email);
      const pendingDoc = await pendingRef.get();
      if (pendingDoc.exists) {
        userDoc = pendingDoc;
        isPending = true;
      }
    }

    if (!userDoc) {
      return NextResponse.json({ message: "Email tidak ditemukan" }, { status: 404 });
    }

    const user = userDoc.data();

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: "Password salah" }, { status: 401 });
    }

    const otpCode = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await userDoc.ref.update({
      otpCode,
      otpExpires: admin.firestore.Timestamp.fromDate(otpExpires),
    });

    // Send Email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === "465", 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"LinkUang Security" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Kode OTP Login Anda - LinkUang",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #4f46e5; text-align: center;">Kode OTP Anda</h2>
          <p>Halo <strong>${user.name}</strong>,</p>
          <p>Seseorang mencoba masuk ke akun LinkUang Anda. Gunakan kode OTP berikut untuk melanjutkan proses login:</p>
          <div style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e293b; border-radius: 8px; margin: 20px 0;">
            ${otpCode}
          </div>
          <p style="color: #64748b; font-size: 14px;">Kode ini hanya berlaku selama 10 menit. Jangan berikan kode ini kepada siapapun.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "OTP berhasil dikirim ke email" }, { status: 200 });
  } catch (error: any) {
    console.error("Send OTP Error:", error);
    return NextResponse.json({ message: "Gagal mengirim OTP", error: error.message }, { status: 500 });
  }
}

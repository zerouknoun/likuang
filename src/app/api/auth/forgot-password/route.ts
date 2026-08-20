import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { admin, adminDb } from "@/lib/firebaseAdmin";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email diperlukan" }, { status: 400 });
    }

    const usersRef = adminDb.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      return NextResponse.json({ message: "Email tidak ditemukan" }, { status: 404 });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    const otpCode = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    await userDoc.ref.update({
      resetOtp: otpCode,
      resetOtpExpires: admin.firestore.Timestamp.fromDate(otpExpires),
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
      subject: "Reset Password Anda - LinkUang",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #4f46e5; text-align: center;">Kode Reset Password</h2>
          <p>Halo <strong>${user.name || 'Pengguna'}</strong>,</p>
          <p>Kami menerima permintaan untuk mengatur ulang kata sandi akun LinkUang Anda. Gunakan kode 6-digit berikut ini:</p>
          <div style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e293b; border-radius: 8px; margin: 20px 0;">
            ${otpCode}
          </div>
          <p style="color: #64748b; font-size: 14px;">Kode ini hanya berlaku selama 10 menit. Jika Anda tidak meminta reset password, abaikan email ini.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Kode reset berhasil dikirim ke email" }, { status: 200 });
  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ message: "Gagal mengirim kode reset", error: error.message }, { status: 500 });
  }
}

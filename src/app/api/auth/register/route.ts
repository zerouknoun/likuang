import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { admin, adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Semua field harus diisi" }, { status: 400 });
    }

    const usersRef = adminDb.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (!snapshot.empty) {
      return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Simpan ke pending_users dengan ID = email
    const pendingUsersRef = adminDb.collection("pending_users").doc(email);
    const newUserData = {
      name,
      email,
      password: hashedPassword,
      otpCode,
      otpExpires: admin.firestore.Timestamp.fromDate(otpExpires),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    await pendingUsersRef.set(newUserData);

    // Send Email
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_PORT === "465", // true for 465, false for 587
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"LinkUang Security" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Kode OTP Registrasi Anda - LinkUang",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
            <h2 style="color: #4f46e5; text-align: center;">Verifikasi Akun Baru</h2>
            <p>Halo <strong>${name}</strong>,</p>
            <p>Terima kasih telah mendaftar di LinkUang. Gunakan kode OTP berikut untuk menyelesaikan pendaftaran dan masuk ke akun Anda:</p>
            <div style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e293b; border-radius: 8px; margin: 20px 0;">
              ${otpCode}
            </div>
            <p style="color: #64748b; font-size: 14px;">Kode ini hanya berlaku selama 10 menit.</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Gagal mengirim email saat registrasi:", emailErr);
    }

    return NextResponse.json({ message: "Berhasil mendaftar, silakan periksa email untuk OTP", user: { id: pendingUsersRef.id, name, email } }, { status: 201 });
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server", error: error.message }, { status: 500 });
  }
}

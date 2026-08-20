import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { admin, adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ message: "Email, OTP, dan password baru diperlukan" }, { status: 400 });
    }

    // Validasi Password Baru
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json({ 
        message: "Password harus minimal 8 karakter, mengandung 1 huruf besar, 1 angka, dan 1 karakter unik." 
      }, { status: 400 });
    }

    const usersRef = adminDb.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      return NextResponse.json({ message: "Email tidak ditemukan" }, { status: 404 });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    // Verifikasi OTP
    if (user.resetOtp !== otp) {
      return NextResponse.json({ message: "Kode OTP tidak valid" }, { status: 401 });
    }

    // Verifikasi Waktu OTP
    const now = admin.firestore.Timestamp.now();
    if (user.resetOtpExpires && now.seconds > user.resetOtpExpires.seconds) {
      return NextResponse.json({ message: "Kode OTP telah kedaluwarsa, silakan minta ulang" }, { status: 401 });
    }

    // Hash Password Baru
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update Password & Hapus Data OTP Reset
    await userDoc.ref.update({
      password: hashedPassword,
      resetOtp: admin.firestore.FieldValue.delete(),
      resetOtpExpires: admin.firestore.FieldValue.delete(),
    });

    return NextResponse.json({ message: "Password berhasil diubah" }, { status: 200 });
  } catch (error: any) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan sistem", error: error.message }, { status: 500 });
  }
}

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { admin, adminDb } from "@/lib/firebaseAdmin";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        otp: { label: "OTP", type: "text", placeholder: "123456" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) {
          throw new Error("Email dan OTP harus diisi");
        }

        const usersRef = adminDb.collection("users");
        let snapshot = await usersRef.where("email", "==", credentials.email).get();

        let userDoc: any;
        let isPending = false;

        if (!snapshot.empty) {
          userDoc = snapshot.docs[0];
        } else {
          // Cari di pending_users
          const pendingRef = adminDb.collection("pending_users").doc(credentials.email);
          const pendingDoc = await pendingRef.get();
          if (pendingDoc.exists) {
            userDoc = pendingDoc;
            isPending = true;
          }
        }

        if (!userDoc) {
          throw new Error("Email tidak ditemukan");
        }

        let user = userDoc.data();

        if (!user.otpCode || !user.otpExpires) {
          throw new Error("Sesi OTP tidak valid, silakan ulangi login");
        }

        if (user.otpExpires.toDate() < new Date()) {
          throw new Error("Kode OTP sudah kadaluarsa");
        }

        if (user.otpCode !== credentials.otp) {
          throw new Error("Kode OTP salah");
        }

        // OTP is correct
        if (isPending) {
          // Move to users
          const newUserRef = usersRef.doc();
          const { otpCode, otpExpires, ...userData } = user;
          await newUserRef.set({
            ...userData,
            isVerified: true,
            verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          // Delete from pending
          await userDoc.ref.delete();
          // Update userDoc for return
          userDoc = { id: newUserRef.id }; 
        } else {
          // Clear OTP from DB
          await userDoc.ref.update({
            otpCode: admin.firestore.FieldValue.delete(),
            otpExpires: admin.firestore.FieldValue.delete(),
          });
        }

        return {
          id: userDoc.id,
          name: user.name,
          email: user.email,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

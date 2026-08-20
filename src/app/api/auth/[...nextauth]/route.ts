import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { admin, adminDb } from "@/lib/firebaseAdmin";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        otp: { label: "OTP", type: "text", placeholder: "123456" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error("Email harus diisi");
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

        if (credentials.password) {
          // Direct login with password
          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isMatch) {
            throw new Error("Password salah");
          }

          if (!isPending) {
            // Check lastActive for verified users
            const now = Date.now();
            const lastActive = user.lastActive?.toMillis() || 0;
            const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
            
            // If never logged in before (no lastActive) or > 1 week
            if (now - lastActive > oneWeekMs) {
              throw new Error("REQUIRE_OTP");
            }
          } else {
             // If pending, they MUST verify OTP first.
             throw new Error("REQUIRE_OTP");
          }
        } else if (credentials.otp) {
          // Login with OTP
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
              lastActive: admin.firestore.FieldValue.serverTimestamp(),
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
        } else {
          throw new Error("Password atau OTP harus diisi");
        }

        // Update lastActive if verified user
        if (!isPending && userDoc.ref) {
          await userDoc.ref.update({
            lastActive: admin.firestore.FieldValue.serverTimestamp()
          });
        }

        return {
          id: userDoc.id || userDoc.ref?.id,
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

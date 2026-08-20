import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_SERVICE_ACCOUNT: !!process.env.FIREBASE_SERVICE_ACCOUNT,
    SMTP_USER: !!process.env.SMTP_USER,
    SMTP_PASS: !!process.env.SMTP_PASS,
    SMTP_HOST: process.env.SMTP_HOST || "MISSING",
    SMTP_PORT: process.env.SMTP_PORT || "MISSING",
    NODE_ENV: process.env.NODE_ENV,
  });
}

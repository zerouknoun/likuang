import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_PRIVATE_KEY_LENGTH: process.env.FIREBASE_PRIVATE_KEY?.length,
    FIREBASE_PRIVATE_KEY_STARTS_WITH: process.env.FIREBASE_PRIVATE_KEY?.substring(0, 30),
    FIREBASE_PRIVATE_KEY_ENDS_WITH: process.env.FIREBASE_PRIVATE_KEY?.slice(-30),
    NODE_ENV: process.env.NODE_ENV,
    HAS_ALL: !!(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)
  });
}

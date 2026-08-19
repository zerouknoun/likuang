import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { admin, adminDb } from "@/lib/firebaseAdmin";

// Generate random alphanumeric string
function generateShortCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { original_url } = await req.json();

    if (!original_url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Basic URL validation
    try {
      new URL(original_url);
    } catch (_) {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const linksRef = adminDb.collection("links");

    // Generate unique short_code
    let short_code = generateShortCode();
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      const existing = await linksRef.where("short_code", "==", short_code).get();
      if (existing.empty) {
        isUnique = true;
      } else {
        short_code = generateShortCode();
        attempts++;
      }
    }

    if (!isUnique) {
      return NextResponse.json({ error: "Failed to generate unique code, please try again" }, { status: 500 });
    }

    const newLinkRef = linksRef.doc();
    const newLinkData = {
      userId,
      original_url,
      short_code,
      clicks: 0,
      earnings: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await newLinkRef.set(newLinkData);

    return NextResponse.json({ success: true, link: { _id: newLinkRef.id, ...newLinkData } }, { status: 201 });
  } catch (error: any) {
    console.error("Create link error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

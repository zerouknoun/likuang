import { NextRequest, NextResponse } from "next/server";
import { admin, adminDb } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;

    const linksRef = adminDb.collection("links");
    const linkSnapshot = await linksRef.where("short_code", "==", code).get();
    
    if (linkSnapshot.empty) {
      return NextResponse.json({ error: "Link tidak ditemukan" }, { status: 404 });
    }

    const linkDoc = linkSnapshot.docs[0];
    const link = linkDoc.data();

    // Get IP address from headers
    const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";

    const clickLogsRef = adminDb.collection("clickLogs");
    
    // Calculate 24 hours ago timestamp
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const existingClick = await clickLogsRef
      .where("linkId", "==", linkDoc.id)
      .where("ipAddress", "==", ip)
      .where("clickedAt", ">", admin.firestore.Timestamp.fromDate(twentyFourHoursAgo))
      .get();

    if (existingClick.empty) {
      const EARNING_PER_CLICK = 15; // Rp 15 per click
      
      const batch = adminDb.batch();

      // Update Link stats
      batch.update(linkDoc.ref, {
        clicks: admin.firestore.FieldValue.increment(1),
        earnings: admin.firestore.FieldValue.increment(EARNING_PER_CLICK)
      });

      // Update User balance
      const userRef = adminDb.collection("users").doc(link.userId);
      batch.update(userRef, {
        balance: admin.firestore.FieldValue.increment(EARNING_PER_CLICK)
      });

      // Save click log to prevent fraud
      const newClickLogRef = clickLogsRef.doc();
      batch.set(newClickLogRef, {
        linkId: linkDoc.id,
        ipAddress: ip,
        clickedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      await batch.commit();
    }

    return NextResponse.json({ success: true, original_url: link.original_url });
  } catch (error: any) {
    console.error("Link tracking error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

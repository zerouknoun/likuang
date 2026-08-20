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

    // Dapatkan IP address (menangani proxy Vercel)
    let ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    if (ip.includes(",")) {
      ip = ip.split(",")[0].trim();
    }

    // Dapatkan atau buat Device ID dari Cookie
    const deviceIdCookie = req.cookies.get("device_id")?.value;
    let deviceId = deviceIdCookie;
    let isNewDevice = false;

    if (!deviceId) {
      deviceId = crypto.randomUUID();
      isNewDevice = true;
    }

    const clickLogsRef = adminDb.collection("clickLogs");
    
    // Ambil semua log klik untuk link ini
    const existingClickSnapshot = await clickLogsRef
      .where("linkId", "==", linkDoc.id)
      .get();

    // Cek apakah IP atau Device ID ini pernah mengklik link ini sebelumnya (Tanpa batas waktu / seumur hidup)
    const hasClickedBefore = existingClickSnapshot.docs.some(doc => {
      const data = doc.data();
      return data.ipAddress === ip || (data.deviceId && data.deviceId === deviceId);
    });

    const response = NextResponse.json({ success: true, original_url: link.original_url });

    // Set cookie jika ini perangkat baru
    if (isNewDevice) {
      response.cookies.set({
        name: "device_id",
        value: deviceId,
        maxAge: 60 * 60 * 24 * 365 * 5, // 5 Tahun
        httpOnly: true,
        path: "/",
        sameSite: "lax",
      });
    }

    // Jika belum pernah klik, berikan saldo
    if (!hasClickedBefore) {
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
        deviceId: deviceId,
        clickedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      await batch.commit();
    }

    return response;
  } catch (error: any) {
    console.error("Link tracking error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

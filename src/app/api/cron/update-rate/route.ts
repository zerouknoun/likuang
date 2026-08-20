import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  try {
    // 1. Verifikasi Cron Secret untuk keamanan
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clickadillaToken = process.env.CLICKADILLA_API_TOKEN;
    if (!clickadillaToken) {
      return NextResponse.json({ error: "CLICKADILLA_API_TOKEN is missing" }, { status: 500 });
    }

    // 2. Ambil tanggal kemarin
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Format YYYY-MM-DD
    const yyyy = yesterday.getFullYear();
    const mm = String(yesterday.getMonth() + 1).padStart(2, '0');
    const dd = String(yesterday.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    // 3. Fetch Clickadilla API
    const apiUrl = `https://publishers.clickadilla.com/backend/api/public/stats?token=${clickadillaToken}&date1=${dateStr}&date2=${dateStr}&fields=date,impressions,clicks,money&limit=500&offset=0`;
    
    const clickadillaRes = await fetch(apiUrl);
    if (!clickadillaRes.ok) {
      throw new Error(`Clickadilla API Error: ${clickadillaRes.statusText}`);
    }
    
    const clickadillaData = await clickadillaRes.json();
    
    // Asumsikan struktur response Clickadilla mengembalikan array objek dengan properti "money"
    let totalMoneyUSD = 0;
    if (clickadillaData && Array.isArray(clickadillaData.data)) {
      totalMoneyUSD = clickadillaData.data.reduce((acc: number, item: any) => acc + (parseFloat(item.money) || 0), 0);
    } else if (clickadillaData && Array.isArray(clickadillaData)) {
      totalMoneyUSD = clickadillaData.reduce((acc: number, item: any) => acc + (parseFloat(item.money) || 0), 0);
    }

    // 4. Konversi USD ke IDR (Gunakan kurs default Rp 15.500)
    const KURS_IDR = 15500;
    const totalMoneyIDR = totalMoneyUSD * KURS_IDR;

    // 5. Hitung jumlah klik unik (sistem) pada hari kemarin
    const startOfYesterday = new Date(yesterday);
    startOfYesterday.setHours(0, 0, 0, 0);
    
    const endOfYesterday = new Date(yesterday);
    endOfYesterday.setHours(23, 59, 59, 999);

    const clickLogsRef = adminDb.collection("clickLogs");
    const snapshot = await clickLogsRef
      .where("clickedAt", ">=", startOfYesterday)
      .where("clickedAt", "<=", endOfYesterday)
      .get();
      
    const systemClicks = snapshot.size;

    // 6. Kalkulasi Dynamic Rate
    let dynamicRate = 5; // Default safety net (Rp 5) jika tidak ada data

    if (systemClicks > 0 && totalMoneyIDR > 0) {
      const ratePerClickAsli = totalMoneyIDR / systemClicks;
      const rateUser = ratePerClickAsli * 0.7; // 70% untuk user
      
      // Pembulatan ke bawah, minimal Rp 5
      dynamicRate = Math.max(5, Math.floor(rateUser));
    }

    // 7. Simpan ke database
    await adminDb.collection("settings").doc("system").set({
      ratePerClick: dynamicRate,
      lastUpdatedAt: new Date(),
      debugInfo: {
        date: dateStr,
        totalMoneyUSD,
        totalMoneyIDR,
        systemClicks
      }
    }, { merge: true });

    return NextResponse.json({ 
      success: true, 
      ratePerClick: dynamicRate,
      debug: { dateStr, totalMoneyUSD, systemClicks }
    });

  } catch (error: any) {
    console.error("Cron Update Rate Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

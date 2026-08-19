import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Fetch user for balance
    const userDoc = await adminDb.collection("users").doc(userId).get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const user = userDoc.data();

    // Fetch user's links
    const linksSnapshot = await adminDb.collection("links")
      .where("userId", "==", userId)
      .get();
      
    let links = linksSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    
    // Sort manually
    links.sort((a: any, b: any) => {
       const timeA = a.createdAt?.toDate().getTime() || 0;
       const timeB = b.createdAt?.toDate().getTime() || 0;
       return timeB - timeA;
    });

    // Calculate total stats
    const totalClicks = links.reduce((acc, link: any) => acc + (link.clicks || 0), 0);

    return NextResponse.json({ 
      success: true, 
      user: {
        name: user?.name,
        email: user?.email,
        balance: user?.balance || 0,
      },
      links,
      stats: {
        totalClicks
      }
    });
  } catch (error: any) {
    console.error("Fetch stats error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

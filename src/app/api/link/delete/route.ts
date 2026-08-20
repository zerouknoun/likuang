import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { adminDb } from "@/lib/firebaseAdmin";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Link ID diperlukan" }, { status: 400 });
    }

    const userId = (session.user as any).id;
    const linkRef = adminDb.collection("links").doc(id);
    const linkDoc = await linkRef.get();

    if (!linkDoc.exists) {
      return NextResponse.json({ error: "Link tidak ditemukan" }, { status: 404 });
    }

    if (linkDoc.data()?.userId !== userId) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    await linkRef.delete();
    
    return NextResponse.json({ success: true, message: "Link berhasil dihapus" });
  } catch (error) {
    console.error("Delete Link Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

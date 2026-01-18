import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("DEBUG SESSION:", session);
    
    return NextResponse.json({
      session: session,
      hasSession: !!session,
      hasUser: !!session?.user,
      userEmail: session?.user?.email,
      userRole: session?.user?.role,
    });
  } catch (error) {
    console.error("DEBUG SESSION ERROR:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

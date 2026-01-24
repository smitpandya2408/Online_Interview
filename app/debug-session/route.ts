import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    // Everyone has admin access now
    const session = {
      user: {
        email: "admin@local",
        name: "Admin",
        role: "admin"
      }
    };
    
    return NextResponse.json({
      session: session,
      hasSession: true,
      hasUser: true,
      userEmail: session.user.email,
      userRole: session.user.role,
    });
  } catch (error) {
    console.error("DEBUG SESSION ERROR:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Everyone has access now - no auth checks needed
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/create", "/api/create-room"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/create") ||
    pathname.startsWith("/api/create-room")
  ) {
    const token = await getToken({ req: request });
    
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    const role = token.role;
    if (role !== "admin" && role !== "interviewer") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/create", "/api/create-room"],
};

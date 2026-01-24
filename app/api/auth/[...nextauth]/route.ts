import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Ensure NEXTAUTH_URL is set for Railway deployments
if (process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_URL) {
  console.warn("WARNING: NEXTAUTH_URL is not set. This may cause authentication issues on production.");
  console.warn("Please set NEXTAUTH_URL environment variable in your Railway settings.");
}

const handler = NextAuth(authOptions);

export const runtime = "nodejs";

export { handler as GET, handler as POST };

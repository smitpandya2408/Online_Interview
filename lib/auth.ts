import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { getMongoCollections, type DbUserRole } from "@/lib/db";

function parseRole(role: unknown): DbUserRole {
  if (role === "admin" || role === "interviewer" || role === "candidate") return role;
  return "interviewer";
}

console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "SET" : "NOT SET");
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);

// Fallback for production if environment variables are not set
const secret = process.env.NEXTAUTH_SECRET || "test-secret-key-for-development-only-change-in-production";
const nextAuthUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: secret,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
  },
  useSecureCookies: false, // Disable secure cookies for localhost testing
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("AUTHORIZE FUNCTION CALLED");
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;
        console.log("CREDENTIALS:", { email, password: "***" });
        
        if (!email || !password) {
          console.log("MISSING EMAIL OR PASSWORD");
          return null;
        }

        // Temporary hardcoded admin for testing
        if (email === "admin@gmail.com" && password === "admin123") {
          console.log("HARDCODED ADMIN LOGIN SUCCESSFUL");
          return {
            id: "1",
            email: "admin@gmail.com",
            name: "Admin",
            role: "admin",
          };
        }
        
        console.log("NO MATCH FOUND");

        const { Users } = await getMongoCollections();
        let user = await Users.findOne({ email });

        // Optional bootstrap: if no user exists, allow creating an admin via env.
        if (!user) {
          const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
          const adminPassword = process.env.ADMIN_PASSWORD;

          if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
            const passwordHash = await bcrypt.hash(adminPassword, 10);
            const createdAt = new Date();
            await Users.insertOne({
              email,
              name: "Admin",
              passwordHash,
              role: "admin",
              createdAt,
            });
            user = await Users.findOne({ email });
          }
        }

        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: String(user._id),
          email: user.email,
          name: user.name || user.email,
          role: parseRole(user.role),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};

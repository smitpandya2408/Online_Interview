import "next-auth";

declare module "next-auth" {
  interface User {
    role?: "admin" | "interviewer" | "candidate";
  }

  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "admin" | "interviewer" | "candidate";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin" | "interviewer" | "candidate";
  }
}

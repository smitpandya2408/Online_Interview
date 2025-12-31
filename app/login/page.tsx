"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    console.log("LOGIN FORM SUBMITTED");
    console.log("EMAIL:", email);
    console.log("PASSWORD:", "***");

    try {
      console.log("CALLING SIGNIN FUNCTION...");
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      console.log("SIGNIN RESULT:", result);
      console.log("CALLBACK URL:", callbackUrl);

      if (result?.error) {
        console.log("SIGNIN ERROR:", result.error);
        setError("Invalid email or password");
      } else if (result?.ok) {
        console.log("SIGNIN SUCCESS, REDIRECTING TO:", callbackUrl);
        console.log("CURRENT URL:", window.location.href);
        
        // Wait a moment for session to be established, then redirect
        setTimeout(() => {
          console.log("Attempting redirect to:", callbackUrl);
          router.push(callbackUrl);
        }, 500);
      } else {
        console.log("UNEXPECTED RESULT:", result);
        setError("An error occurred during login");
      }
    } catch (error) {
      console.log("SIGNIN EXCEPTION:", error);
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full px-4 py-10 sm:px-8 lg:px-10 2xl:px-16">
        <div className="mx-auto w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>
                Interviewers/Admins sign in to create rooms and access the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-900 dark:text-zinc-50">Email</span>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-900 dark:text-zinc-50">Password</span>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </label>

                <Button type="submit" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>

                {error ? (
                  <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:ring-rose-900/60">
                    {error}
                  </div>
                ) : null}

                <Link
                  href="/"
                  className="text-sm font-medium text-slate-700 hover:text-slate-950 dark:text-zinc-300 dark:hover:text-white"
                >
                  Back to Home
                </Link>
              </form>
            </CardContent>
          </Card>

          <div className="mt-4 text-xs text-slate-500 dark:text-zinc-500">
            First-time setup: set <span className="font-mono">ADMIN_EMAIL</span> and <span className="font-mono">ADMIN_PASSWORD</span> in <span className="font-mono">.env.local</span> to bootstrap an admin.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-gradient-to-b from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900" />}>
      <LoginForm />
    </Suspense>
  );
}
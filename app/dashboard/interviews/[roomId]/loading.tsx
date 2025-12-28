import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900">
      <main className="w-full px-4 py-8 sm:px-8 lg:px-10 2xl:px-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="h-4 w-24 animate-pulse rounded-lg bg-slate-200 dark:bg-zinc-800" />
            <div className="mt-2 h-7 w-72 animate-pulse rounded-lg bg-slate-200 dark:bg-zinc-800" />
            <div className="mt-3 h-4 w-64 animate-pulse rounded-lg bg-slate-200 dark:bg-zinc-800" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-20 animate-pulse rounded-xl bg-slate-200 dark:bg-zinc-800" />
            <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-200 dark:bg-zinc-800" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                <div className="h-4 w-24 animate-pulse rounded-lg bg-slate-200 dark:bg-zinc-800" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 animate-pulse rounded-2xl bg-slate-100 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:ring-zinc-800" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="h-4 w-20 animate-pulse rounded-lg bg-slate-200 dark:bg-zinc-800" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-10 w-40 animate-pulse rounded-xl bg-slate-200 dark:bg-zinc-800" />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="h-4 w-28 animate-pulse rounded-lg bg-slate-200 dark:bg-zinc-800" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 animate-pulse rounded-2xl bg-slate-100 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:ring-zinc-800" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="h-4 w-36 animate-pulse rounded-lg bg-slate-200 dark:bg-zinc-800" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 animate-pulse rounded-2xl bg-slate-100 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:ring-zinc-800" />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

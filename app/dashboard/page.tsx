import { redirect } from "next/navigation";

import { AdminDashboardUI } from "@/components/dashboard/admin-dashboard-ui";
import { getMongoCollections } from "@/lib/db";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams?: Promise<{ status?: string }>;
};

function normalizeStatus(input: unknown) {
  if (input === "scheduled" || input === "ongoing" || input === "completed") return input;
  if (input === "created" || input === "started" || input === "ended") return input;
  return "all";
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  // Everyone has admin access now
  const role = "admin";

  const sp = (await searchParams) || {};
  const statusFilter = normalizeStatus(sp.status);

  const { Interviews } = await getMongoCollections();

  const query: Record<string, unknown> = {};
  if (statusFilter !== "all") {
    if (statusFilter === "scheduled") query.status = { $in: ["scheduled", "created"] };
    if (statusFilter === "ongoing") query.status = { $in: ["ongoing", "started"] };
    if (statusFilter === "completed") query.status = { $in: ["completed", "ended"] };
    if (statusFilter === "created" || statusFilter === "started" || statusFilter === "ended") {
      query.status = statusFilter;
    }
  }

  const [interviews, totalInterviews, ratingAgg, statusAgg] = await Promise.all([
    Interviews.find(query).sort({ createdAt: -1 }).limit(100).toArray(),
    Interviews.countDocuments({}),
    Interviews.aggregate([
      { $match: { rating: { $type: "number" } } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]).toArray(),
    Interviews.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]).toArray(),
  ]);

  const avgRating =
    ratingAgg.length > 0 && typeof ratingAgg[0]?.avg === "number" ? (ratingAgg[0].avg as number) : null;
  const ratedCount =
    ratingAgg.length > 0 && typeof ratingAgg[0]?.count === "number" ? (ratingAgg[0].count as number) : 0;

  const byStatus = new Map<string, number>();
  for (const row of statusAgg) {
    if (!row || typeof row !== "object") continue;
    const status = (row as { _id?: unknown })._id;
    const count = (row as { count?: unknown }).count;
    if (typeof status === "string" && typeof count === "number") {
      byStatus.set(status, count);
    }
  }

  const scheduledCount = (byStatus.get("scheduled") || 0) + (byStatus.get("created") || 0);
  const ongoingCount = (byStatus.get("ongoing") || 0) + (byStatus.get("started") || 0);
  const completedCount = (byStatus.get("completed") || 0) + (byStatus.get("ended") || 0);

  return (
    <>
      <AdminDashboardUI
        user={{ email: "admin@local", name: "Admin" }}
        interviews={interviews}
        statusFilter={statusFilter}
        totalInterviews={totalInterviews}
        scheduledCount={scheduledCount}
        ongoingCount={ongoingCount}
        completedCount={completedCount}
        avgRating={avgRating}
        ratedCount={ratedCount}
      />
    </>
  );
}

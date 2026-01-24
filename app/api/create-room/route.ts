import { NextRequest, NextResponse } from "next/server";

import { nanoid } from "nanoid";

import { getMongoCollections } from "@/lib/db";

function parseDurationMinutes(input: unknown) {
  const n = typeof input === "number" ? input : Number(input);
  if (!Number.isFinite(n)) return null;
  const rounded = Math.floor(n);
  if (rounded < 1 || rounded > 480) return null;
  return rounded;
}

function parseScheduledAt(input: unknown) {
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

export async function POST(req: NextRequest) {
  try {
    // Everyone has admin access now
    const role = "admin";

    const body = (await req.json().catch(() => ({}))) as {
      durationMinutes?: unknown;
      scheduledAt?: unknown;
    };
    const durationMinutes = parseDurationMinutes(body.durationMinutes) ?? 60;

    const scheduledAt = parseScheduledAt(body.scheduledAt);
    const now = new Date();
    const isScheduled = !!scheduledAt && scheduledAt.getTime() > now.getTime();

    const { Interviews } = await getMongoCollections();
    const roomId = nanoid(10);
    const interviewDoc = {
      roomId,
      title: "Interview Session",
      durationMinutes,
      createdAt: new Date(),
      status: (isScheduled ? "scheduled" : "created") as "scheduled" | "created",
      scheduledAt: isScheduled ? scheduledAt : undefined,
      code: "",
      language: "javascript" as const,
    };
    await Interviews.insertOne(interviewDoc);

    return NextResponse.json({ roomId }, { status: 201 });
  } catch (err) {
    console.error("Failed to create room:", err);
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}

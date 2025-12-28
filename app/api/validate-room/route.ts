import { NextRequest, NextResponse } from "next/server";

import { getMongoCollections } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { roomId } = await req.json();
    if (!roomId || typeof roomId !== "string") {
      return NextResponse.json({ error: "roomId is required" }, { status: 400 });
    }

    const { Interviews } = await getMongoCollections();
    const interview = await Interviews.findOne({ roomId });
    if (!interview) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (interview.status === "ended") {
      return NextResponse.json({ error: "Meeting ended" }, { status: 410 });
    }

    const scheduledAt = (interview as unknown as { scheduledAt?: unknown }).scheduledAt;
    if (scheduledAt) {
      const scheduledDate = new Date(scheduledAt as any);
      if (!Number.isNaN(scheduledDate.getTime())) {
        const now = new Date();
        const status = (interview as unknown as { status?: unknown }).status;
        const isNotStarted = status === "scheduled" || status === "created";
        if (isNotStarted && scheduledDate.getTime() > now.getTime()) {
          return NextResponse.json(
            {
              error: `Interview is scheduled for ${scheduledDate.toLocaleString()}`,
              scheduledAt: scheduledDate.toISOString(),
            },
            { status: 403 }
          );
        }
      }
    }

    return NextResponse.json({ roomId }, { status: 200 });
  } catch (err) {
    console.error("Failed to validate room:", err);
    return NextResponse.json({ error: "Failed to validate room" }, { status: 500 });
  }
}

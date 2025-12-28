import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { getMongoCollections } from "@/lib/db";

type RouteContext = {
  params: Promise<{ roomId: string }>;
};

function assertInterviewerOrAdmin(role: unknown) {
  return role === "admin" || role === "interviewer";
}

export async function GET(_: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!assertInterviewerOrAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { roomId } = await context.params;
  const { Interviews } = await getMongoCollections();
  const interview = await Interviews.findOne(
    { roomId },
    { projection: { rating: 1 } }
  );

  if (!interview) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json(
    { rating: typeof interview.rating === "number" ? interview.rating : null },
    { status: 200 }
  );
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!assertInterviewerOrAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { roomId } = await context.params;
  const body = (await req.json()) as { rating?: unknown };

  const ratingNum = typeof body.rating === "number" ? body.rating : NaN;
  if (!Number.isFinite(ratingNum) || ratingNum < 0 || ratingNum > 5) {
    return NextResponse.json(
      { error: "rating must be a number between 0 and 5" },
      { status: 400 }
    );
  }

  const { Interviews } = await getMongoCollections();
  const result = await Interviews.updateOne({ roomId }, { $set: { rating: ratingNum } });
  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

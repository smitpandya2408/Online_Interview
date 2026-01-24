import { NextRequest, NextResponse } from "next/server";

import { getMongoCollections } from "@/lib/db";

type RouteContext = {
  params: Promise<{ roomId: string }>;
};

// Everyone can access now
function assertInterviewerOrAdmin(role: unknown) {
  return true;
}

export async function GET(_: NextRequest, context: RouteContext) {
  // Everyone has admin access now
  const role = "admin";

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
  // Everyone has admin access now
  const role = "admin";

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

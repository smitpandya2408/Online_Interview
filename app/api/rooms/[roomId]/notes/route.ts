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
    { projection: { notes: 1 } }
  );

  if (!interview) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json(
    { notes: typeof interview.notes === "string" ? interview.notes : "" },
    { status: 200 }
  );
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  // Everyone has admin access now
  const role = "admin";

  const { roomId } = await context.params;
  const body = (await req.json()) as { notes?: unknown };
  const notes = typeof body.notes === "string" ? body.notes : "";

  const { Interviews } = await getMongoCollections();
  const result = await Interviews.updateOne({ roomId }, { $set: { notes } });
  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

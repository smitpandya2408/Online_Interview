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

    return NextResponse.json({ roomId }, { status: 200 });
  } catch (err) {
    console.error("Failed to validate room:", err);
    return NextResponse.json({ error: "Failed to validate room" }, { status: 500 });
  }
}

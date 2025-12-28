import { NextRequest, NextResponse } from "next/server";

import { getMongoCollections } from "@/lib/db";

type RouteContext = {
  params: Promise<{ roomId: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  const { roomId } = await context.params;

  const { Interviews, Messages } = await getMongoCollections();
  const interview = await Interviews.findOne(
    { roomId },
    { projection: { _id: 1 } }
  );

  if (!interview) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const url = new URL(req.url);
  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : 200;
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 500) : 200;

  const messages = await Messages.find({ roomId })
    .sort({ createdAt: 1 })
    .limit(safeLimit)
    .toArray();

  return NextResponse.json(
    {
      messages: messages.map((m) => ({
        id: String(m._id),
        roomId: m.roomId,
        sender: m.sender,
        text: m.text,
        createdAt: new Date(m.createdAt).toISOString(),
      })),
    },
    { status: 200 }
  );
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { roomId } = await context.params;
    const body = (await req.json()) as { sender?: unknown; text?: unknown };

    const senderRaw = typeof body.sender === "string" ? body.sender : "Anonymous";
    const textRaw = typeof body.text === "string" ? body.text : "";

    const sender = senderRaw.trim().slice(0, 60) || "Anonymous";
    const text = textRaw.trim();

    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }
    if (text.length > 2000) {
      return NextResponse.json({ error: "text is too long" }, { status: 400 });
    }

    const { Interviews, Messages } = await getMongoCollections();
    const interview = await Interviews.findOne(
      { roomId },
      { projection: { _id: 1 } }
    );

    if (!interview) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const createdAt = new Date();
    const result = await Messages.insertOne({ roomId, sender, text, createdAt });

    return NextResponse.json(
      {
        message: {
          id: String(result.insertedId),
          roomId,
          sender,
          text,
          createdAt: createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Failed to save message:", err);
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}

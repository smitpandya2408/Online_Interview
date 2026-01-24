import { NextRequest, NextResponse } from "next/server";

import { getMongoCollections } from "@/lib/db";

type RouteContext = {
  params: Promise<{ roomId: string }>;
};

// Everyone can access now
function assertInterviewerOrAdmin(role: unknown) {
  return true;
}

export async function GET(req: NextRequest, context: RouteContext) {
  // Everyone has admin access now
  const role = "admin";

  const { roomId } = await context.params;

  const url = new URL(req.url);
  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : 50;
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 500) : 50;

  const { CodeSnapshots } = await getMongoCollections();
  const snapshots = await CodeSnapshots.find({ roomId })
    .sort({ createdAt: -1 })
    .limit(safeLimit)
    .toArray();

  return NextResponse.json(
    {
      snapshots: snapshots.map((s) => ({
        id: String(s._id),
        roomId: s.roomId,
        code: s.code,
        language: s.language,
        clientId: s.clientId,
        createdAt: new Date(s.createdAt).toISOString(),
      })),
    },
    { status: 200 }
  );
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { roomId } = await context.params;
    const body = (await req.json()) as {
      code?: unknown;
      language?: unknown;
      clientId?: unknown;
    };

    const code = typeof body.code === "string" ? body.code : "";
    const language = body.language === "python" ? "python" : "javascript";
    const clientId = typeof body.clientId === "string" ? body.clientId.trim().slice(0, 120) : undefined;

    if (code.length > 200_000) {
      return NextResponse.json({ error: "code is too large" }, { status: 400 });
    }

    const { Interviews, CodeSnapshots } = await getMongoCollections();
    const interview = await Interviews.findOne(
      { roomId },
      { projection: { _id: 1 } }
    );

    if (!interview) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const createdAt = new Date();
    const result = await CodeSnapshots.insertOne({
      roomId,
      code,
      language,
      clientId,
      createdAt,
    });

    await Interviews.updateOne({ roomId }, { $set: { code, language } });

    return NextResponse.json(
      {
        snapshot: {
          id: String(result.insertedId),
          roomId,
          code,
          language,
          clientId,
          createdAt: createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Failed to save code snapshot:", err);
    return NextResponse.json({ error: "Failed to save code snapshot" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

import { getServerSession } from "next-auth/next";

import { nanoid } from "nanoid";

import { authOptions } from "@/lib/auth";
import { getMongoCollections } from "@/lib/db";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = session.user.role;
    if (role !== "admin" && role !== "interviewer") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { Interviews } = await getMongoCollections();
    const roomId = nanoid(10);
    await Interviews.insertOne({
      roomId,
      title: "Interview Session",
      createdAt: new Date(),
      status: "created",
      code: "",
      language: "javascript",
    });

    return NextResponse.json({ roomId }, { status: 201 });
  } catch (err) {
    console.error("Failed to create room:", err);
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}

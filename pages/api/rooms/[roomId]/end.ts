import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { getMongoCollections } from "@/lib/db";

function assertInterviewerOrAdmin(role: unknown) {
  return role === "admin" || role === "interviewer";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const roomIdParam = req.query.roomId;
  const roomId = Array.isArray(roomIdParam) ? roomIdParam[0] : roomIdParam;

  if (!roomId || typeof roomId !== "string") {
    res.status(400).json({ error: "roomId is required" });
    return;
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    const isPrivileged = assertInterviewerOrAdmin(session?.user?.role);

    const { Interviews } = await getMongoCollections();
    const interview = await Interviews.findOne({ roomId });

    if (!interview) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    if (!isPrivileged) {
      const durationMinutes =
        typeof interview.durationMinutes === "number" && Number.isFinite(interview.durationMinutes)
          ? interview.durationMinutes
          : 60;

      const startedAtMs = interview.startedAt ? new Date(interview.startedAt).getTime() : NaN;
      const endAtMs = startedAtMs + durationMinutes * 60 * 1000;

      const canTimeoutEnd =
        Number.isFinite(startedAtMs) && Number.isFinite(endAtMs) && Date.now() >= endAtMs;

      if (!canTimeoutEnd) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
    }

    const endedAt = new Date();

    await Interviews.updateOne(
      { roomId, status: { $ne: "ended" } },
      { $set: { status: "ended", endedAt } }
    );

    const io = (res.socket as unknown as { server?: { io?: { to: (rid: string) => { emit: (event: string, payload: unknown) => void } } } })
      .server?.io;

    io?.to(roomId).emit("room:ended", {
      roomId,
      endedAt: endedAt.toISOString(),
    });

    res.status(200).json({ ok: true, roomId, endedAt: endedAt.toISOString() });
  } catch (err) {
    console.error("Failed to end room:", err);
    res.status(500).json({ error: "Failed to end room" });
  }
}

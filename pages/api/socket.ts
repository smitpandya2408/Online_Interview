import type { NextApiRequest } from "next";
import type { NextApiResponse } from "next";
import { Server as NetServer } from "http";

import { Server as SocketIOServer } from "socket.io";

import { getMongoCollections } from "@/lib/db";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(_: NextApiRequest, res: NextApiResponseWithSocket) {
  if (res.socket.server.io) {
    res.status(200).json({ ok: true });
    return;
  }

  const io = new SocketIOServer(res.socket.server, {
    path: "/api/socketio",
    addTrailingSlash: false,
  });

  res.socket.server.io = io;

  const roomPeers = new Map<string, Set<string>>();

  io.on("connection", (socket) => {
    let currentRoomId: string | null = null;
    let currentPeerId: string | null = null;

    socket.on("room:join", (roomId: string) => {
      if (!roomId || typeof roomId !== "string") return;
      currentRoomId = roomId;
      socket.join(roomId);
    });

    socket.on("webrtc:register", (payload: { roomId?: string; peerId?: string }) => {
      const roomId = payload.roomId?.trim();
      const peerId = payload.peerId?.trim();
      if (!roomId || !peerId) return;

      currentRoomId = roomId;
      currentPeerId = peerId;

      socket.join(roomId);

      const set = roomPeers.get(roomId) || new Set<string>();
      set.add(peerId);
      roomPeers.set(roomId, set);

      socket.emit("webrtc:peers", Array.from(set).filter((id) => id !== peerId));
      socket.to(roomId).emit("webrtc:peer-joined", peerId);
    });

    socket.on(
      "chat:send",
      async (payload: { roomId?: string; sender?: string; text?: string }) => {
        try {
          const roomId = payload.roomId?.trim();
          const sender = (payload.sender || "Anonymous").trim();
          const text = payload.text?.trim();

          if (!roomId || !text) return;

          const { Messages } = await getMongoCollections();
          const createdAt = new Date();
          const result = await Messages.insertOne({ roomId, sender, text, createdAt });

          io.to(roomId).emit("chat:message", {
            id: String(result.insertedId),
            roomId,
            sender,
            text,
            createdAt: createdAt.toISOString(),
          });
        } catch (err) {
          console.error("chat:send failed", err);
        }
      }
    );

    socket.on(
      "code:join",
      async (payload: { roomId?: string; clientId?: string }) => {
        try {
          const roomId = payload.roomId?.trim();
          if (!roomId) return;

          socket.join(roomId);

          const { Interviews } = await getMongoCollections();
          const interview = await Interviews.findOne({ roomId });
          if (!interview) return;

          socket.emit("code:state", {
            roomId,
            code: typeof interview.code === "string" ? interview.code : "",
            language: interview.language || "javascript",
            clientId: payload.clientId,
          });
        } catch (err) {
          console.error("code:join failed", err);
        }
      }
    );

    socket.on(
      "code:update",
      async (payload: {
        roomId?: string;
        code?: string;
        language?: "javascript" | "python";
        clientId?: string;
      }) => {
        try {
          const roomId = payload.roomId?.trim();
          if (!roomId) return;
          const code = typeof payload.code === "string" ? payload.code : "";
          const language = payload.language === "python" ? "python" : "javascript";

          socket.join(roomId);

          const { Interviews, CodeSnapshots } = await getMongoCollections();
          await Interviews.updateOne({ roomId }, { $set: { code, language } });

          await CodeSnapshots.insertOne({
            roomId,
            code,
            language,
            clientId: payload.clientId,
            createdAt: new Date(),
          });

          io.to(roomId).emit("code:update", {
            roomId,
            code,
            language,
            clientId: payload.clientId,
          });
        } catch (err) {
          console.error("code:update failed", err);
        }
      }
    );

    socket.on("disconnect", () => {
      if (!currentRoomId || !currentPeerId) return;
      const set = roomPeers.get(currentRoomId);
      if (!set) return;

      set.delete(currentPeerId);
      if (set.size === 0) {
        roomPeers.delete(currentRoomId);
      } else {
        roomPeers.set(currentRoomId, set);
      }

      socket.to(currentRoomId).emit("webrtc:peer-left", currentPeerId);
    });
  });

  res.status(201).json({ ok: true });
}

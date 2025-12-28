import type { NextApiRequest } from "next";
import type { NextApiResponse } from "next";
import { Server as NetServer } from "http";

import { ExpressPeerServer } from "peer";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      peerServer?: ReturnType<typeof ExpressPeerServer>;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.peerServer) {
    res.socket.server.peerServer = ExpressPeerServer(res.socket.server, {
      path: "/api/peerjs",
    });
  }

  return res.socket.server.peerServer(req, res);
}

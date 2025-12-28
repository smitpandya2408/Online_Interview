import { NextRequest } from "next/server";
import { ExpressPeerServer } from "peer";
import type { Server as HTTPServer } from "http";

let peerServer: any;

export async function GET(req: NextRequest) {
  // PeerJS WebSocket connection
  return new Response("PeerJS Server", { status: 200 });
}

export async function POST(req: NextRequest) {
  // Handle PeerJS requests
  return new Response("PeerJS Server", { status: 200 });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

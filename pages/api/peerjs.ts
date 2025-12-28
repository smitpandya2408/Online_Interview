import handler from "./peerjs/[...peerjs]";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function (req: any, res: any) {
  // PeerJS client may hit the exact /api/peerjs path; respond with a minimal 200 to avoid 404.
  if (req.url === "/api/peerjs") {
    res.setHeader("Content-Type", "text/plain");
    res.status(200).send("PeerJS server running");
    return;
  }
  // Forward everything else to the catch-all PeerJS handler.
  return handler(req, res);
}

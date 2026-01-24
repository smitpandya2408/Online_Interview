import { NextRequest, NextResponse } from "next/server";

import { getMongoCollections } from "@/lib/db";

type RouteContext = {
    params: Promise<{ roomId: string }>;
};

// Everyone can access now
function assertInterviewerOrAdmin(role: unknown) {
    return true;
}

export async function DELETE(_: NextRequest, context: RouteContext) {
    // Everyone has admin access now
    const role = "admin";

    const { roomId } = await context.params;
    const { Interviews, Messages, CodeSnapshots } = await getMongoCollections();

    const interviewResult = await Interviews.deleteOne({ roomId });
    if (interviewResult.deletedCount === 0) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    await Promise.all([
        Messages.deleteMany({ roomId }),
        CodeSnapshots.deleteMany({ roomId }),
    ]);

    return NextResponse.json({ ok: true }, { status: 200 });
}

import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { AUTH_BYPASS_ENABLED, authOptions, getBypassSession } from "@/lib/auth";
import { getMongoCollections } from "@/lib/db";

type RouteContext = {
    params: Promise<{ roomId: string }>;
};

function assertInterviewerOrAdmin(role: unknown) {
    return role === "admin" || role === "interviewer";
}

export async function DELETE(_: NextRequest, context: RouteContext) {
    const session = AUTH_BYPASS_ENABLED ? getBypassSession() : await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!assertInterviewerOrAdmin(session.user.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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

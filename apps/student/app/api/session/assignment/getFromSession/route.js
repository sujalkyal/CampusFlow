// /api/session/assignment/getFromSession.ts
import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function POST(req) {
    try {
        const body = await req.json();
        const { session_id } = body;
        console.log("Session ID is:", session_id);

        const session = await prisma.session.findUnique({
            where: { id: session_id }
        });

        if (!session) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        return NextResponse.json({ assignment_id: session.assignment_id });
    } catch (error) {
        console.error("Error fetching session:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// route to get all previous sessions
import { NextResponse } from 'next/server';
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { subject_id } = await request.json();

        // Fetch the previous sessions for the student in the specified subject
        const previousSessions = await prisma.session.findMany({
            where: {
                subject_id,
                date: {
                    lt: new Date()  // Only past sessions
                }
            },
            orderBy: {
                date: 'desc'
            }
        });

        return NextResponse.json(previousSessions, { status: 200 });
    } catch (error) {
        console.error("Error fetching previous sessions:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
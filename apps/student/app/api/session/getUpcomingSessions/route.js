// route to return upcoming sessions of a student for a specific subject
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

        // Fetch the upcoming sessions for the student in the specified subject
        const upcomingSessions = await prisma.session.findMany({
            where: {
                subject_id,
                date: {
                    gte: new Date()  // Only future sessions
                }
            },
            orderBy: {
                date: 'asc'
            }
        });

        return NextResponse.json(upcomingSessions, { status: 200 });
    } catch (error) {
        console.error("Error fetching upcoming sessions:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
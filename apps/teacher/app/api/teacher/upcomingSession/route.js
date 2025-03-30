import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const teacher_id = session.user.id;

        const teacher = await prisma.teacher.findUnique({
            where: {
                id: teacher_id,
            },
            include: {
                subjects: true, // Include the related subjects
            },
        });

        const sessions = await prisma.session.findMany({
            where: {
                subject_id: { in: teacher.subjects },
            },
        });

        return NextResponse.json(sessions, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
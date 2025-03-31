import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const studentId = session.user.id;

        // Step 1: Fetch upcoming sessions for the student
        const upcomingSessions = await prisma.session.findMany({
            where: {
                subject: {
                    batch: {
                        students: {
                            some: { id: studentId },
                        },
                    },
                },
                date: {
                    gte: new Date(),
                },
            },
            select: {
                id: true,
                date: true,
                title: true,
                subject_id: true,
            },
        });

        if (upcomingSessions.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        // Step 2: Fetch subject details for the retrieved sessions
        const subjectIds = upcomingSessions.map(session => session.subject_id);
        const subjects = await prisma.subject.findMany({
            where: { id: { in: subjectIds } },
            select: {
                id: true,
                name: true,
                teacher_id: true,
            },
        });

        // Step 3: Fetch teacher details
        const teacherIds = subjects.map(subject => subject.teacher_id).filter(Boolean);
        const teachers = await prisma.teacher.findMany({
            where: { id: { in: teacherIds } },
            select: {
                id: true,
                name: true,
            },
        });

        // Step 4: Merge data correctly
        const subjectMap = Object.fromEntries(subjects.map(sub => [sub.id, sub]));
        const teacherMap = Object.fromEntries(teachers.map(teacher => [teacher.id, teacher.name]));

        const formattedSessions = upcomingSessions.map(session => {
            const subject = subjectMap[session.subject_id];
            return {
                id: session.id,
                date: session.date,
                title: session.title || "Untitled Session",
                subject: subject?.name || "Unknown Subject",
                teacher: subject?.teacher_id ? teacherMap[subject.teacher_id] || "TBA" : "TBA",
            };
        });

        return NextResponse.json(formattedSessions, { status: 200 });
    } catch (error) {
        console.error("Error fetching upcoming sessions:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
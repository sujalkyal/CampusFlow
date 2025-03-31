// route to get student details

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
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: {
                attendance: true,
                submissions: true,
            },
        });

        if (!student) {
            return NextResponse.json({ message: "Student not found" }, { status: 404 });
        }

        return NextResponse.json(student, { status: 200 });
    } catch (error) {
        console.error("Error fetching student details:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
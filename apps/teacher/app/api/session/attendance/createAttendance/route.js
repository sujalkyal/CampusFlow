// create new attendance for a student

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { student_id, session_id, status } = await request.json();

        if (!student_id || !session_id || !status) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const attendance = await prisma.attendance.create({
            data: {
                student_id,
                session_id,
                status,
            },
        });

        return NextResponse.json(attendance, { status: 201 });
    } catch (error) {
        console.error("Error creating attendance:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
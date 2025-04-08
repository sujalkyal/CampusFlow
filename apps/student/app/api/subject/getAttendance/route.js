// route to get the attendance details of a student for a specific subject for a given month and year

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { date } from "zod";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
    
        const { subject_id, month, year } = await req.json();
    
        // check if the session linked to that attendance has that subject_id
        const attendanceDetails = await prisma.attendance.findMany({
            where: {
                student_id: session.user.id,
                session: {
                    subject_id: subject_id,
                    date: {
                        gte: new Date(year, month - 1, 1),
                        lte: new Date(year, month, 0),
                    },
                },
            },
            include: {
                session: true,
            },
        });
    
        if (!attendanceDetails) {
            return NextResponse.json(
                { message: "No attendance details found" },
                { status: 404 }
            );
        }
    
        return NextResponse.json(attendanceDetails, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
    }
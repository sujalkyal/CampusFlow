// route to get students of a subject

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // get subject_id from json body
        const { subject_id } = await req.json();
        if (!subject_id) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        // get batch id from subject_id
        const batch = await prisma.subject.findUnique({
            where: {
                id: subject_id
            }
        });

        // get the students for the subject
        const students = await prisma.student.findMany({
            where: {
                batch_id: batch.batch_id
            },
            include: {
                attendance: true,
            }
        });

        return NextResponse.json(students, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
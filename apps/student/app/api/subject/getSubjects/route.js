import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET(req) {
    try{
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        
        const studentId = session.user.id;
        if (!studentId) {
            return NextResponse.json({ message: "Student ID not found" }, { status: 400 });
        }
        
        //get the batch id of the student
        const batch_id = await prisma.student.findUnique({
            where: { id: studentId },
            select: { batch_id: true },
        });

        if (!batch_id) {
            return NextResponse.json({ message: "Batch ID not found" }, { status: 400 });
        }

        //get the subjects of the batch
        const subjects = await prisma.batch.findUnique({
            where: { id: batch_id.id },
            include: { subjects: true },
        }); 

        if (!subjects) {
            return NextResponse.json({ message: "No subjects found" }, { status: 404 });
        }

        return NextResponse.json(subjects, { status: 200 });
    }
    catch (error) {
        console.error("Error fetching subjects:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

        

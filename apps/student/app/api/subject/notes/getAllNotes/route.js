import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const studentId = session.user.id;
    if (!studentId) {
      return NextResponse.json(
        { message: "Student ID not found" },
        { status: 400 }
      );
    }

    //get the batch id of the student
    const batch_id = await prisma.student.findUnique({
      where: { id: studentId },
      select: { batch_id: true },
    });

    if (!batch_id) {
      return NextResponse.json(
        { message: "Batch ID not found" },
        { status: 400 }
      );
    }

    const batchWithSubjects = await prisma.batch.findUnique({
      where: { id: batch_id.id },
      include: {
        subjects: true,
      },
    });

    const subjectIds = batchWithSubjects?.subjects.map((subject) => subject.id);

    const notes = await prisma.note.findMany({
        where: {
          subject_id: { in: subjectIds },
        },
    });

    if (!notes) {
        return NextResponse.json(
            { message: "No notes found" },
            { status: 404 }
        );
    }
 
    return NextResponse.json(notes, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
      

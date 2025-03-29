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
      where: { id: batch_id },
      include: {
        subjects: true,
      },
    });

    const subjectIds = batchWithSubjects?.subjects.map((subject) => subject.id);

    const sessions = await prisma.session.findMany({
      where: {
        subject_id: { in: subjectIds },
      },
    });

    const sessionIds = sessions.map((session) => session.id);

    const assignments = await prisma.assignment.findMany({
      where: {
        session_id: { in: sessionIds },
      },
    });

    if (!assignments) {
      return NextResponse.json(
        { message: "No assignments found" },
        { status: 404 }
      );
    }

    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

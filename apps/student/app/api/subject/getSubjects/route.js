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

    const studentId = session?.user?.id;
    if (!studentId) {
      return NextResponse.json({ message: "Student ID not found" }, { status: 400 });
    }

    // Get the batch_id of the student
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { batch_id: true },
    });

    if (!student?.batch_id) {
      return NextResponse.json({ message: "Batch ID not found" }, { status: 400 });
    }

    // Get the subjects of the batch
    const subjects = await prisma.subject.findMany({
      where: { batch_id: student.batch_id },
      select: { id: true, name: true },
    });

    const batch_name = await prisma.batch.findUnique({
      where: { id: student.batch_id },
      select: { name: true },
    });

    return NextResponse.json({subjects, batch_name: batch_name.name}, { status: 200 });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

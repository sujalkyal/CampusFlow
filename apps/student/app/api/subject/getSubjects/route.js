import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET(req) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const studentId = "4e6cac3b-bb3d-4c0f-8d32-c64e096e668e";
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
    const batch = await prisma.batch.findUnique({
      where: { id: student.batch_id },
      include: { subjects: true },
    });

    if (!batch || !batch.subjects.length) {
      return NextResponse.json({ message: "No subjects found" }, { status: 404 });
    }

    return NextResponse.json(batch.subjects, { status: 200 });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

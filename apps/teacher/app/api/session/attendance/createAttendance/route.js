import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.student_id || !body.session_id || !body.status) {
      return NextResponse.json({ message: "Missing or invalid fields" }, { status: 400 });
    }

    const { student_id, session_id, status } = body;

    // Validate enum status
    const validStatus = ["PRESENT", "ABSENT", "LATE"];
    if (!validStatus.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    // Validate student and session existence
    const studentExists = await prisma.student.findUnique({ where: { id: student_id } });
    const sessionExists = await prisma.session.findUnique({ where: { id: session_id } });

    if (!studentExists || !sessionExists) {
      return NextResponse.json({ message: "Invalid student_id or session_id" }, { status: 404 });
    }

    // Create attendance
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

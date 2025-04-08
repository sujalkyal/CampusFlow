import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function POST(req) {
    try {
      const { assignment_id } = await req.json();
  
      if (!assignment_id) {
        return NextResponse.json({ error: "Missing assignment_id" }, { status: 400 });
      }
  
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const student = await prisma.student.findUnique({
        where: { email: session.user.email },
      });
  
      if (!student) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 });
      }
  
      const assignment = await prisma.assignment.findUnique({
        where: { id: assignment_id },
      });
  
      if (!assignment) {
        return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
      }
  
      const submission = await prisma.submission.create({
        data: {
          assignment_id,
          student_id: student.id,
          files: [],
        },
      });
  
      return NextResponse.json({ submission_id: submission.id }, { status: 201 });
    } catch (err) {
      console.error("Submission creation error:", err);
      return NextResponse.json(
        { error: "Submission creation failed", detail: err.message },
        { status: 500 }
      );
    }
  }
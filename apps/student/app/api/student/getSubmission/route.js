import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

//accept the session id and get the submission details for that particular assignment 
export async function POST(req) {
  try {
    const { session_id } = await req.json();

    if (!session_id) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
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
      where: { id: session_id },
    });

    const assignment_id = assignment?.id;

    //get the submissions array for that particular assignment
    const submission = await prisma.submission.findFirst({
      where: {
        assignment_id: assignment_id,
        student_id: student.id,
      },
    });

    //console.log("The submission is : ", submission);

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    return NextResponse.json(submission, { status: 200 });
  } catch (err) {
    console.error("Error fetching submission details:", err);
    return NextResponse.json(
      { error: "Internal Server Error", detail: err.message },
      { status: 500 }
    );
  }
}
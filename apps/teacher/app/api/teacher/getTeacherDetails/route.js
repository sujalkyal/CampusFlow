import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET(req) {
  try {
    const session = await getServerSession({ req, ...authOptions });

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const teacher_id = session.user.id;

    const user = await prisma.teacher.findUnique({
      where: {
        id: teacher_id,
      }
    });

    if (!user) {
      return NextResponse.json({ message: "Teacher not found" }, { status: 404 });
    }

    //get subject names for each of the subjects taught by the teacher
    const subjects = await prisma.subject.findMany({
      where: {
        teacher_id: teacher_id,
      },
    });

    //get department name
    const dept = await prisma.department.findUnique({
      where: {
        id: user.dept_id,
      },
    });
    const dept_name = dept ? dept.name : "Unknown Department";

    return NextResponse.json({user, subjects, dept_name}, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

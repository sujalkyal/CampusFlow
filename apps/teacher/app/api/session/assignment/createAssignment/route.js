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

    const { session_id, title, description, endDate } = await req.json();

    if (!session_id || !endDate) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newAssignment = await prisma.assignment.create({
      data: {
        session_id,
        title: title || null,
        description: description || null,
        endDate: new Date(endDate),
      },
    });

    return NextResponse.json(newAssignment, { status: 201 });

  } catch (error) {
    console.error("Error creating assignment:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

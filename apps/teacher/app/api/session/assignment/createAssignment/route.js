// create new assignment for a session

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { session_id, title, description, due_date } = await req.json();

    if (!session_id || !due_date) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newAssignment = await prisma.assignment.create({
        data: {
            session_id,
            title: title? title : null,
            description: description? description : null,
            due_date: new Date(due_date),
        },
    });

  return NextResponse.json(newAssignment, { status: 201 });
}
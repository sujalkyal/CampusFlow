import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { subject_id } = await req.json();

    const notes = await prisma.note.findMany({
        where: {
          subject_id
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
      

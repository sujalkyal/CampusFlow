import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function POST(req) {
  try {
    const { submission_id, files } = await req.json();

    if (!submission_id || !Array.isArray(files)) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const updated = await prisma.submission.update({
      where: { id: submission_id },
      data: { files },
    });

    return NextResponse.json({ message: "Files updated successfully", submission: updated });
  } catch (err) {
    console.error("Error updating submission files:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// get id from batch name 

import { NextResponse } from "next/server";
import db from "@repo/db/client";
import { authOptions } from "../../../lib/auth"
import { getServerSession } from "next-auth/next";


export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ error: "batch name is required" }, { status: 400 });
  }

  try {
    const batch_id = await db.batch.findFirst({
      where: {
        name: name,
      },
      select: {
        id: true,
      },
    });

    if (!batch_id) {
      return NextResponse.json({ error: "batch not found" }, { status: 404 });
    }

    return NextResponse.json(batch_id, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
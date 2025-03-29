// returns all batches for a department

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function POST(req) {
  try{
    const { dept_id } = await req.json();
    if (!dept_id) {
      return NextResponse.json({ error: "Department ID is required" }, { status: 400 });
    }

    // Fetch all batches for the given department ID
    const batches = await prisma.batch.findMany({
      where: {
        dept_id,
      },
    });

    return NextResponse.json(batches, { status: 200 });
  } catch (error) {
    console.error("Error fetching batches:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
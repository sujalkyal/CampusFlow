// returns all the departments

import { NextResponse } from "next/server";
import db from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const allDept = await db.department.findMany({});
    
    if (!allDept) {
      return NextResponse.json({ error: "No departments found" }, { status: 404 });
    }

    return NextResponse.json(allDept, { status: 200 });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
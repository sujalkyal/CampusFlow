import prisma from "@repo/db/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, deptId, batchId } = body;

    // Validate input fields
    if (!name || !email || !password || !deptId || !batchId) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await prisma.student.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the student
    const newUser = await prisma.student.create({
      data: {
        name,
        email,
        password: hashedPassword,
        dept_id: deptId,
        batch_id: batchId,
      },
    });

    return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}

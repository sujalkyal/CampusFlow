import prisma from "@repo/db/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  const { name, email, password, deptId, batchId } = body;

  if (!name || !email || !password || !deptId || !batchId) {
    return NextResponse.json({ message: "All fields are required." }, { status: 400 });
  }

  try {
    const existingUser = await prisma.student.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.student.create({
      data: {
        name,
        email,
        password: hashedPassword,
        dept_id: deptId,
        batch_id: batchId,
      },
    });

    return res.status(201).json({ message: "Signup successful", user: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Signup failed" });
  }
}
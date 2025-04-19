import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import bcrypt from "bcrypt";

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const studentId = session.user.id;
        const { name, email, newPassword, oldPassword, batch_id, image } = await request.json();

        const student = await prisma.student.findUnique({ where: { id: studentId } });
        if (!student) {
            return NextResponse.json({ message: "Student not found" }, { status: 404 });
        }

        // Check old password
        const isMatch = await bcrypt.compare(oldPassword, student.password);
        if (!isMatch) {
            return NextResponse.json({ message: "Old password is incorrect" }, { status: 400 });
        }

        // Hash new password if provided
        let hashedPassword = student.password;
        if (newPassword) {
            hashedPassword = await bcrypt.hash(newPassword, 10);
        }

        // Validate batch
        const batch = await prisma.batch.findUnique({
            where: { id: batch_id, dept_id: student.dept_id }
        });

        if (!batch) {
            return NextResponse.json({ message: "Invalid batch for the current department" }, { status: 400 });
        }

        // Update student details
        const updatedStudent = await prisma.student.update({
            where: { id: studentId },
            data: {
                name,
                email,
                image,
                password: hashedPassword,
                batch_id: batch.id
            }
        });

        return NextResponse.json(updatedStudent, { status: 200 });
    } catch (error) {
        console.error("Error updating student:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
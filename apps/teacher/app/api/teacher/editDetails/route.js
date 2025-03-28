
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
        const teacherId = session.user.id;
        const { name, email, newPassword, oldPassword, dept_name, batches, subjects } = await request.json();

        const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
        if (!user) {
            return NextResponse.json({ message: "Teacher not found" }, { status: 404 });
        }

        // check old password
        const isMatch = await bcrypt.compare(oldPassword, teacher.password);
        if (!isMatch) {
            return NextResponse.json({ message: "Old password is incorrect" }, { status: 400 });
        }

        // hash new password if provided
        let hashedPassword = teacher.password;
        if (newPassword) {
            hashedPassword = await bcrypt.hash(newPassword, 10);
        }

        const department = await prisma.department.findUnique({ 
            where: { name: dept_name },
            select: { id: true, batches: { select: { name: true } } }
        });
        
        if (department.id === teacher.dept_id) {
            // loop through batches array and check if a batch is included in the department.batches array , if not then delete that batch from batches array
            const validBatches = department.batches.map(batch => batch.name);
            const filteredBatches = batches.filter(batch => validBatches.includes(batch));

            const validSubjects = await prisma.batch.findMany({
                where: { name: { in: filteredBatches } },
                select: { subjects: { select: { name: true } } }
            });

            const validSubjectsNames = validSubjects.flatMap(batch => batch.subjects.map(subject => subject.name));
            const filteredSubjects = subjects.filter(subject => validSubjectsNames.includes(subject));

            // update teacher details
            const updatedTeacher = await prisma.teacher.update({
                where: { id: teacherId },
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    batches: { set: filteredBatches },
                    subjects: { set: filteredSubjects }
                }
            });

            return NextResponse.json(updatedTeacher, { status: 200 });
        }
    
        const updatedTeacher = await prisma.teacher.update({
            where: { id: teacherId },
            data: {
                name,
                email,
                password: hashedPassword,
                dept_id: department.id,
                batches: { set: batches },
                subjects: { set: subjects }
            }
        });

        return NextResponse.json(updatedTeacher, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// add files to an assignment submission

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
        
        const student_id = session.user.id;
        const { assignment_id, files } = await req.json();
    
        if (!assignment_id || !files) {
            return NextResponse.json(
                { message: "Assignment ID and files are required" },
                { status: 400 }
            );
        }
        
        // Check if submission exists
        const existingSubmission = await prisma.submission.findFirst({
            where: {
                assignment_id,
                student_id,
            },
        });
        if (!existingSubmission) {
            // create new submission if it doesn't exist
            existingSubmission=await prisma.submission.create({
                data: {
                    assignment_id,
                    student_id,
                    files
                },
            });
        }else{
            // update existing submission with new files
            existingSubmission = await prisma.submission.update({
                where: {
                    id: existingSubmission.id,
                },
                data: {
                    files: {
                        ...existingSubmission.files,
                        ...files,
                    },
                },
            });
        }
    
        return NextResponse.json(existingSubmission, { status: 200 });
    } catch (error) {
        console.error("Error adding files to assignment:", error);
        return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
        );
    }
}
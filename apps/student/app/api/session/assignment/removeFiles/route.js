// delete given files from the submission of the assignment

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
            return NextResponse.json(
                { message: "No submission found" },
                { status: 404 }
            );
        }else{
            // update existing submission by removing files
            const updatedFiles = existingSubmission.files.filter(file => !files.includes(file));
            existingSubmission = await prisma.submission.update({
                where: {
                    id: existingSubmission.id,
                },
                data: {
                    files: updatedFiles,
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
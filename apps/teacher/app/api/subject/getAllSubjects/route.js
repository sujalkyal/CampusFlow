import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function POST(req) {
    //get the subjects from all the batches in the department
    try {
        // const session = await getServerSession(authOptions);
        // if (!session) {
        //     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        // }

        // get batch_id from json body
        const { batch_id } = await req.json();
        if (!batch_id) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        // get the subjects from the batch
        const subjects = await prisma.subject.findMany({
            where: {
                batch_id: batch_id
            }
        });

        return NextResponse.json(subjects, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

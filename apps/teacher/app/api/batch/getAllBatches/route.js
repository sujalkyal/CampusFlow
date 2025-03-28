import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        
        // get dept_id from json body
        const { dept_id } = await req.json();
        if (!dept_id) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        const batches = await prisma.batch.findMany({
            where: {
                dept_id: dept_id
            }
        });

        return NextResponse.json(batches, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
// add files to an exisiting note

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function POST(req) {
    //add files to an existing note
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // get note_id and files from json body
        const { note_id, files } = await req.json();
        if (!note_id || !files) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        // check if note exists
        const note = await prisma.note.findUnique({
            where: {
                id: note_id,
            },
        });
        if (!note) {
            return NextResponse.json({ message: "Note not found" }, { status: 404 });
        }

        // update the note with files
        const updatedNote = await prisma.note.update({
            where: {
                id: note_id,
            },
            data: {
                files: {
                    set: [...note.files, ...files]
                },
            },
        });

        return NextResponse.json(updatedNote, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
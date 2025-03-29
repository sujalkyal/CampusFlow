//  DO NOT USE THIS ROUTE - CORRECT ROUTE BEFORE USE
// route to download a note of a subject

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { edgestoreLink } = await req.json();

        if (!edgestoreLink || typeof edgestoreLink !== "string") {
            return NextResponse.json({ error: "Invalid EdgeStore link" }, { status: 400 });
        }

        // Fetch the file from EdgeStore
        const fileResponse = await fetch(edgestoreLink);
        if (!fileResponse.ok) {
            return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 });
        }

        // Convert file data to a Buffer
        const fileBuffer = await fileResponse.arrayBuffer();

        // Extract filename from URL (you might need to adjust this based on EdgeStore links)
        const filename = edgestoreLink.split("/").pop();

        // Create a Response object to send file data
        return new Response(fileBuffer, {
            headers: {
                "Content-Type": fileResponse.headers.get("Content-Type") || "application/octet-stream",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}


// FRONTEND CODE 

// import axios from "axios";

// const downloadFile = async (edgestoreLink) => {
//     try {
//         const response = await axios.post(
//             "/api/process-edgestore",
//             { edgestoreLink },
//             { responseType: "blob" } // Important to handle binary data
//         );

//         // Create a blob from the response data
//         const blob = new Blob([response.data], { type: response.headers["content-type"] });

//         // Extract filename from URL
//         const filename = edgestoreLink.split("/").pop();

//         // Create a temporary link element and trigger download
//         const link = document.createElement("a");
//         link.href = URL.createObjectURL(blob);
//         link.download = filename;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     } catch (error) {
//         console.error("Error downloading file:", error);
//     }
// };

// const FileDownloader = () => {
//     const handleDownload = () => {
//         const edgestoreLink = "https://edgestore.example.com/path-to-file";
//         downloadFile(edgestoreLink);
//     };

//     return (
//         <div>
//             <button onClick={handleDownload} className="px-4 py-2 bg-blue-500 text-white rounded">
//                 Download File
//             </button>
//         </div>
//     );
// };

// export default FileDownloader;

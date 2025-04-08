"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText,
  FileScan,
  Image as ImageIcon,
  FileWarning,
} from "lucide-react";

export default function FilesSection() {
  const params = useParams();
  const sessionId = params?.id;
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!sessionId) return;

      try {
        const sessionRes = await axios.post(
          `/api/session/assignment/getFromSession`,
          {
            session_id: sessionId,
          }
        );
        const id = sessionRes.data.assignment_id;

        if (!id) {
          console.warn("No assignment associated with this session.");
          return;
        }

        const res = await axios.post("/api/session/assignment/getFiles", {
          assignment_id: id,
        });
        setFiles(res.data.files);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };

    fetchFiles();
  }, [sessionId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/30 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#2F3C7E] flex items-center gap-2">
          <FileScan className="w-5 h-5" />
          Uploaded Files
        </h2>
        <span className="text-sm text-gray-500">
          {files.length} {files.length === 1 ? "file" : "files"}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {files.length > 0 ? (
          files.map((file, idx) => (
            <div
              key={idx}
              className="relative bg-white/60 backdrop-blur-md border border-gray-300 rounded-xl shadow p-3 flex flex-col items-center text-center group transition hover:shadow-lg"
            >
              {file?.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                <>
                  <img
                    src={file}
                    alt="Uploaded"
                    className="w-full h-28 object-cover rounded-lg cursor-pointer mb-2"
                    onClick={() => window.open(file, "_blank")}
                  />
                  <ImageIcon className="w-4 h-4 text-[#2F3C7E]" />
                </>
              ) : file?.endsWith(".pdf") ? (
                <>
                  <iframe
                    src={file}
                    className="w-full h-28 rounded-lg border"
                    title="PDF File"
                    onClick={() => window.open(file, "_blank")}
                  />
                  <FileText className="w-4 h-4 text-red-500 mt-1" />
                </>
              ) : (
                <>
                  <FileWarning className="w-8 h-8 text-gray-600 mb-2" />
                  <a
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline truncate max-w-[90%]"
                  >
                    {decodeURIComponent(file.split("/").pop())}
                  </a>
                </>
              )}
              <p className="text-xs text-gray-700 mt-2 truncate max-w-full">
                {decodeURIComponent(file.split("/").pop())}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 flex flex-col items-center gap-2">
            <FileWarning className="w-6 h-6" />
            No files uploaded yet.
          </div>
        )}
      </div>
    </motion.div>
  );
}

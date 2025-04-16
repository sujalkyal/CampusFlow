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
  ExternalLink
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300 }
    }
  };

  // Determine file type icon and preview
  const getFilePreview = (file) => {
    if (file?.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
      return {
        type: 'image',
        preview: (
          <div className="relative w-full h-28 overflow-hidden rounded-lg mb-2">
            <motion.img
              src={file}
              alt="Uploaded"
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => window.open(file, "_blank")}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
          </div>
        ),
        icon: <ImageIcon className="w-4 h-4 text-[#5f43b2]" />
      };
    } else if (file?.endsWith(".pdf")) {
      return {
        type: 'pdf',
        preview: (
          <div className="relative w-full h-28 overflow-hidden rounded-lg mb-2 bg-[#010101]/60">
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="w-8 h-8 text-[#5f43b2]/80" />
            </div>
            <iframe
              src={file}
              className="w-full h-full opacity-50 hover:opacity-70 transition-opacity cursor-pointer"
              title="PDF File"
              onClick={() => window.open(file, "_blank")}
            />
          </div>
        ),
        icon: <FileText className="w-4 h-4 text-[#5f43b2]" />
      };
    } else {
      return {
        type: 'other',
        preview: (
          <div className="w-full h-28 flex items-center justify-center bg-[#3a3153]/30 rounded-lg mb-2">
            <FileWarning className="w-12 h-12 text-[#b1aebb]/50" />
          </div>
        ),
        icon: <FileText className="w-4 h-4 text-[#5f43b2]" />
      };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-[#fefdfd]"
    >
      <div className="flex justify-between items-center mb-5">
        <motion.div 
          className="bg-[#5f43b2]/20 px-3 py-1 rounded-full"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-xs font-medium text-[#fefdfd]">
            {files.length} {files.length === 1 ? "file" : "files"}
          </span>
        </motion.div>
      </div>

      {files.length > 0 ? (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {files.map((file, idx) => {
            const filePreview = getFilePreview(file);
            const fileName = decodeURIComponent(file.split("/").pop());
            
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-[#3a3153]/30 backdrop-blur-sm rounded-lg overflow-hidden"
                whileHover={{ 
                  y: -5, 
                  backgroundColor: "rgba(58, 49, 83, 0.5)",
                  transition: { duration: 0.2 } 
                }}
              >
                {filePreview.preview}
                <div className="p-3">
                  <motion.a
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between group"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center space-x-2 overflow-hidden">
                      {filePreview.icon}
                      <p className="text-xs text-[#fefdfd] truncate max-w-[100px]">
                        {fileName}
                      </p>
                    </div>
                    <ExternalLink className="w-3 h-3 text-[#b1aebb] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#3a3153]/20 rounded-lg p-8 flex flex-col items-center justify-center"
        >
          <FileWarning className="w-10 h-10 text-[#b1aebb]/50 mb-3" />
          <p className="text-[#b1aebb] text-sm">No files have been uploaded yet</p>
        </motion.div>
      )}
    </motion.div>
  );
}

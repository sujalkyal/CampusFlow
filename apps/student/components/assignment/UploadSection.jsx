"use client";
import { useState, useEffect, useRef } from "react";
import { Trash2, PlusCircle, Upload, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import { useEdgeStore } from "../../app/lib/edgestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";

export default function FilesUploadSection() {
  const { id: sessionId } = useParams();
  const [files, setFiles] = useState([]);
  const [deleteFiles, setDeleteFiles] = useState([]);
  const [submissionId, setSubmissionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignmentNotFound, setAssignmentNotFound] = useState(false); // New state
  const fileInputRef = useRef(null);

  const { edgestore } = useEdgeStore();

  useEffect(() => {
    if (!sessionId) return;

    const fetchSubmission = async () => {
      try {
        const res = await axios.post("/api/student/getSubmission", {
          session_id: sessionId,
        });

        if (res.data.error === "Assignment not found") {
          setAssignmentNotFound(true); // Set state if assignment is not found
          return;
        }

        if (res.data.id) {
          setSubmissionId(res.data.id);
          setFiles(res.data.files || []);
        } else {
          setSubmissionId(null);
        }
      } catch (err) {
        console.error("Error fetching submission:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [sessionId]);

  const createSubmission = async () => {
    try {
      const response = await axios.post("/api/session/assignment/getFromSession", {
        session_id: sessionId,
      });

      const assignmentId = response.data.assignment_id;
      if (!assignmentId) {
        toast.warn("No assignment associated with this session.");
        return;
      }

      const res = await axios.post("/api/student/createSubmission", {
        assignment_id: assignmentId,
      });

      setSubmissionId(res.data.submission_id);
      toast.success("Submission created! Now select files.");

      setTimeout(() => {
        fileInputRef.current?.click();
      }, 200);
    } catch (error) {
      console.error("Error creating submission", error);
      toast.error("Failed to create submission");
    }
  };

  const handleDelete = (file) => {
    setFiles((prev) => prev.filter((f) => f !== file));
    setDeleteFiles((prev) => [...prev, file]);
    toast.success("File removed!");
  };

  const handleSubmit = async () => {
    if (!submissionId) {
      toast.error("No submission found.");
      return;
    }

    try {
      await axios.post("/api/student/updateSubmissionFiles", {
        submission_id: submissionId,
        files,
      });

      for (const file of deleteFiles) {
        await edgestore.publicFiles.delete({ url: file });
      }

      toast.success("Files updated successfully!");
    } catch (error) {
      toast.error("Failed to update files");
      console.error("Error:", error);
    }
  };

  const handleFileUpload = async (inputFiles) => {
    if (!inputFiles || !submissionId) {
      toast.error("Submission not initialized.");
      return;
    }

    try {
      const uploadedFiles = [];

      for (const file of inputFiles) {
        const res = await edgestore.publicFiles.upload({ file });
        uploadedFiles.push(res.url);
      }

      setFiles((prev) => [...prev, ...uploadedFiles]);
    } catch (error) {
      toast.error("Upload failed");
      console.error(error);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300 },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <motion.div
          className="w-8 h-8 border-2 border-t-[#5f43b2] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (assignmentNotFound) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-[#3a3153]/20 rounded-lg">
        <AlertCircle className="w-12 h-12 text-[#5f43b2]/70 mb-3" />
        <p className="text-[#b1aebb] mb-4">Assignment not found for this session.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-[#fefdfd]"
    >
      {submissionId ? (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span className="text-sm text-[#fefdfd]">Submission Active</span>
            </div>
            <motion.div
              className="bg-[#5f43b2]/20 px-3 py-1 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-xs font-medium text-[#fefdfd]">
                {files.length} {files.length === 1 ? "file" : "files"}
              </span>
            </motion.div>
          </div>

          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6"
              >
                {files.map((file, index) => {
  const fileName = decodeURIComponent(file.split("/").pop());

  return (
    <motion.div
      key={index}
      variants={itemVariants}
      className="relative bg-[#3a3153]/30 backdrop-blur-sm border border-[#5f43b2]/20 rounded-lg overflow-hidden group"
      whileHover={{ y: -4, backgroundColor: "rgba(58, 49, 83, 0.5)" }}
    >
      <div className="h-24 overflow-hidden cursor-pointer" onClick={() => window.open(file, "_blank")}>
        {/\.(jpeg|jpg|png|gif|webp)$/i.test(file) ? (
          <motion.img
            src={file}
            alt="Uploaded"
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          />
        ) : file.endsWith(".pdf") ? (
          <iframe
            src={file}
            className="w-full h-full opacity-70 hover:opacity-90 transition-opacity"
            title="PDF File"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#3a3153]/50">
            <Upload className="w-10 h-10 text-[#b1aebb]/50" />
          </div>
        )}
      </div>

      <div className="p-2 flex items-center justify-between">
        <p className="text-xs text-[#fefdfd] truncate max-w-[120px]">
          {fileName}
        </p>
        <motion.button
          onClick={() => handleDelete(file)}
          className="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:cursor-pointer"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
})}

              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <motion.label
              className="w-full h-28 border border-dashed border-[#5f43b2]/50 flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-[#5f43b2]/10 transition-colors"
              whileHover={{ scale: 1.01, borderColor: "#5f43b2" }}
              whileTap={{ scale: 0.99 }}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                id="fileInput"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <PlusCircle size={24} className="text-[#5f43b2] mb-2" />
              <span className="text-sm text-[#b1aebb]">Add more files</span>
              <span className="text-xs text-[#b1aebb]/70 mt-1">Click or drag files here</span>
            </motion.label>

            <motion.div
              variants={itemVariants}
              className="flex justify-end mt-6"
            >
              <motion.button
                onClick={handleSubmit}
                className="bg-[#5f43b2] hover:bg-[#5f43b2]/80 px-5 py-2.5 rounded-full flex items-center hover:cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <CheckCircle size={16} className="mr-2" />
                <span>Submit Files</span>
              </motion.button>
            </motion.div>
          </div>
        </>
      ) : (
        <motion.div
          className="flex flex-col items-center justify-center py-12 bg-[#3a3153]/20 rounded-lg"
          variants={itemVariants}
        >
          <AlertCircle className="w-12 h-12 text-[#5f43b2]/70 mb-3" />
          <p className="text-[#b1aebb] mb-4">No submission created yet</p>
          <motion.button
            onClick={createSubmission}
            className="bg-[#5f43b2] hover:bg-[#5f43b2]/80 px-5 py-2.5 rounded-full flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Upload size={16} className="mr-2" />
            <span>Create Submission</span>
          </motion.button>
        </motion.div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </motion.div>
  );
}

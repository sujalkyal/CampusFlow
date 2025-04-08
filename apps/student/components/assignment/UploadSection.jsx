"use client";
import { useState, useEffect, useRef } from "react";
import { Trash2, PlusCircle } from "lucide-react";
import axios from "axios";
import { useEdgeStore } from "../../app/lib/edgestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

export default function FilesUploadSection() {
  const { id: sessionId } = useParams();
  const [files, setFiles] = useState([]);
  const [deleteFiles, setDeleteFiles] = useState([]);
  const [submissionId, setSubmissionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  const { edgestore } = useEdgeStore();

  useEffect(() => {
    if (!sessionId) return;

    const fetchSubmission = async () => {
      try {
        const res = await axios.post("/api/student/getSubmission", {
          session_id: sessionId,
        });

        if (res.data.id) {
          setSubmissionId(res.data.id);
          setFiles(res.data.files || []);
        } else {
          setSubmissionId(null);
        }

        console.log("Submission id is : ", res.data);
      } catch (err) {
        console.error("Error fetching submission:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [sessionId]);

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

      await axios.post("/api/student/updateSubmissionFiles", {
        submission_id: submissionId,
        files: uploadedFiles,
      });

      toast.success("Files uploaded and linked to submission!");
    } catch (error) {
      toast.error("Upload failed");
      console.error(error);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/30 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-6 mt-8"
    >
      <h2 className="text-xl font-semibold text-[#2F3C7E] mb-4">Upload Files</h2>

      {submissionId ? (
        <>
          <div className="grid grid-cols-3 gap-4">
            {files.length > 0 ? (
              files.map((file, index) => (
                <div
                  key={index}
                  className="relative bg-white/70 border border-gray-300 p-2 rounded-xl flex flex-col items-center shadow group"
                >
                  {/\.(jpeg|jpg|png|gif)$/i.test(file) ? (
                    <img
                      src={file}
                      alt="Uploaded"
                      className="w-full h-24 object-cover rounded-md cursor-pointer mb-1"
                      onClick={() => window.open(file, "_blank")}
                    />
                  ) : file.endsWith(".pdf") ? (
                    <iframe
                      src={file}
                      className="w-full h-24 border rounded-md cursor-pointer mb-1"
                      title="PDF File"
                      onClick={() => window.open(file, "_blank")}
                    />
                  ) : (
                    <a
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm hover:underline truncate"
                    >
                      {decodeURIComponent(file.split("/").pop())}
                    </a>
                  )}

                  <button
                    onClick={() => handleDelete(file)}
                    className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500">No files uploaded yet.</p>
            )}

            <label className="w-full h-24 border-2 border-dashed border-gray-400 flex items-center justify-center rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                id="fileInput"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <div className="flex flex-col items-center text-gray-500">
                <PlusCircle size={24} />
                <span className="text-sm">Add File</span>
              </div>
            </label>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-xl hover:opacity-90 transition"
            >
              Submit Files
            </button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <button
            onClick={createSubmission}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl transition"
          >
            Create Submission
          </button>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </motion.div>
  );
}

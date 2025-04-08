"use client";
import React from "react";
import { useParams } from "next/navigation";
import AssignmentDetails from "../../../../../components/assignment/AssignmentDetails";
import FileSection from "../../../../../components/assignment/FilesSection";
import FilesUploadSection from "../../../../../components/assignment/UploadSection";
import { motion } from "framer-motion";

const SessionPage = () => {
  const { id: session_id } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2f3] via-[#dff1ff] to-[#fefefe] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto space-y-10"
      >
        {/* Animated Title */}
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#000000] to-[#727272] tracking-tight">
            Assignment Workspace
          </h1>
        </div>

        {/* Assignment Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/30 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-md p-6"
          >
            <AssignmentDetails />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/30 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-md p-6"
          >
            <FileSection />
          </motion.div>
        </div>

        {/* Upload Section */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white/30 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-md p-6"
        >
          <FilesUploadSection  />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SessionPage;

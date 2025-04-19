"use client";
import React from "react";
import { useParams } from "next/navigation";
import AssignmentDetails from "../../../../../components/assignment/AssignmentDetails";
import FileSection from "../../../../../components/assignment/FilesSection";
import FilesUploadSection from "../../../../../components/assignment/UploadSection";
import { motion } from "framer-motion";
import { FileText, BookOpen, Upload } from "lucide-react";

// Theme colors matching the dashboard
const THEME = {
  primary: '#5f43b2',    // Studio purple
  secondary: '#3a3153',  // Mystique
  background: '#010101', // Black
  text: '#fefdfd',       // Soft Peach
  muted: '#b1aebb',      // Gray Powder
};

const SessionPage = () => {
  const { id: session_id } = useParams();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="min-h-screen text-[#fefdfd]"
      style={{ 
        background: THEME.background,
        backgroundImage: "radial-gradient(circle at 50% 0%, #3a3153 0%, #010101 70%)",
        backgroundAttachment: "fixed"
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Decorative background elements */}
      <div className="fixed top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-[#5f43b2]/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, 50, 0], 
            opacity: [0.5, 0.8, 0.5] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-96 h-96 bg-[#3a3153]/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, -30, 0], 
            y: [0, -50, 0], 
            opacity: [0.5, 0.7, 0.5] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-8"
        >
          {/* Header section */}
          <motion.div 
            variants={itemVariants}
            className="mb-4"
          >
            <div className="flex items-center">
              <span className="block w-1.5 h-8 bg-[#5f43b2] mr-3 rounded-full"></span>
              <h1 className="text-2xl font-bold text-[#fefdfd]">Assignment Workspace</h1>
            </div>
            <motion.div 
              className="h-0.5 w-full mt-2 bg-gradient-to-r from-[#5f43b2]/50 to-transparent rounded-full"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 1.2 }}
            />
          </motion.div>

          {/* Main content in vertical layout */}
          <div className="flex flex-col space-y-6">
            {/* Assignment Details Section */}
            <motion.div
              variants={itemVariants} 
              className="bg-[#010101]/70 backdrop-blur-xl rounded-lg shadow-xl overflow-hidden"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-1 bg-gradient-to-r from-[#5f43b2] to-[#3a3153]"></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#5f43b2]/20 flex items-center justify-center mr-3">
                    <BookOpen size={18} className="text-[#5f43b2]" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#fefdfd]">Assignment Details</h2>
                </div>
                <AssignmentDetails />
              </div>
            </motion.div>

            {/* Files Section */}
            <motion.div
              variants={itemVariants}
              className="bg-[#010101]/70 backdrop-blur-xl rounded-lg shadow-xl overflow-hidden"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-1 bg-gradient-to-r from-[#3a3153] to-[#5f43b2]"></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#5f43b2]/20 flex items-center justify-center mr-3">
                    <FileText size={18} className="text-[#5f43b2]" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#fefdfd]">Assignment Files</h2>
                </div>
                <FileSection />
              </div>
            </motion.div>

            {/* Upload Section */}
            <motion.div
              variants={itemVariants}
              className="bg-[#010101]/70 backdrop-blur-xl rounded-lg shadow-xl overflow-hidden"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-1 bg-gradient-to-r from-[#5f43b2] to-[#3a3153]"></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#5f43b2]/20 flex items-center justify-center mr-3">
                    <Upload size={18} className="text-[#5f43b2]" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#fefdfd]">Your Submission</h2>
                </div>
                <FilesUploadSection />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(177, 174, 187, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(95, 67, 178, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(95, 67, 178, 0.8);
        }
      `}</style>
    </motion.div>
  );
};

export default SessionPage;

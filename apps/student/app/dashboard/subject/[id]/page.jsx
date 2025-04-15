"use client";

import React from "react";
import { useParams } from "next/navigation";
import AttendanceOverview from "../../../../components/AttendanceOverview";
import AttendanceCalendar from "../../../../components/AttendanceCalendar";
import NotesSection from "../../../../components/NoteSection";
import UpcomingSessions from "../../../../components/UpcomingSession";
import PreviousClasses from "../../../../components/PreviousSessions";
import { motion } from 'framer-motion';

// Updated theme to match dashboard dark theme
const THEME = {
  primary: '#5f43b2',    // Studio purple
  secondary: '#3a3153',  // Mystique
  background: '#010101', // Black
  text: '#fefdfd',       // Soft Peach
  muted: '#b1aebb',      // Gray Powder
};

export default function StudentDashboard() {
  const { id } = useParams();
  const subject_id = id;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
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
      {/* Decorative elements */}
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
          className="space-y-8"
        >
          {/* Top Row: Attendance and Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Attendance Overview */}
            <motion.div 
              variants={itemVariants}
              className="bg-[#010101]/70 backdrop-blur-xl rounded-lg shadow-xl overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-[#5f43b2] to-[#3a3153]"></div>
              <div className="p-4">
                <AttendanceOverview subject_id={subject_id} />
              </div>
            </motion.div>

            {/* Attendance Calendar */}
            <motion.div 
              variants={itemVariants}
              className="bg-[#010101]/70 backdrop-blur-xl rounded-lg shadow-xl overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-[#3a3153] to-[#5f43b2]"></div>
              <div className="p-4">
                <AttendanceCalendar subject_id={subject_id} />
              </div>
            </motion.div>

            {/* Notes */}
            <motion.div 
              variants={itemVariants}
              className="bg-[#010101]/70 backdrop-blur-xl rounded-lg shadow-xl overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-[#5f43b2] to-[#3a3153]"></div>
              <div className="p-4">
                <NotesSection subjectId={subject_id} THEME={THEME} />
              </div>
            </motion.div>
          </div>

          {/* Classes Section Header */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center mt-8 mb-4"
          >
            <span className="block w-1 h-6 bg-[#5f43b2] mr-2"></span>
            <h2 className="text-xl font-bold text-[#fefdfd]">Classes</h2>
            <motion.div 
              className="h-1 flex-grow ml-4 bg-gradient-to-r from-[#5f43b2]/50 to-transparent rounded-full"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            />
          </motion.div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Sessions */}
            <motion.div 
              variants={itemVariants}
              className="bg-[#010101]/70 backdrop-blur-xl rounded-lg shadow-xl overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-[#5f43b2] to-[#3a3153]"></div>
              <div className="p-4">
                <UpcomingSessions subjectId={subject_id} THEME={THEME} />
              </div>
            </motion.div>

            {/* Previous Classes */}
            <motion.div 
              variants={itemVariants}
              className="bg-[#010101]/70 backdrop-blur-xl rounded-lg shadow-xl overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-[#3a3153] to-[#5f43b2]"></div>
              <div className="p-4">
                <PreviousClasses subjectId={subject_id} THEME={THEME} />
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
}
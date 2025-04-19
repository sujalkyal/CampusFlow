"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import {
  CalendarDays,
  ClipboardList,
  FileText,
  Star,
  StickyNote,
} from "lucide-react";

export default function AssignmentDetails() {
  const [formData, setFormData] = useState({
    title: "",
    dueDate: "",
    totalPoints: "",
    instructions: "",
  });

  const params = useParams();
  const sessionId = params?.id;

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const sessionRes = await axios.post(
          `/api/session/assignment/getFromSession`,
          {
            session_id: sessionId,
          }
        );
        const assignmentId = sessionRes.data.assignment_id;

        if (!assignmentId) {
          console.warn("No assignment associated with this session.");
          return;
        }

        const assignmentRes = await axios.post(
          `/api/session/assignment/getDetails`,
          {
            assignment_id: assignmentId,
          }
        );

        setFormData({
          title: assignmentRes.data.title || "",
          dueDate: assignmentRes.data.endDate?.split("T")[0] || "",
          instructions: assignmentRes.data.description || "",
          totalPoints: "100",
        });
      } catch (err) {
        console.error("Failed to load assignment", err);
      }
    };

    fetchAssignment();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-[#fefdfd]"
    >
      {/* Assignment Header with Due Date */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-[#fefdfd]">
          {formData.title || "Assignment"}
        </h3>
        <motion.div 
          className="bg-[#5f43b2]/20 px-3 py-1.5 rounded-full flex items-center"
          whileHover={{ scale: 1.05 }}
        >
          <CalendarDays className="w-3.5 h-3.5 mr-2 text-[#5f43b2]" />
          <span className="text-xs font-medium text-[#fefdfd]">
            Due: {formData.dueDate || "Not specified"}
          </span>
        </motion.div>
      </div>

      {/* Details Cards */}
      <div className="space-y-4">
        {/* Points */}
        <motion.div 
          className="bg-[#3a3153]/50 rounded-lg p-4 backdrop-blur-sm"
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center mb-2">
            <Star className="w-4 h-4 text-[#5f43b2] mr-2" />
            <h4 className="text-sm font-medium text-[#b1aebb]">Total Points</h4>
          </div>
          <p className="text-[#fefdfd] font-medium">{formData.totalPoints || "100"}</p>
        </motion.div>
        
        {/* Instructions */}
        <motion.div 
          className="bg-[#3a3153]/50 rounded-lg p-4 backdrop-blur-sm"
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center mb-2">
            <StickyNote className="w-4 h-4 text-[#5f43b2] mr-2" />
            <h4 className="text-sm font-medium text-[#b1aebb]">Instructions</h4>
          </div>
          <div className="bg-[#010101]/30 p-4 rounded-lg mt-2 text-sm text-[#fefdfd] whitespace-pre-line max-h-60 overflow-y-auto custom-scrollbar">
            {formData.instructions || "No specific instructions provided."}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

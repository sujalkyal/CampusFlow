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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/30 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 overflow-hidden relative"
    >
      {/* Header Image */}
      <div className="h-24 w-full bg-gradient-to-r from-[#2F3C7E] to-[#6C63FF] flex items-center justify-between px-6 py-4">
        <h2 className="text-white text-xl font-semibold flex items-center gap-2">
          <ClipboardList className="w-5 h-5" />
          Assignment Overview
        </h2>
        <span className="bg-white text-[#2F3C7E] text-xs font-semibold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
          <CalendarDays className="w-4 h-4" />
          {formData.dueDate}
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
          <div className="flex gap-3 items-center">
            <FileText className="w-5 h-5 text-[#2F3C7E]" />
            <div>
              <p className="text-sm font-medium text-gray-600">Title</p>
              <p className="text-base font-semibold">{formData.title}</p>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <Star className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Points</p>
              <p className="text-base font-semibold">100</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-[#2F3C7E]">
            <StickyNote className="w-5 h-5" />
            <h3 className="font-semibold">Instructions</h3>
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-line bg-gray-100 p-4 rounded-xl shadow-inner">
            {formData.instructions || "No specific instructions provided."}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

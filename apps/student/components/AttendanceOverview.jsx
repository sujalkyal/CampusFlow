"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { LineChart } from "lucide-react";

// Updated theme to match parent page
const THEME = {
  primary: '#5f43b2',    // Studio purple
  secondary: '#3a3153',  // Mystique
  background: '#010101', // Black
  surface: '#2a2a3f',    // Card background
  text: '#fefdfd',       // Soft Peach
  muted: '#b1aebb',      // Gray Powder
};

const COLORS = {
  present: "#4CAF50",
  absent: "#F44336",
  late: "#FFEB3B",
  todayBorder: "#2196F3",
  default: "#333333",
};

// Custom tooltip for the pie chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 rounded-md" style={{ 
        backgroundColor: 'rgba(42, 42, 63, 0.9)',
        border: `1px solid ${payload[0].color}`,
        color: THEME.text,
        backdropFilter: 'blur(8px)'
      }}>
        <p className="text-xs font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// Custom Legend
const CustomLegend = ({ payload }) => {
  return (
    <div className="flex justify-center gap-4 mt-4">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-1"
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className="text-xs" style={{ color: THEME.text }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function AttendanceOverview({ subject_id }) {
  const [summary, setSummary] = useState({ present: 0, absent: 0, late: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true);
        const res = await axios.post('/api/subject/getAttendanceDetails', {subject_id});
        const attendanceDetails = res.data;

        const present = attendanceDetails.filter(
          (item) => item.status === "PRESENT"
        ).length;

        const absent = attendanceDetails.filter(
          (item) => item.status === "ABSENT"
        ).length;

        const late = attendanceDetails.filter(
          (item) => item.status === "LATE"
        ).length;

        setSummary({ present, absent, late });
      } catch (err) {
        console.error("Error fetching attendance summary:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, [subject_id]);

  const chartData = [
    { name: "Present", value: summary.present },
    { name: "Absent", value: summary.absent },
    { name: "Late", value: summary.late },
  ];

  const chartColors = [COLORS.present, COLORS.absent, COLORS.late];
  
  // Animation variants
  const chartVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        delay: 0.2 
      }
    },
  };
  
  // Loading animation
  const loadingVariants = {
    start: { rotate: 0 },
    end: { rotate: 360, transition: { duration: 1.5, repeat: Infinity, ease: "linear" } }
  };

  // Calculate total attendance
  const totalClasses = summary.present + summary.absent + summary.late;
  const attendanceRate = totalClasses > 0 ? ((summary.present / totalClasses) * 100).toFixed(1) : 0;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-4">
        <LineChart size={18} className="mr-2 text-[#5f43b2]" />
        <h2 className="text-lg font-semibold text-[#fefdfd]">
          Attendance Overview
        </h2>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <motion.div 
            className="w-16 h-16 border-t-2 border-[#5f43b2] rounded-full" 
            variants={loadingVariants}
            initial="start"
            animate="end"
          />
        </div>
      ) : (
        <motion.div 
          className="flex-1 flex flex-col justify-between"
          variants={chartVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Rate Card */}
          <div className="bg-[#3a3153] rounded-lg p-3 mb-4 text-center">
            <p className="text-sm text-[#b1aebb]">Attendance Rate</p>
            <p className="text-2xl font-bold text-[#fefdfd]">{attendanceRate}%</p>
            <div className="w-full bg-[#010101]/30 h-1.5 rounded-full mt-2 overflow-hidden">
              <motion.div 
                className="h-full rounded-full"
                style={{ backgroundColor: COLORS.present }}
                initial={{ width: 0 }}
                animate={{ width: `${attendanceRate}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>

          {/* Pie Chart */}
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={chartColors[index % chartColors.length]} 
                      stroke="rgba(0,0,0,0.2)"
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="bg-[#3a3153]/50 rounded-lg p-2 text-center">
              <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: COLORS.present }}></div>
              <p className="text-xs text-[#b1aebb]">Present</p>
              <p className="text-lg font-bold text-[#fefdfd]">{summary.present}</p>
            </div>
            <div className="bg-[#3a3153]/50 rounded-lg p-2 text-center">
              <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: COLORS.absent }}></div>
              <p className="text-xs text-[#b1aebb]">Absent</p>
              <p className="text-lg font-bold text-[#fefdfd]">{summary.absent}</p>
            </div>
            <div className="bg-[#3a3153]/50 rounded-lg p-2 text-center">
              <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: COLORS.late }}></div>
              <p className="text-xs text-[#b1aebb]">Late</p>
              <p className="text-lg font-bold text-[#fefdfd]">{summary.late}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

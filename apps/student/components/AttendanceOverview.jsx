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

const COLORS = {
    present: "#4CAF50",
    absent: "#F44336",
    late: "#FFEB3B",
    todayBorder: "#2196F3",
    default: "#EEEEEE",
  };

const THEME = {
    primary: '#2F3C7E',
    secondary: '#FBEAEB',
    white: '#FFFFFF',
    black: '#000000',
  };

export default function AttendanceOverview({ subject_id }) {
  const [summary, setSummary] = useState({ present: 0, absent: 0, late: 0 });

  useEffect(() => {
    const fetchSummary = async () => {
        try {
            // pass subject_id as json body
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

            //console.log("Attendance Details:", attendanceDetails);
    
            setSummary({ present, absent, late });
          } catch (err) {
        console.error("Error fetching attendance summary:", err);
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

  return (
    <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: THEME.white }}>
            <h2 className="text-lg font-medium mb-6" style={{ color: THEME.primary }}>Attendance Overview</h2>
            <div className="flex justify-center items-center mb-4">
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name }) => name}
                    >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
            </div>
          </div>
  );
}

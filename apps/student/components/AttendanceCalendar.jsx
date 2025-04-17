"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import dayjs from "dayjs";
import { motion } from "framer-motion";

// Updated theme colors to match parent page
const themeColors = {
  primary: "#5f43b2",    // Studio purple
  secondary: "#3a3153",  // Mystique
  background: "#010101", // Black
  surface: "#2a2a3f",    // Card background
  text: "#fefdfd",       // Soft Peach
  muted: "#b1aebb",      // Gray Powder
};

const days = ["S", "M", "T", "W", "T", "F", "S"];

export default function AttendanceCalendar({ subject_id }) {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [attendance, setAttendance] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchCalendarData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post("/api/subject/getAttendance", {
        subject_id,
        month: currentDate.month() + 1,
        year: currentDate.year()
      });
      
      if (res.status !== 200) {
        throw new Error("Failed to fetch attendance data");
      }
      
      const attendanceData = res.data.reduce((acc, item) => {
        const date = dayjs(item.session.date).format("YYYY-MM-DD");
        acc[date] = item.status;
        return acc;
      }, {});

      setAttendance(attendanceData);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, [currentDate, subject_id]);

  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");
  const startDay = startOfMonth.day();
  const daysInMonth = endOfMonth.date();

  const prevMonthDays = startDay;
  const totalBoxes = prevMonthDays + daysInMonth;
  const totalWeeks = Math.ceil(totalBoxes / 7);
  const totalCells = totalWeeks * 7;

  const getDateStatus = (day) => {
    const dateStr = currentDate.date(day).format("YYYY-MM-DD");
    return attendance[dateStr];
  };

  const isToday = (day) => {
    const today = dayjs();
    return (
      currentDate.year() === today.year() &&
      currentDate.month() === today.month() &&
      day === today.date()
    );
  };

  const renderDates = () => {
    const dates = [];
    for (let i = 0; i < totalCells; i++) {
      const dayNum = i - prevMonthDays + 1;
      const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;

      let bgColor = "transparent";
      let borderColor = "transparent";
      let textColor = themeColors.muted;

      if (isCurrentMonth) {
        textColor = themeColors.text;
        const status = getDateStatus(dayNum);
        
        if (status === "PRESENT") {
          bgColor = "rgba(76, 175, 80, 0.2)";
          borderColor = "#4CAF50";
        } else if (status === "ABSENT") {
          bgColor = "rgba(244, 67, 54, 0.2)";
          borderColor = "#F44336";
        } else if (status === "LATE") {
          bgColor = "rgba(255, 235, 59, 0.2)";
          borderColor = "#FFEB3B";
        }

        if (isToday(dayNum)) {
          bgColor = themeColors.primary;
          borderColor = "transparent";
          textColor = "#ffffff";
        }
      }

      dates.push(
        <motion.div
          key={i}
          className={`h-8 w-8 flex items-center justify-center rounded-full mx-auto text-sm`}
          style={{
            color: textColor,
            backgroundColor: bgColor,
            border: `2px solid ${borderColor}`,
          }}
          whileHover={isCurrentMonth ? { scale: 1.1 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {isCurrentMonth ? dayNum : ""}
        </motion.div>
      );
    }
    return dates;
  };

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, "month"));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-4">
        <Calendar size={18} className="mr-2 text-[#5f43b2]" />
        <h2 className="text-lg font-semibold text-[#fefdfd]">
          Attendance Calendar
        </h2>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="w-full">
          <div className="flex justify-between items-center mb-5">
            <motion.button
              className="p-2 rounded-full hover:cursor-pointer"
              style={{ backgroundColor: "rgba(95, 67, 178, 0.1)" }}
              onClick={handlePrevMonth}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(95, 67, 178, 0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft size={18} color={themeColors.primary} />
            </motion.button>
            
            <motion.span 
              className="font-medium text-[#fefdfd]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              key={currentDate.format("MMMM YYYY")}
            >
              {currentDate.format("MMMM YYYY")}
            </motion.span>
            
            <motion.button
              className="p-2 rounded-full hover:cursor-pointer"
              style={{ backgroundColor: "rgba(95, 67, 178, 0.1)" }}
              onClick={handleNextMonth}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(95, 67, 178, 0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight size={18} color={themeColors.primary} />
            </motion.button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {days.map((day, i) => (
              <div key={`day-${i}`} className="text-xs py-2 font-medium" style={{ color: themeColors.primary }}>
                {day}
              </div>
            ))}
            
            {isLoading ? (
              // Loading skeleton
              Array(35).fill(0).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  className="h-8 w-8 mx-auto rounded-full"
                  style={{ backgroundColor: "rgba(95, 67, 178, 0.1)" }}
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              ))
            ) : renderDates()}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-4 pt-2">
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: "rgba(76, 175, 80, 0.7)" }}></div>
          <span className="text-xs" style={{ color: themeColors.muted }}>Present</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: "rgba(244, 67, 54, 0.7)" }}></div>
          <span className="text-xs" style={{ color: themeColors.muted }}>Absent</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: "rgba(255, 235, 59, 0.7)" }}></div>
          <span className="text-xs" style={{ color: themeColors.muted }}>Late</span>
        </div>
      </div>
    </div>
  );
}

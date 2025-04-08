"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";

const themeColors = {
  primary: "#2F3C7E",
  secondary: "#FBEAEB",
  white: "#FFFFFF",
  black: "#000000",
};

const days = ["S", "M", "T", "W", "T", "F", "S"];

export default function AttendanceCalendar({ subject_id }) {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [attendance, setAttendance] = useState({});

  const fetchCalendarData = async () => {
    try {
      const res = await axios.post("/api/subject/getAttendance", {subject_id, month: currentDate.month() + 1, year: currentDate.year()});
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
    return attendance[dateStr]; // "present", "absent", "late", or undefined
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
      let textColor = themeColors.black;

      if (isCurrentMonth) {
        const status = getDateStatus(dayNum);
        if (status === "PRESENT") bgColor = "#4CAF50";
        else if (status === "ABSENT") bgColor = "#F44336";
        else if (status === "LATE") bgColor = "#FFEB3B";

        if (isToday(dayNum)) {
          bgColor = themeColors.primary;
          textColor = themeColors.white;
        }
      } else {
        textColor = "#ccc";
      }

      dates.push(
        <div
          key={i}
          className="h-8 w-8 flex items-center justify-center rounded-full mx-auto text-sm"
          style={{
            color: textColor,
            backgroundColor: bgColor,
          }}
        >
          {isCurrentMonth ? dayNum : ""}
        </div>
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
    <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: themeColors.white }}>
      <h2 className="text-lg font-medium mb-6" style={{ color: themeColors.primary }}>
        Attendance Calendar
      </h2>
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <button
              className="p-1 rounded-full hover:bg-gray-100"
              style={{ color: themeColors.primary }}
              onClick={handlePrevMonth}
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-medium" style={{ color: themeColors.primary }}>
              {currentDate.format("MMMM YYYY")}
            </span>
            <button
              className="p-1 rounded-full hover:bg-gray-100"
              style={{ color: themeColors.primary }}
              onClick={handleNextMonth}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {days.map((day, i) => (
              <div key={`day-${i}`} className="text-xs py-2" style={{ color: themeColors.primary }}>
                {day}
              </div>
            ))}
            {renderDates()}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useParams } from "next/navigation";
import AttendanceOverview from "../../../../components/AttendanceOverview";
import AttendanceCalendar from "../../../../components/AttendanceCalendar";
import NotesSection from "../../../../components/NoteSection";
import UpcomingSessions from "../../../../components/UpcomingSession";
import PreviousClasses from "../../../../components/PreviousSessions";

const THEME = {
    primary: '#2F3C7E',
    secondary: '#FBEAEB',
    white: '#FFFFFF',
    black: '#000000',
  };

export default function StudentDashboard() {
    const { id } = useParams();
    const subject_id = id;

  return (
    <div className="bg-gray-50" style={{ backgroundColor: THEME.secondary, minHeight: '100vh', padding: '1.5rem' }}>
      <div className="max-w-7xl mx-auto">
        {/* Top Row: Attendance and Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Attendance Overview */}
          <AttendanceOverview subject_id={subject_id} />

          {/* Attendance Calendar */}
          <AttendanceCalendar subject_id={subject_id} />

          {/* Notes */}
          <NotesSection subjectId={subject_id} THEME={THEME} />
        </div>

        {/* Classes Section */}
        <h2 className="text-xl font-medium mb-6" style={{ color: THEME.primary }}>Classes</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Sessions */}
          <UpcomingSessions subjectId={subject_id} THEME={THEME} />

          {/* Previous Classes */}
          <PreviousClasses subjectId={subject_id} THEME={THEME} />
        </div>
      </div>
    </div>
  );
}
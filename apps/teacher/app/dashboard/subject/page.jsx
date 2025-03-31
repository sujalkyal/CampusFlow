"use client";

import React, { useEffect, useState } from 'react';

const Subject = () => {
  const themeColors = {
    primary: '#2F3C7E',
    secondary: '#FBEAEB',
    white: '#FFFFFF',
    black: '#000000',
  };

  const [sessions, setSessions] = useState([]);
  const [notes, setNotes] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch notes
        const notesResponse = await fetch('/api/subject/notes/getAllNotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject_id: '152430d8-fc9a-4231-90e7-301e2086f9dc' }),
        });

        if (!notesResponse.ok) throw new Error('Failed to fetch notes');
        const notesData = await notesResponse.json();
        setNotes(notesData);

        // Fetch students
        const studentsResponse = await fetch('/api/subject/getStudents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject_id: '152430d8-fc9a-4231-90e7-301e2086f9dc' }),
        });

        if (!studentsResponse.ok) throw new Error('Failed to fetch students');
        const studentsData = await studentsResponse.json();
        setStudents(studentsData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
}, []);


  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('/api/subject/session/getAllSessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject_id: '152430d8-fc9a-4231-90e7-301e2086f9dc' }),
        });
        
        if (!response.ok) throw new Error('Failed to fetch sessions');
        const data = await response.json();
        
        // Sort sessions by date (ascending)
        const sortedSessions = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        console.log('Fetched sessions:', sortedSessions);
        setSessions(sortedSessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="flex flex-col min-h-screen px-12 md:px-24" style={{ backgroundColor: themeColors.secondary }}>
      <main className="flex-1 p-4 flex flex-col md:flex-row gap-4">
        {/* Courses & Students Selection (Left Side) */}
        <div className="w-full md:w-1/2 space-y-4">
          {/* Course Selection */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4" style={{ color: themeColors.primary }}>Classes</h2>
            <div className="grid grid-cols-2 gap-4">
                {sessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4 flex flex-col hover:bg-gray-50">
                    <h3 className="font-medium" style={{ color: themeColors.primary }}>{session.title || 'Untitled Session'}</h3>
                    <p className="text-sm text-gray-500">{new Date(session.date).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
          </div>

          {/* Notes Selection */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4" style={{ color: themeColors.primary }}>Notes</h2>
            <div className="grid grid-cols-2 gap-4">
              {notes.map((note) => (
                <div key={note.id} className="border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-gray-50">
                  <h3 className="font-medium" style={{ color: themeColors.primary }}>{note.title || 'Untitled Note'}</h3>
                  <p className="text-sm text-gray-500">{note.description || 'No description available'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Student List (Right Side) */}
        <div className="w-full md:w-1/2">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4" style={{ color: themeColors.primary }}>Student List</h2>
            <div className="space-y-2">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                      <img src={student.image} alt={student.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-medium" style={{ color: themeColors.primary }}>{student.name}</h3>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold" style={{ color: themeColors.primary }}>Total Attendance: {student.attendance.length}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Show More</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Subject;
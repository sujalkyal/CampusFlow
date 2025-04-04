"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import NotesViewPopUp from '../../../../components/NotesViewPopUp';
import AddSessionCard from '../../../../components/AddSessionComponent';
import AddNoteCard from '../../../../components/AddNotesComponent';

const Subject = () => {
  const themeColors = {
    primary: '#2F3C7E',
    secondary: '#FBEAEB',
    white: '#FFFFFF',
    black: '#000000',
  };

  const { id: subject_id } = useParams();
  const [sessions, setSessions] = useState([]);
  const [notes, setNotes] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [refresh2, setRefresh2] = useState(false);
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  const visibleStudents = showAll ? students : students.slice(0, 10);
  let totalClasses = 0;

  const handleSessionCreated = () => {
    setRefresh((prev) => !prev); // Toggle state to trigger re-render
  };

  const handleNoteCreation = () => {
    setRefresh2((prev) => !prev); // Toggle state to trigger re-render
  };

  useEffect(() => {
    if (!subject_id) return;

    const fetchData = async () => {
      try {
        // Fetch students
        const studentsResponse = await axios.post('/api/subject/getStudents', { subject_id });

        if (studentsResponse.status !== 200) throw new Error('Failed to fetch students');
        const studentsData = studentsResponse.data.students;
        totalClasses = studentsResponse.data.sessionCount;
        setStudents(studentsData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  },[]);

  useEffect(() => {
    if (!subject_id) return;

    const fetchData = async () => {
      try {
        // Fetch notes
        const notesResponse = await axios.post('/api/subject/notes/getAllNotes', { subject_id });
        
        const notesData = notesResponse.data;
        setNotes(notesData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
}, [refresh2]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.post('/api/subject/session/getAllSessions', { subject_id });
        
        const data = response.data;
        
        // Sort sessions by date (ascending)
        const sortedSessions = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        //console.log('Fetched sessions:', sortedSessions);
        setSessions(sortedSessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };

    fetchSessions();
  }, [refresh]);

  return (
    <div className="flex flex-col min-h-screen px-12 md:px-24" style={{ backgroundColor: themeColors.secondary }}>
      <main className="flex-1 p-4 flex flex-col md:flex-row gap-4">
        {/* Classes & Notes Selection (Left Side) */}
        <div className="w-full md:w-1/2 space-y-4">
          {/* Classes Selection */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4" style={{ color: themeColors.primary }}>Classes</h2>
            <div className="grid grid-cols-2 gap-4">
                {sessions.map((session) => (
                  <button className='hover:cursor-pointer' key={session.id} onClick={() => router.push(`/dashboard/subject/session/${session.id}`)}>
                    <div key={session.id} className="border rounded-lg p-4 flex flex-col hover:bg-gray-50">
                    <h3 className="font-medium" style={{ color: themeColors.primary }}>{session.title || 'Untitled Session'}</h3>
                    <p className="text-sm text-gray-500">{new Date(session.date).toLocaleDateString()}</p>
                    </div>
                  </button>
                ))}
              <AddSessionCard subject_id={subject_id} onSessionCreated={handleSessionCreated} />
            </div>
          </div>

          {/* Notes Selection */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4" style={{ color: themeColors.primary }}>Notes</h2>
            <div className="grid grid-cols-2 gap-4">
              {notes.map((note) => (
                // onclick will render the NotesViewPopUp component
                <button className='hover:cursor-pointer' key={note.id} onClick={() => setSelectedNote(note)}>
                  <div key={note.id} className="border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-gray-50">
                    <h3 className="font-medium" style={{ color: themeColors.primary }}>{note.title || 'Untitled Note'}</h3>
                    <p className="text-sm text-gray-500">{note.description || 'No description available'}</p>
                  </div>
                </button>
              ))}
              <AddNoteCard subject_id={subject_id} onNoteCreated={handleNoteCreation} />
            </div>
          </div>
        </div>

        {/* Student List (Right Side) */}
        <div className="w-full md:w-1/2">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4" style={{ color: themeColors.primary }}>
              Student List
            </h2>
            <div className="space-y-2">
              {visibleStudents.map((student) => (
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
                    <span className="font-semibold" style={{ color: themeColors.primary }}>
                      Attendance: {student.attendance.length}/{totalClasses}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {students.length > 10 && (
              <div className="mt-4 text-center">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 hover:cursor-pointer"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "Show Less" : "Show More"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Render the popup only when selectedNote is set */}
        {selectedNote && (
          <NotesViewPopUp note={selectedNote} onClose={() => setSelectedNote(null)} />
        )}
      </main>
    </div>
  );
};

export default Subject;
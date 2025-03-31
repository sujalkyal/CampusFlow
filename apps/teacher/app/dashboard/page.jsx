"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SubjectDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [dept, setDept] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState([]);

  useEffect(() => {
    const fetchTeacherDetails = async () => {
        try {
          const teacherRes = await axios.get('/api/teacher/getTeacherDetails', {
            withCredentials: true
          });

          setTeacher(teacherRes.data.user);

          setSubjects(teacherRes.data.subjects);

          setDept(teacherRes.data.dept_name);
          
        } catch (error) {
          console.error('Error fetching data:', error.response?.data?.message || error.message);
        }
      };
    fetchTeacherDetails();        
  }, []);

  const fetchUpcomingSessions = async () => {
    try {
      const sessionRes = await axios.get('/api/teacher/upcomingSession', {
        withCredentials: true
      });
      setUpcomingSessions(sessionRes.data.sessions);
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error.response?.data?.message || error.message);
    }
  }
  useEffect(() => {
    fetchUpcomingSessions();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-pink-50">
      <div className="max-w-7xl mx-auto">
        {/* Two-Column Layout for Profile and Classes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Teacher Profile Card */}
          {teacher && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col items-center md:items-start md:flex-row">
                <div className="w-24 h-24 mb-4 md:mb-0 md:mr-6">
                  <img 
                    src="/api/placeholder/96/96" 
                    alt="Teacher" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-semibold text-indigo-800">{teacher.name}</h2>
                  <p className="text-gray-500 mb-4">Teacher ID: {teacher.id}</p>
                    <p className="text-gray-600">Email: {teacher.email}</p>
                    <p className="text-gray-600">Department: {dept}</p>
                </div>
              </div>
            </div>
          )}

          {/* Scheduled Classes Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-indigo-800 mb-4">Scheduled Classes</h2>
            <div className="space-y-4">
              {upcomingSessions.map((session, index) => (
                <div key={index} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">{session.name}</h3>
                        <p className="text-gray-500 text-sm">Subject: {session.subject_id}</p>
                        <p className="text-gray-500 text-sm">Date: {new Date(session.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subject Selection Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-indigo-800 mb-6">Select Subject</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {subjects.map((subject, index) => (
              <div key={index} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                <div className="w-16 h-16 mb-3">
                  <img 
                    src={`/api/placeholder/64/64`} 
                    alt={subject.name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-gray-800">{subject.name}</h3>
                <p className="text-gray-500 text-sm">Code: {subject.id}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectDashboard;

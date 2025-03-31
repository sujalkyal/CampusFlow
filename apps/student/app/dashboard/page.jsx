"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [student, setStudent] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentRes = await axios.get("/api/student/getStudentDetails");
        const sessionsRes = await axios.get("/api/student/getUpcomingSessions");
        const subjectsRes = await axios.get("/api/subject/getSubjects");

        setStudent(studentRes.data);
        setUpcomingSessions(sessionsRes.data);
        setSubjects(subjectsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-pink-100 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* My Profile Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">My Profile</h2>
          {student && (
            <div className="mt-4">
                <p className="text-lg font-semibold text-gray-700">{student.name}</p>
                <p className="text-gray-500">{student.email}</p>
                <p className="text-gray-500">
                Account Created: {new Date(student.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-500">
                Last Updated: {new Date(student.updatedAt).toLocaleDateString()}
                </p>
                <p className="text-gray-500">Department ID: {student.departmentId}</p>
                <p className="text-gray-500">Batch ID: {student.batchId}</p>
                <p className="text-gray-500">Classes Attended: {student.attendance.length}</p>
                <p className="text-gray-500">
                Assignments Submitted: {student.submissions.length}
                </p>
            </div>
            )}
        </div>

        {/* Upcoming Classes Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">Upcoming Classes</h2>
          <div className="mt-4 space-y-3">
            {upcomingSessions.map((session, index) => (
              <div key={index} className="bg-gray-100 p-3 rounded-lg shadow">
                <p className="font-semibold text-gray-800">{session.title}</p>
                <p className="text-gray-700">{session.subject}</p>
                <p className="text-gray-600">{session.teacher}</p>
                <p className="text-gray-500">{session.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Subjects Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg col-span-2">
          <h2 className="text-xl font-semibold text-gray-800">Choose Subject</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {subjects.map((subject, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg shadow">
                <p className="font-semibold text-gray-800">{subject.name}</p>
                <p className="text-gray-600">Teacher: {subject.teacher_name}</p>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;

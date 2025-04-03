"use client";
import React from "react";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useRouter, useParams } from 'next/navigation';

const AttendanceTable = () => {
    const { id: sessionId } = useParams();
    const [session, setSession] = useState(null);
    const [subjectId, setSubjectId] = useState(null);
    const [subjectName, setSubjectName] = useState(null);
    const [batchName, setBatchName] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const router = useRouter();

    const fetchSession = async () => {
        try {
            const response = await axios.post('/api/subject/getSubjectFromSession', { session_id: sessionId });
            if (!response.data || !response.data.subject_id) {
                console.error('Invalid session data:', response.data);
                return;
            }
            setSession(response.data);
            setSubjectId(response.data.subject_id);
        } catch (error) {
            console.error('Error fetching session:', error);
        }
    };

    useEffect(() => {
        fetchSession();
    }, [sessionId]);

    const fetchBatch = async () => {
        try {
            const response = await axios.post('/api/batch/getBatchFromSubject', { subject_id: subjectId });
            console.log("Batch API Response:", response.data);
            setSubjectName(response.data.subject.name);
            setBatchName(response.data.batchName);
            setStudents(response.data.students || []);
        } catch (error) {
            console.error('Error fetching batch:', error);
        }
    };

    useEffect(() => {
        if (subjectId) {
            fetchBatch();
        }
    }, [subjectId]);

    const markAttendance = async (studentId, status) => {
        try {
            setAttendance((prev) => ({
                ...prev,
                [studentId]: prev[studentId] === status ? "none" : status,
            }));
    
            // Send request to backend
            await axios.post('/api/session/attendance/createAttendance', {
                student_id: studentId,
                session_id: sessionId,
                status: status.toUpperCase(), // Ensure enum values match
            });
    
        } catch (error) {
            console.error("Error marking attendance:", error);
        }
    };
    

    return (
        <div className="p-6 space-y-8 bg-gradient-to-b from-pink-100 to-pink-50 min-h-screen">
            <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Department: Computer Science</h2>
                <p className="text-md text-gray-600 mb-1"><span className="font-semibold">Batch:</span> {batchName}</p>
                <p className="text-md text-gray-600"><span className="font-semibold">Subject:</span> {subjectName}</p>
            </div>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-800">
                            <th className="p-4 text-left">#</th>
                            <th className="p-4 text-left">Student Name</th>
                            <th className="p-4 text-center">Attendance</th>
                            <th className="p-4 text-center text-green-700">Present Days</th>
                            <th className="p-4 text-center text-red-700">Absent Days</th>
                            <th className="p-4 text-center text-yellow-700">Late Days</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? (
                            students.map((student, index) => (
                                <tr key={student.id} className={`border-t ${index % 2 === 0 ? "bg-pink-50" : "bg-white"} hover:bg-pink-100`}>
                                    <td className="p-4 text-center font-medium text-gray-700">{index + 1}</td>
                                    <td className="p-4 text-blue-600 font-semibold">{student.name}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                className={`p-2 rounded-full transition ${attendance[student.id] === "present" ? "bg-green-500 text-white" : "bg-green-100 text-green-700"}`}
                                                onClick={() => markAttendance(student.id, "present")}
                                            >
                                                <CheckCircle size={20} />
                                            </button>
                                            <button
                                                className={`p-2 rounded-full transition ${attendance[student.id] === "absent" ? "bg-red-500 text-white" : "bg-red-100 text-red-700"}`}
                                                onClick={() => markAttendance(student.id, "absent")}
                                            >
                                                <XCircle size={20} />
                                            </button>
                                            <button
                                                className={`p-2 rounded-full transition ${attendance[student.id] === "late" ? "bg-yellow-500 text-white" : "bg-yellow-100 text-yellow-700"}`}
                                                onClick={() => markAttendance(student.id, "late")}
                                            >
                                                <Clock size={20} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center text-green-700 font-bold">{student.presentDays || 0}</td>
                                    <td className="p-4 text-center text-red-500 font-bold">{student.absentDays || 0}</td>
                                    <td className="p-4 text-center text-yellow-700 font-bold">{student.lateDays || 0}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center p-6 text-gray-500">No students found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceTable;

'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function StudentSubmission() {
  const params = useParams();
  const assignmentId = params?.id;

  const [submittedStudents, setSubmittedStudents] = useState([]);
  const [notSubmittedStudents, setNotSubmittedStudents] = useState([]);

  useEffect(() => {
    if (!assignmentId) return;

    const fetchData = async () => {
      try {
        // Get submitted students
        const resSubmitted = await axios.post('/api/session/assignment/getSubmissionDetails', {
          assignment_id: assignmentId,
        });

        const submitted = resSubmitted.data || [];

        // Get all students of the batch
        const resAll = await axios.post('/api/session/assignment/getAllStudents', {
          assignment_id: assignmentId,
        });

        const all = resAll.data || [];

        // Filter not submitted students
        const submittedIds = new Set(submitted.map((s) => s.id));
        const notSubmitted = all.filter((student) => !submittedIds.has(student.id));

        setSubmittedStudents(submitted);
        setNotSubmittedStudents(notSubmitted);
      } catch (err) {
        console.error('Error fetching students:', err);
      }
    };

    fetchData();
  }, [assignmentId]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-[#2F3C7E] mb-4">Student Submissions</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Submitted Tab */}
        <div>
          <h3 className="font-medium text-green-500 mb-3">Submitted</h3>
          <div className="space-y-3">
            {submittedStudents.map((student) => (
              <div key={student.id} className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden mr-2">
                  <img
                    src={student.avatar || '/api/placeholder/32/32'}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{student.name}</p>
                  <p className="text-xs text-gray-500">{student.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Not Submitted Tab */}
        <div>
          <h3 className="font-medium text-red-500 mb-3">Not Submitted</h3>
          <div className="space-y-3">
            {notSubmittedStudents.map((student) => (
              <div key={student.id} className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden mr-2">
                  <img
                    src={student.avatar || '/api/placeholder/32/32'}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium">{student.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

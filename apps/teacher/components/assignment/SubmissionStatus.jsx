'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SubmissionStatus() {
  const params = useParams();
  const assignmentId = params?.id;

  const [submittedCount, setSubmittedCount] = useState(0);
  const [notSubmittedCount, setNotSubmittedCount] = useState(0);

  useEffect(() => {
    if (!assignmentId) return;

    const fetchData = async () => {
      try {
        const resSubmitted = await axios.post('/api/session/assignment/getSubmissionDetails', {
          assignment_id: assignmentId,
        });

        const resAll = await axios.post('/api/session/assignment/getAllStudents', {
          assignment_id: assignmentId,
        });

        const submitted = resSubmitted.data || [];
        const all = resAll.data || [];

        setSubmittedCount(submitted.length);
        setNotSubmittedCount(all.length - submitted.length);
      } catch (err) {
        console.error('Error fetching submission status:', err);
      }
    };

    fetchData();
  }, [assignmentId]);

  const total = submittedCount + notSubmittedCount;
  const submittedPercent = total > 0 ? (submittedCount / total) * 100 : 0;
  const notSubmittedPercent = 100 - submittedPercent;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-[#2F3C7E] mb-4">Submission Status</h2>

      <div className="flex justify-center my-6">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke="#f3f4f6"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke="#22c55e"
              strokeWidth="3"
              strokeDasharray={`${submittedPercent}, 100`}
              transform="rotate(-90 18 18)"
            />
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke="#ef4444"
              strokeWidth="3"
              strokeDasharray={`${notSubmittedPercent}, 100`}
              strokeDashoffset={`-${submittedPercent}`}
              transform="rotate(-90 18 18)"
            />
          </svg>
        </div>
      </div>

      <div className="flex justify-center space-x-10">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600">Submitted ({submittedCount})</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600">Not Submitted ({notSubmittedCount})</span>
        </div>
      </div>
    </div>
  );
}

"use client";
import React from "react";
import { useParams } from "next/navigation";

const AssignmentPage = () => {
  const { id: assignmentId } = useParams();

  return (
    <div className="min-h-screen bg-[#FBEAEB] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-semibold text-[#2F3C7E] mb-4">Assignment</h1>

        {/* Assignment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AssignmentDetails />
          <SubmittedFiles />
        </div>

        {/* Upload Section */}
        <UploadSection />
      </div>
    </div>
  );
};

// Assignment Details Component
const AssignmentDetails = () => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#2F3C7E]">Assignment Details</h2>
        <span className="bg-[#2F3C7E] text-white text-xs px-3 py-1 rounded-full">Active</span>
      </div>
      <div className="mt-3">
        <p className="text-gray-600">
          <strong className="text-[#2F3C7E]">Due Date:</strong> March 25, 2024
        </p>
        <p className="text-gray-600">
          <strong className="text-[#2F3C7E]">Submissions:</strong> 15 students submitted
        </p>
        <p className="mt-2 text-gray-700 border p-3 rounded bg-gray-100">
          Complete the programming exercise focusing on data structures and algorithms.
          Make sure to include proper documentation and test cases.
        </p>
      </div>
    </div>
  );
};

// Submitted Files Component
const SubmittedFiles = () => {
  const files = [
    { name: "Assignment1.pdf", size: "2.5 MB", date: "Mar 20, 2024" },
    { name: "Documentation.docx", size: "1.8 MB", date: "Mar 21, 2024" },
    { name: "SourceCode.zip", size: "4.2 MB", date: "Mar 22, 2024" },
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#2F3C7E]">Files</h2>
        <button className="bg-[#2F3C7E] text-white px-3 py-1 rounded text-sm hover:bg-opacity-90">
          Upload New
        </button>
      </div>
      <div className="mt-3 space-y-3">
        {files.map((file, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-100 rounded">
            <div>
              <p className="font-medium text-[#2F3C7E]">{file.name}</p>
              <p className="text-xs text-gray-600">
                {file.size} • {file.date}
              </p>
            </div>
            <button className="text-[#2F3C7E] hover:text-[#1d2860]">
              ⬇️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Upload Section Component
const UploadSection = () => {
  return (
    <div className="mt-6 p-5 bg-white rounded-xl shadow-lg border">
      <h2 className="text-xl font-semibold text-[#2F3C7E] mb-3">Add Your Assignment</h2>
      <div className="border-dashed border-2 border-gray-400 p-6 rounded-xl text-center cursor-pointer hover:border-[#2F3C7E]">
        <p className="text-[#2F3C7E] text-lg">➕</p>
        <p className="text-gray-600 text-sm">Click to upload your assignment</p>
      </div>
      <p className="mt-3 text-right text-sm text-[#2F3C7E] cursor-pointer hover:underline">
        Submission Guidelines
      </p>
    </div>
  );
};

export default AssignmentPage;

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

export default function Signup() {
  const router = useRouter();
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get("/api/dept/getAllDept");
        setDepartments(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDepartments();
  }, []);

  const handleDeptChange = async (deptId) => {
    setSelectedDept(deptId);
    setSelectedBatches([]);
    setSelectedSubjects([]);
    try {
      const res = await axios.post("/api/batch/getAllBatches", { dept_id: deptId });
      setBatches(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBatchChange = async (e) => {
    const selectedBatchIds = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedBatches(selectedBatchIds);
    setSelectedSubjects([]); // Reset subjects when batches change

    if (selectedBatchIds.length > 0) {
      try {
        const res = await axios.post("/api/subject/getSubjectsByBatches", { batch_ids: selectedBatchIds });
        setSubjects(res.data);
      } catch (error) {
        console.error(error);
      }
    } else {
      setSubjects([]);
    }
  };

  const handleSubjectChange = (e) => {
    const selectedSubjectIds = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedSubjects(selectedSubjectIds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/signup", {
        ...form,
        deptId: selectedDept,
        batchIds: selectedBatches,
        subjectIds: selectedSubjects,
      });
      alert("Signup successful! Redirecting to login...");
      router.push("/api/auth/signin");
    } catch (error) {
      alert("Signup failed: " + (error.response?.data?.error || "An error occurred"));
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side with form */}
      <div className="w-1/2 flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center">
              <div className="text-indigo-800 font-bold">
                <svg width="" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text y="16" fontFamily="Arial" fontSize="16" fontWeight="600" fill="#5E35B1">College</text>
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-semibold text-gray-800 mb-3">Sign up</h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Name"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {/* Department Selection */}
            <div className="mb-4">
              <select 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                onChange={(e) => handleDeptChange(e.target.value)} 
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Multi-Select for Batches */}
            {batches.length > 0 && (
              <div className="mb-4">
                <select
                  multiple
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 h-24"
                  onChange={handleBatchChange}
                  required
                >
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Multi-Select for Subjects */}
            {subjects.length > 0 && (
              <div className="mb-4">
                <select
                  multiple
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 h-24"
                  onChange={handleSubjectChange}
                  required
                >
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-800 text-white p-3 rounded-md hover:bg-indigo-900 flex items-center justify-center"
            >
              Continue
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2">
                <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="white"/>
              </svg>
            </button>
          </form>

          <div className="mt-6 text-center text-gray-600 text-sm">
            Already have an account? <a href="/api/auth/signin" className="text-indigo-800 hover:underline">Sign in</a>
          </div>
        </div>
      </div>

      {/* Right side with purple background */}
      <div className="w-1/2 bg-gradient-to-br from-indigo-700 to-purple-600 flex items-center justify-center">
        <div className="w-full h-full bg-indigo-600 opacity-30">
          <svg width="100%" height="100%" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <circle cx="250" cy="250" r="150" fill="white" fillOpacity="0.1" />
            <circle cx="400" cy="150" r="100" fill="white" fillOpacity="0.1" />
            <circle cx="100" cy="350" r="80" fill="white" fillOpacity="0.1" />
          </svg>
        </div>
      </div>
    </div>
  );
}
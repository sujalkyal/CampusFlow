"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            required
            className="w-full p-2 border rounded"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-2 border rounded"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-2 border rounded"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {/* Department Selection */}
          <select className="w-full p-2 border rounded" onChange={(e) => handleDeptChange(e.target.value)} required>
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>

          {/* Multi-Select for Batches */}
          {batches.length > 0 && (
            <select
              multiple
              className="w-full p-2 border rounded h-24"
              onChange={handleBatchChange}
              required
            >
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
          )}

          {/* Multi-Select for Subjects */}
          {subjects.length > 0 && (
            <select
              multiple
              className="w-full p-2 border rounded h-24"
              onChange={handleSubjectChange}
              required
            >
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          )}

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}

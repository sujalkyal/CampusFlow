import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const EditTeacherPopup = ({ isOpen, onClose, teacher }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        oldPassword: "",
        newPassword: "",
        dept_name: "",
        dept_id: "",
        batches: [],
        subjects: [],
    });
    const [batches, setBatches] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        if (teacher) {
            setFormData({
                name: teacher.name,
                email: teacher.email,
                oldPassword: "",
                newPassword: "",
                dept_name: teacher.dept_name,
                dept_id: teacher.dept_id,
                batches: teacher.batches || [],
                subjects: teacher.subjects.map((s) => s.id),
            });
        }
    }, [teacher]);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get("/api/dept/getAllDept");
            setDepartments(response.data);
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    const fetchBatches = async (deptId) => {
        try {
            const response = await axios.post("/api/batch/getAllBatches", {
                dept_id: deptId,
            });
            setBatches(response.data);
        } catch (error) {
            console.error("Error fetching batches:", error);
        }
    };

    const fetchSubjects = async (batchIds) => {
        try {
            const response = await axios.post("/api/subject/getSubjectsByBatches", {
                batch_ids: batchIds,
            });
            setSubjects(response.data);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    useEffect(() => {
        fetchDepartments();
        if (teacher) {
            fetchBatches(teacher.dept_id);
        }
    }, [teacher]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDepartmentChange = (e) => {
        const selectedDeptId = e.target.value;
        setFormData({ 
            ...formData,  
            dept_id: selectedDeptId, 
            batches: [], 
            subjects: [] 
        });
        fetchBatches(selectedDeptId);
    };
    
    const handleBatchChange = (e) => {
        const selectedBatchIds = Array.from(e.target.selectedOptions, (option) => option.value);
        setFormData({ 
            ...formData,  
            batches: selectedBatchIds, 
            subjects: [] 
        });
        fetchSubjects(selectedBatchIds);
    };
    
    const handleSubjectChange = (e) => {
        const selectedSubjectIds = Array.from(e.target.selectedOptions, (option) => option.value);
        setFormData({ 
            ...formData,  
            subjects: selectedSubjectIds 
        });
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/teacher/editDetails", formData, { withCredentials: true });
            alert("Details updated successfully!");
            onClose();
            window.location.reload();
        } catch (error) {
            alert("Update failed: " + (error.response?.data?.error || "An error occurred"));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50">
  <motion.div 
    className="bg-gradient-to-br from-[#2f2f45] to-[#1e1e2f] text-[#fefdfd] p-6 rounded-2xl shadow-2xl w-full max-w-md"
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.95, opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <h2 className="text-2xl font-bold mb-4 text-center text-[#b1aebb]">Edit Teacher Details</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required
        className="w-full p-2 bg-[#1e1e2f] border border-[#5f43b2] rounded-lg focus:outline-none" />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required
        className="w-full p-2 bg-[#1e1e2f] border border-[#5f43b2] rounded-lg focus:outline-none" />
      <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} placeholder="Old Password" required
        className="w-full p-2 bg-[#1e1e2f] border border-[#5f43b2] rounded-lg focus:outline-none" />
      <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="New Password"
        className="w-full p-2 bg-[#1e1e2f] border border-[#5f43b2] rounded-lg focus:outline-none" />

      <select name="dept_id" value={formData.dept_id} onChange={handleDepartmentChange}
        className="w-full p-2 bg-[#1e1e2f] border border-[#5f43b2] rounded-lg">
        <option value="" disabled>Select Department</option>
        {departments.map(dept => (
          <option key={dept.id} value={dept.id}>{dept.name}</option>
        ))}
      </select>

      <select multiple name="batches" onChange={handleBatchChange}
        className="w-full p-2 bg-[#1e1e2f] border border-[#5f43b2] rounded-lg">
        {batches.map(batch => (
          <option key={batch.id} value={batch.id}>{batch.name}</option>
        ))}
      </select>

      <select multiple name="subjects" onChange={handleSubjectChange}
        className="w-full p-2 bg-[#1e1e2f] border border-[#5f43b2] rounded-lg">
        {subjects.map(subject => (
          <option key={subject.id} value={subject.id}>{subject.name}</option>
        ))}
      </select>

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-lg">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-[#5f43b2] hover:bg-[#3a3153] transition text-white rounded-lg">Save</button>
      </div>
    </form>
  </motion.div>
</div>

    );
};

export default EditTeacherPopup;

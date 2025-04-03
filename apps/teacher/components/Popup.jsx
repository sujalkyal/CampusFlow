import { useState, useEffect } from "react";
import axios from "axios";

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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit Teacher Details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Name" required />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Email" required />
                    <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Old Password" required />
                    <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="New Password" />
                    <select name="dept_id" value={formData.dept_id} onChange={handleDepartmentChange} className="w-full p-2 border rounded-lg" required>
                        <option value="" disabled>Select Department</option>
                        {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                    <select name="batches" multiple onChange={handleBatchChange} className="w-full p-2 border rounded-lg">
                        {batches.map((batch) => (
                            <option key={batch.id} value={batch.id}>{batch.name}</option>
                        ))}
                    </select>
                    <select name="subjects" multiple onChange={handleSubjectChange} className="w-full p-2 border rounded-lg">
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>{subject.name}</option>
                        ))}
                    </select>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded-lg">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTeacherPopup;

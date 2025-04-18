import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            toast.error("Failed to load departments", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
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
            toast.error("Failed to load batches", {
                position: "top-right",
                autoClose: 3000,
            });
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
            toast.error("Failed to load subjects", {
                position: "top-right",
                autoClose: 3000,
            });
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
        setIsSubmitting(true);
        
        try {
            await axios.post("/api/teacher/editDetails", formData, { withCredentials: true });
            
            toast.success("Details updated successfully!", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                className: "bg-gradient-to-r from-[#5f43b2] to-[#3a3153] text-white",
                progressClassName: "bg-white/30",
                onClose: () => {
                    onClose();
                    window.location.reload();
                }
            });
        } catch (error) {
            const errorMessage = error.response?.data?.error || "An error occurred";
            console.error("Update failed:", errorMessage);
            
            toast.error(`Update failed: ${errorMessage}`, {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                className: "bg-gradient-to-r from-red-600 to-red-800 text-white",
                progressClassName: "bg-white/30"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50">
            <ToastContainer 
                theme="dark" 
                limit={3} 
                className="custom-scrollbar"
                toastClassName="rounded-lg shadow-xl backdrop-blur-md"
            />
            
            <motion.div 
                className="bg-gradient-to-br from-[#2f2f45] to-[#1e1e2f] text-[#fefdfd] p-6 rounded-2xl shadow-2xl w-full max-w-md"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <h2 className="text-2xl font-bold mb-4 text-center text-[#b1aebb]">Edit Teacher Details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm text-[#b1aebb]">Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            placeholder="Name" 
                            required
                            className="w-full p-2 bg-[#1e1e2f] border border-[#5f43b2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f43b2]/50 transition" 
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-sm text-[#b1aebb]">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            placeholder="Email" 
                            required
                            className="w-full p-2 bg-[#1e1e2f] border border-[#5f43b2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f43b2]/50 transition" 
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-sm text-[#b1aebb]">Current Password</label>
                        <input 
                            type="password" 
                            name="oldPassword" 
                            value={formData.oldPassword} 
                            onChange={handleChange} 
                            placeholder="Current Password" 
                            required
                            className="w-full p-2 bg-[#1e1e2f] border border-[#5f43b2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f43b2]/50 transition" 
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-sm text-[#b1aebb]">New Password (leave blank to keep current)</label>
                        <input 
                            type="password" 
                            name="newPassword" 
                            value={formData.newPassword} 
                            onChange={handleChange} 
                            placeholder="New Password"
                            className="w-full p-2 bg-[#1e1e2f] border border-[#5f43b2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f43b2]/50 transition" 
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm text-[#b1aebb]">Department</label>
                        <select 
                            name="dept_id" 
                            value={formData.dept_id} 
                            onChange={handleDepartmentChange}
                            className="w-full p-2 bg-[#1e1e2f] border border-[#5f43b2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f43b2]/50 custom-scrollbar transition"
                        >
                            <option value="" disabled>Select Department</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm text-[#b1aebb]">Batches (hold Ctrl to select multiple)</label>
                        <select 
                            multiple 
                            name="batches" 
                            value={formData.batches}
                            onChange={handleBatchChange}
                            className="w-full p-2 bg-[#1e1e2f] border border-[#5f43b2] rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-[#5f43b2]/50 custom-scrollbar transition"
                        >
                            {batches.map(batch => (
                                <option key={batch.id} value={batch.id}>
                                    {batch.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm text-[#b1aebb]">Subjects (hold Ctrl to select multiple)</label>
                        <select 
                            multiple 
                            name="subjects" 
                            value={formData.subjects}
                            onChange={handleSubjectChange}
                            className="w-full p-2 bg-[#1e1e2f] border border-[#5f43b2] rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-[#5f43b2]/50 custom-scrollbar transition"
                        >
                            {subjects.map(subject => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                        <motion.button 
                            type="button" 
                            onClick={onClose} 
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </motion.button>
                        
                        <motion.button 
                            type="submit" 
                            className={`px-4 py-2 bg-[#5f43b2] text-white rounded-lg flex items-center justify-center min-w-[80px] ${isSubmitting ? 'opacity-70' : 'hover:bg-[#3a3153]'}`}
                            whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                            whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                            ) : (
                                "Save Changes"
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default EditTeacherPopup;

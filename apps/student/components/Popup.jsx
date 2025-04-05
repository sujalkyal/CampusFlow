import { useState, useEffect, use } from "react";
import axios from "axios";

const EditStudentPopup = ({ isOpen, onClose, student }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        oldPassword: "",
        newPassword: "",
        batch_id: ""
    });
    const [batches, setBatches] = useState([]);

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const response = await axios.post("/api/batch/getAllBatches", { dept_id: student.dept_id }, { withCredentials: true });
                setBatches(response.data);
            } catch (error) {
                console.error("Error fetching batches:", error.response?.data?.error || "An error occurred");
            }
        };
        fetchBatches();
    }, [student.dept_id]);

    useEffect(() => {
        if (student) {
            setFormData({
                name: student.name,
                email: student.email,
                oldPassword: "",
                newPassword: "",
                batch_id: student.batch_id || ""
            });
        }
    }, [student]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleBatchChange = (e) => {
        const selectedBatchId = e.target.value;
        setFormData({
            ...formData,
            batch_id: selectedBatchId,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/student/editDetails", formData, { withCredentials: true });
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
                <h2 className="text-xl font-bold mb-4">Edit Student Details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Name" required />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Email" required />
                    <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Old Password" required />
                    <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="New Password" />
                    <select name="batches" onChange={handleBatchChange} className="w-full p-2 border rounded-lg">
                        {batches.map((batch) => (
                            <option key={batch.id} value={batch.id}>{batch.name}</option>
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

export default EditStudentPopup;

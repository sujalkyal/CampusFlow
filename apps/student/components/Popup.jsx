import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditStudentPopup = ({ isOpen, onClose, student }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    batch_id: "",
  });
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await axios.post(
          "/api/batch/getAllBatches",
          { dept_id: student.dept_id },
          { withCredentials: true }
        );
        setBatches(response.data);
      } catch (error) {
        console.error(
          "Error fetching batches:",
          error.response?.data?.error || "An error occurred"
        );
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
        batch_id: student.batch_id || "",
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
      await axios.post("/api/student/editDetails", formData, {
        withCredentials: true,
      });
      toast.success("Details updated successfully!");
      onClose();
      setTimeout(() => {
        window.location.reload();
      }, 5000); // Wait for toast to show before reloading
    } catch (error) {
      toast.error(
        "Update failed: " + (error.response?.data?.error || "An error occurred")
      );
    }
  };

  if (!isOpen) return null;

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const popupVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
  };

  const inputVariants = {
    focus: {
      boxShadow: "0 0 0 2px rgba(95, 67, 178, 0.6)",
      borderColor: "#5f43b2",
      scale: 1.01,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-[#010101]/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Popup content */}
      <motion.div
        className="relative w-full max-w-md mx-4 overflow-hidden"
        variants={popupVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {/* Decorative gradient top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5f43b2] to-[#3a3153]"></div>

        {/* Blurred background element */}
        <div className="absolute -inset-40 bg-[#5f43b2]/5 rounded-full blur-3xl"></div>

        <div className="relative bg-[#010101]/90 backdrop-blur-xl rounded-lg shadow-2xl border border-[#3a3153]/50 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6 text-[#fefdfd] flex items-center">
              <span className="block w-1 h-6 bg-[#5f43b2] mr-2"></span>
              Edit Student Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm text-[#b1aebb]">Name</label>
                <motion.input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  whileFocus="focus"
                  variants={inputVariants}
                  className="w-full p-3 bg-[#010101]/70 border border-[#3a3153]/50 rounded-lg text-[#fefdfd] focus:outline-none transition-all duration-200"
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-[#b1aebb]">Email</label>
                <motion.input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  whileFocus="focus"
                  variants={inputVariants}
                  className="w-full p-3 bg-[#010101]/70 border border-[#3a3153]/50 rounded-lg text-[#fefdfd] focus:outline-none transition-all duration-200"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-[#b1aebb]">
                  Current Password
                </label>
                <motion.input
                  type="password"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  whileFocus="focus"
                  variants={inputVariants}
                  className="w-full p-3 bg-[#010101]/70 border border-[#3a3153]/50 rounded-lg text-[#fefdfd] focus:outline-none transition-all duration-200"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-[#b1aebb]">New Password</label>
                <motion.input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  whileFocus="focus"
                  variants={inputVariants}
                  className="w-full p-3 bg-[#010101]/70 border border-[#3a3153]/50 rounded-lg text-[#fefdfd] focus:outline-none transition-all duration-200"
                  placeholder="Enter new password (optional)"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-[#b1aebb]">Batch</label>
                <motion.select
                  name="batches"
                  onChange={handleBatchChange}
                  whileFocus="focus"
                  variants={inputVariants}
                  className="w-full p-3 bg-[#010101]/70 border border-[#3a3153]/50 rounded-lg text-[#fefdfd] focus:outline-none transition-all duration-200"
                >
                  {batches.map((batch) => (
                    <option
                      key={batch.id}
                      value={batch.id}
                      className="bg-[#010101] text-[#fefdfd]"
                    >
                      {batch.name}
                    </option>
                  ))}
                </motion.select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#010101]/80 border border-[#3a3153]/50 text-[#b1aebb] rounded-lg hover:cursor-pointer"
                  whileHover={{ backgroundColor: "rgba(177, 174, 187, 0.1)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  Cancel
                </motion.button>

                <motion.button
                  type="submit"
                  className="px-5 py-2.5 bg-[#5f43b2] text-[#fefdfd] rounded-lg relative overflow-hidden group hover:cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#5f43b2] to-[#3a3153] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative">Save Changes</span>
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditStudentPopup;

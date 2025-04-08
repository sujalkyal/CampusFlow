"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // For dynamic route param
import axios from 'axios';

export default function AssignmentDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    dueDate: '',
    totalPoints: '',
    instructions: ''
  });
 
  const params = useParams();
  const assignmentId = params?.id;

  // Fetch assignment details
  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        const res = await axios.post(`/api/session/assignment/getDetails`, {
          assignment_id: assignmentId
        });
        setFormData({
          title: res.data.title || "",
          dueDate: res.data.endDate?.split("T")[0] || "",
          instructions: res.data.description || "",
          totalPoints: "100", // or res.data.totalPoints || "100"
        });
        
      } catch (err) {
        console.error("Failed to load assignment", err);
      }
    };
  
    fetchAssignmentDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/session/assignment/editDetails', {
        id: assignmentId,
        title: formData.title,
        endDate: formData.dueDate,
        description: formData.instructions,
      });
  
      if (response.status === 200) {
        setIsModalOpen(false);
        // Optionally refresh UI or show success message
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };
  

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#2F3C7E]">Assignment Details</h2>
        <div className="flex items-center space-x-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Due: {formData.dueDate}
          </span>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-[#2F3C7E] hover:bg-[#2F3C7E] hover:text-white p-1 rounded transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>
      </div>
  
      <div className="space-y-3">
        <div className="flex items-start text-gray-700">
          <strong className="mr-2">Title:</strong> {formData.title}
        </div>
        <div className="flex items-start text-gray-700">
          <strong className="mr-2">Due Date:</strong> {formData.dueDate}
        </div>
        <div className="flex items-start text-gray-700">
          <strong className="mr-2">Total Points:</strong> 100
        </div>
      </div>
  
      <div className="mt-6">
        <h3 className="text-gray-700 font-medium mb-2">Instructions:</h3>
        <p className="text-gray-600 whitespace-pre-line">{formData.instructions}</p>
      </div>
  
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-[#2F3C7E]">Edit Assignment Details</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
  
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Assignment Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2F3C7E] focus:border-[#2F3C7E]"
                  required
                />
              </div>
  
              <div className="mb-4">
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2F3C7E] focus:border-[#2F3C7E]"
                  required
                />
              </div>
  
  
              <div className="mb-4">
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                <textarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2F3C7E] focus:border-[#2F3C7E]"
                  required
                ></textarea>
              </div>
  
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2F3C7E] border border-transparent rounded-md text-sm font-medium text-white hover:bg-opacity-90"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
  
}

import { useState } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const themeColors = {
    primary: '#2F3C7E',
    secondary: '#FBEAEB',
    white: '#FFFFFF',
    black: '#000000',
};

const AddSessionCard = ({ subject_id, onSessionCreated }) => {
  const [dateTime, setDateTime] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [title, setTitle] = useState("");

  const handleCreateSession = async () => {
    if (!dateTime || !title) {
      toast.warn("Please enter a title and date.");
      return;
    }

    try {
      await axios.post("/api/subject/session/createSession", {
        title,
        subject_id,
        date: dateTime,
      });

      toast.success("Session created successfully!");

        onSessionCreated();

      handleClosePopup();
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("Failed to create session.");
    }
  };

  const handleClosePopup = () => {
    setTitle(""); // Clear title input
    setDateTime(""); // Clear datetime input
    setShowPopup(false); // Close popup
  };

  return (
    <>
      {!showPopup ? (
        <button
          onClick={() => setShowPopup(true)}
          className="border-2 border-dashed border-gray-400 rounded-lg p-4 flex items-center justify-center hover:bg-secondary w-full h-full transition hover:cursor-pointer"
        >
          <Plus className="text-gray-500" size={24} />
        </button>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-medium mb-4 text-primary">Create New Session</h2>
            <input
              type="text"
              placeholder="Session Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full mb-4 focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full mb-4 focus:ring-2 focus:ring-primary focus:outline-none"
              min={new Date().toISOString().slice(0, 16)}
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button 
                onClick={() => handleClosePopup()} 
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition w-24 hover:cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateSession} 
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition w-24 hover:cursor-pointer"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AddSessionCard;

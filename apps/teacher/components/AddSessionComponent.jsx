import { useState } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from 'framer-motion';

const AddSessionCard = ({ subject_id, onSessionCreated }) => {
  // Theme colors from previous design
  const themeColors = {
    primary: '#5f43b2', // Studio purple
    secondary: '#010101', // Black
    accent: '#3a3153', // Mystique
    card: 'rgba(42, 42, 64, 0.4)',
    text: '#fefdfD', // Soft Peach
    faded: '#b1aebb' // Gray Powder
  };

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
      <motion.div
        className="w-full h-full"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {!showPopup ? (
          <motion.button
            onClick={() => setShowPopup(true)}
            className="w-full h-full p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-colors duration-300"
            style={{ 
              borderColor: themeColors.accent,
              backgroundColor: 'rgba(58, 49, 83, 0.2)',
              minHeight: '100px'
            }}
            whileHover={{ backgroundColor: 'rgba(58, 49, 83, 0.4)' }}
          >
            <Plus size={24} color={themeColors.primary} />
            <span className="mt-2 text-sm font-medium" style={{ color: themeColors.faded }}>Add Session</span>
          </motion.button>
        ) : null}
      </motion.div>

      <AnimatePresence>
        {showPopup && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="rounded-2xl shadow-2xl overflow-hidden"
              style={{ backgroundColor: themeColors.card, backdropFilter: 'blur(10px)' }}
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="p-6 w-96">
                <h2 
                  className="text-xl font-semibold mb-6" 
                  style={{ color: themeColors.text }}
                >
                  Create New Session
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label 
                      className="block text-sm mb-2" 
                      style={{ color: themeColors.faded }}
                    >
                      Session Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter session title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
                      style={{ 
                        backgroundColor: 'rgba(58, 49, 83, 0.4)', 
                        color: themeColors.text,
                        border: `1px solid ${themeColors.accent}`,
                        focusRing: themeColors.primary
                      }}
                    />
                  </div>
                  
                  <div>
                    <label 
                      className="block text-sm mb-2" 
                      style={{ color: themeColors.faded }}
                    >
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value)}
                      className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
                      style={{ 
                        backgroundColor: 'rgba(58, 49, 83, 0.4)', 
                        color: themeColors.text,
                        border: `1px solid ${themeColors.accent}`,
                        focusRing: themeColors.primary
                      }}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-8">
                  <motion.button 
                    onClick={handleClosePopup}
                    className="px-5 py-2 rounded-lg"
                    style={{ backgroundColor: 'rgba(58, 49, 83, 0.6)', color: themeColors.text }}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(58, 49, 83, 0.8)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button 
                    onClick={handleCreateSession}
                    className="px-5 py-2 rounded-lg"
                    style={{ backgroundColor: themeColors.primary, color: themeColors.text }}
                    whileHover={{ scale: 1.05, backgroundColor: '#6f53c2' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Create
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        theme="dark"
        toastStyle={{ 
          backgroundColor: themeColors.card,
          color: themeColors.text
        }}
      />
    </>
  );
};

export default AddSessionCard;
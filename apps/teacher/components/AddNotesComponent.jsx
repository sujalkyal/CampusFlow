import { useState } from "react";
import { Plus, File, X } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEdgeStore } from "../app/lib/edgestore"; // Import EdgeStore hook
import { motion, AnimatePresence } from 'framer-motion';

const AddNoteCard = ({ subject_id, onNoteCreated }) => {
  // Theme colors from previous design
  const themeColors = {
    primary: '#5f43b2', // Studio purple
    secondary: '#010101', // Black
    accent: '#3a3153', // Mystique
    card: 'rgba(42, 42, 64, 0.4)',
    text: '#fefdfD', // Soft Peach
    faded: '#b1aebb' // Gray Powder
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrls, setFileUrls] = useState([]); // Store uploaded file URLs
  const [showPopup, setShowPopup] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { edgestore } = useEdgeStore();
  const publicFiles = edgestore.publicFiles;

  const handleFileUpload = async (files) => {
    setUploading(true);
    try {
      const uploadedUrls = await Promise.all(
        [...files].map(async (file) => {
          const res = await publicFiles.upload({
            file,
            options: {},
          });
          return res.url; // Get the uploaded file URL
        })
      );

      setFileUrls((prev) => [...prev, ...uploadedUrls]); // Append URLs to state
      toast.success("Files uploaded successfully!");
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("Failed to upload files.");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!title && fileUrls.length === 0) {
      toast.warn("Please enter a title or upload at least one file.");
      return;
    }

    try {
      await axios.post("/api/subject/notes/addNotes", {
        title,
        description,
        subject_id,
        files: fileUrls, // Pass file URLs array to backend
      });

      toast.success("Note added successfully!");
      if (onNoteCreated) onNoteCreated();
      handleClosePopup();
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note.");
    }
  };

  const handleClosePopup = () => {
    setTitle("");
    setDescription("");
    setFileUrls([]);
    setShowPopup(false);
  };

  const removeFile = (indexToRemove) => {
    setFileUrls(fileUrls.filter((_, index) => index !== indexToRemove));
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
            className="w-full h-full p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-colors duration-300 hover:cursor-pointer"
            style={{ 
              borderColor: themeColors.accent,
              backgroundColor: 'rgba(58, 49, 83, 0.2)',
              minHeight: '100px'
            }}
            whileHover={{ backgroundColor: 'rgba(58, 49, 83, 0.4)' }}
          >
            <Plus size={24} color={themeColors.primary} />
            <span className="mt-2 text-sm font-medium" style={{ color: themeColors.faded }}>Add Note</span>
          </motion.button>
        ) : null}
      </motion.div>

      <AnimatePresence>
        {showPopup && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-50 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="rounded-2xl shadow-2xl overflow-hidden"
              style={{ backgroundColor: themeColors.secondary }}
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
                  Add New Note
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label 
                      className="block text-sm mb-2" 
                      style={{ color: themeColors.faded }}
                    >
                      Title (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Enter note title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
                      style={{ 
                        backgroundColor: 'rgba(58, 49, 83, 0.4)', 
                        color: themeColors.text,
                        border: `1px solid ${themeColors.accent}`,
                      }}
                    />
                  </div>
                  
                  <div>
                    <label 
                      className="block text-sm mb-2" 
                      style={{ color: themeColors.faded }}
                    >
                      Description (Optional)
                    </label>
                    <textarea
                      placeholder="Enter description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="3"
                      className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
                      style={{ 
                        backgroundColor: 'rgba(58, 49, 83, 0.4)', 
                        color: themeColors.text,
                        border: `1px solid ${themeColors.accent}`,
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label 
                      className="block text-sm mb-2" 
                      style={{ color: themeColors.faded }}
                    >
                      Upload Files
                    </label>
                    <motion.div
                      className="relative overflow-hidden"
                      whileHover={{ scale: 1.01 }}
                    >
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                        disabled={uploading}
                      />
                      <div 
                        className="w-full p-3 rounded-lg flex items-center justify-center cursor-pointer"
                        style={{ 
                          backgroundColor: 'rgba(58, 49, 83, 0.4)',
                          border: `1px dashed ${themeColors.accent}`,
                        }}
                      >
                        <Plus size={18} color={themeColors.primary} className="mr-2" />
                        <span style={{ color: themeColors.faded }}>
                          {uploading ? "Uploading..." : "Select Files"}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                  
                  {uploading && (
                    <div className="flex items-center">
                      <motion.div 
                        className="w-full h-1 bg-gray-700 rounded-full overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div 
                          className="h-full"
                          style={{ backgroundColor: themeColors.primary }}
                          initial={{ width: "0%" }}
                          animate={{ 
                            width: "100%",
                            transition: { repeat: Infinity, duration: 1.5 }
                          }}
                        />
                      </motion.div>
                    </div>
                  )}
                  
                  {fileUrls.length > 0 && (
                    <div 
                      className="mt-2 max-h-32 overflow-y-auto rounded-lg p-2"
                      style={{ backgroundColor: 'rgba(58, 49, 83, 0.2)' }}
                    >
                      <ul className="space-y-2">
                        {fileUrls.map((url, index) => (
                          <motion.li 
                            key={index}
                            className="flex items-center justify-between rounded-lg p-2"
                            style={{ backgroundColor: 'rgba(58, 49, 83, 0.4)' }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="flex items-center truncate mr-2">
                              <File size={14} className="mr-2" style={{ color: themeColors.primary }} />
                              <span className="text-xs truncate" style={{ color: themeColors.faded }}>
                                {url.split('/').pop()}
                              </span>
                            </div>
                            <motion.button
                              onClick={() => removeFile(index)}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <X size={14} style={{ color: themeColors.faded }} />
                            </motion.button>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3 mt-8">
                  <motion.button 
                    onClick={handleClosePopup}
                    className="px-5 py-2 rounded-lg hover:cursor-pointer"
                    style={{ backgroundColor: 'rgba(58, 49, 83, 0.6)', color: themeColors.text }}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(58, 49, 83, 0.8)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button 
                    onClick={handleCreateNote}
                    className="px-5 py-2 rounded-lg hover:cursor-pointer"
                    style={{ backgroundColor: themeColors.primary, color: themeColors.text }}
                    whileHover={{ scale: 1.05, backgroundColor: '#6f53c2' }}
                    whileTap={{ scale: 0.95 }}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Add Note"}
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

export default AddNoteCard;
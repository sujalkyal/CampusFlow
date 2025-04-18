import { useState } from "react";
import { Plus, File, X, Upload, Check } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEdgeStore } from "../app/lib/edgestore";
import { motion, AnimatePresence } from 'framer-motion';

const AddNoteCard = ({ subject_id, onNoteCreated }) => {
  // Theme colors
  const themeColors = {
    primary: '#5f43b2', // Main purple
    secondary: '#010101', // Black
    accent: '#3a3153', // Darker purple
    card: 'rgba(42, 42, 64, 0.4)',
    text: '#fefdfD', // White text
    faded: '#b1aebb' // Gray text
  };

  // Component states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrls, setFileUrls] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // EdgeStore setup
  const { edgestore } = useEdgeStore();
  const publicFiles = edgestore.publicFiles;

  /**
   * Handles file uploads to EdgeStore
   * @param {FileList} files - Files to upload
   */
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const totalFiles = files.length;
      const uploadedUrls = [];
      
      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        const res = await publicFiles.upload({
          file,
          options: {},
          onProgressChange: (progress) => {
            // Calculate overall progress
            const fileProgress = progress / 100;
            const overallProgress = ((i + fileProgress) / totalFiles) * 100;
            setUploadProgress(Math.round(overallProgress));
          },
        });
        
        uploadedUrls.push(res.url);
      }
      
      setFileUrls((prev) => [...prev, ...uploadedUrls]);
      toast.success("Files uploaded successfully!");
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("Failed to upload files.");
    } finally {
      setUploading(false);
      setUploadProgress(100);
    }
  };

  /**
   * Creates a new note with the provided information
   */
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
        files: fileUrls,
      });

      toast.success("Note added successfully!");
      if (onNoteCreated) onNoteCreated();
      handleClosePopup();
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note.");
    }
  };

  /**
   * Closes the popup and resets form state
   */
  const handleClosePopup = () => {
    setTitle("");
    setDescription("");
    setFileUrls([]);
    setShowPopup(false);
  };

  /**
   * Removes a file from the uploaded files list
   * @param {number} indexToRemove - Index of file to remove
   */
  const removeFile = (indexToRemove) => {
    setFileUrls(fileUrls.filter((_, index) => index !== indexToRemove));
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      {/* Add Note Button */}
      <motion.div className="w-full">
        <button
          onClick={() => setShowPopup(true)}
          className="w-full p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-colors duration-300 hover:cursor-pointer"
          style={{ 
            borderColor: themeColors.accent,
            backgroundColor: 'rgba(58, 49, 83, 0.2)',
            minHeight: '100px'
          }}
        >
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1], rotate: [0, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Plus size={24} color={themeColors.primary} />
          </motion.div>
          <span 
            className="mt-2 text-sm font-medium" 
            style={{ color: themeColors.faded }}
          >
            Add Note
          </span>
        </button>
      </motion.div>

      {/* Modal Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            style={{ backdropFilter: 'blur(5px)' }}
          >
            {/* Opaque Background Overlay */}
            <div 
              className="fixed inset-0" 
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }} 
              onClick={handleClosePopup}
            ></div>
            
            {/* Modal Content */}
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-lg mx-auto"
              onClick={(e) => e.stopPropagation()}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div 
                className="rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                style={{ backgroundColor: themeColors.secondary }}
              >
                {/* Header */}
                <div className="sticky top-0 z-20 p-6 pb-2" style={{ backgroundColor: themeColors.secondary }}>
                  <div className="flex justify-between items-center">
                    <h2 
                      className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent"
                    >
                      Create New Note
                    </h2>
                    <motion.button
                      onClick={handleClosePopup}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 rounded-full"
                      style={{ backgroundColor: 'rgba(58, 49, 83, 0.4)' }}
                    >
                      <X size={18} color={themeColors.faded} />
                    </motion.button>
                  </div>
                  <div 
                    className="w-full h-px mt-4" 
                    style={{ backgroundColor: 'rgba(58, 49, 83, 0.5)' }}
                  ></div>
                </div>
                
                {/* Form Content */}
                <div className="p-6 pt-4">
                  <div className="space-y-5">
                    {/* Title Input */}
                    <div>
                      <label 
                        className="block text-sm font-medium mb-2" 
                        style={{ color: themeColors.faded }}
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        placeholder="Enter a title for your note"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all"
                        style={{ 
                          backgroundColor: 'rgba(58, 49, 83, 0.4)', 
                          color: themeColors.text,
                          border: `1px solid ${themeColors.accent}`
                        }}
                      />
                    </div>
                    
                    {/* Description Textarea */}
                    <div>
                      <label 
                        className="block text-sm font-medium mb-2" 
                        style={{ color: themeColors.faded }}
                      >
                        Description
                      </label>
                      <textarea
                        placeholder="Add some details about this note"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                        className="w-full p-3 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all custom-scrollbar"
                        style={{ 
                          backgroundColor: 'rgba(58, 49, 83, 0.4)', 
                          color: themeColors.text,
                          border: `1px solid ${themeColors.accent}`,
                          resize: 'vertical'
                        }}
                      />
                    </div>
                    
                    {/* File Upload */}
                    <div>
                      <label 
                        className="block text-sm font-medium mb-2" 
                        style={{ color: themeColors.faded }}
                      >
                        Attachments
                      </label>
                      <motion.div
                        className="relative overflow-hidden rounded-lg"
                        whileHover={{ 
                          backgroundColor: 'rgba(58, 49, 83, 0.5)',
                          borderColor: themeColors.primary
                        }}
                        initial={{ backgroundColor: 'rgba(58, 49, 83, 0.3)' }}
                      >
                        <input
                          type="file"
                          multiple
                          onChange={(e) => handleFileUpload(e.target.files)}
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                          disabled={uploading}
                        />
                        <div 
                          className="w-full p-4 flex items-center justify-center cursor-pointer border border-dashed"
                          style={{ borderColor: themeColors.accent }}
                        >
                          <Upload size={18} className="mr-3" style={{ color: themeColors.primary }} />
                          <span style={{ color: themeColors.faded }}>
                            {uploading ? `Uploading (${uploadProgress}%)` : "Click to upload files"}
                          </span>
                        </div>
                      </motion.div>

                      {/* Upload Progress */}
                      {uploading && (
                        <div className="mt-2">
                          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full"
                              style={{ backgroundColor: themeColors.primary }}
                              initial={{ width: "0%" }}
                              animate={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Uploaded Files List */}
                    {fileUrls.length > 0 && (
                      <div 
                        className="mt-2 max-h-40 overflow-y-auto rounded-lg p-3 custom-scrollbar"
                        style={{ backgroundColor: 'rgba(58, 49, 83, 0.2)' }}
                      >
                        <p className="text-xs mb-2" style={{ color: themeColors.faded }}>
                          {fileUrls.length} file{fileUrls.length !== 1 ? 's' : ''} attached
                        </p>
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
                                <File size={14} className="mr-2 flex-shrink-0" style={{ color: themeColors.primary }} />
                                <span className="text-xs truncate" style={{ color: themeColors.text }}>
                                  {url.split('/').pop()}
                                </span>
                              </div>
                              <motion.button
                                onClick={() => removeFile(index)}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                className="bg-opacity-20 bg-red-500 hover:bg-opacity-40 p-1 rounded-full"
                              >
                                <X size={14} style={{ color: '#ff6b6b' }} />
                              </motion.button>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div 
                    className="flex justify-end space-x-3 mt-8 pt-4"
                    style={{ borderTop: `1px solid rgba(58, 49, 83, 0.3)` }}
                  >
                    <motion.button 
                      onClick={handleClosePopup}
                      className="px-5 py-2 rounded-lg font-medium"
                      style={{ 
                        backgroundColor: 'rgba(58, 49, 83, 0.4)', 
                        color: themeColors.faded,
                        border: `1px solid ${themeColors.accent}` 
                      }}
                      whileHover={{ 
                        backgroundColor: 'rgba(58, 49, 83, 0.6)',
                        scale: 1.03
                      }}
                      whileTap={{ scale: 0.97 }}
                      disabled={uploading}
                    >
                      Cancel
                    </motion.button>
                    
                    <motion.button 
                      onClick={handleCreateNote}
                      className="px-5 py-2 rounded-lg font-medium flex items-center"
                      style={{ 
                        backgroundColor: themeColors.primary, 
                        color: themeColors.text
                      }}
                      whileHover={{ 
                        backgroundColor: '#6f53c2',
                        scale: 1.03
                      }}
                      whileTap={{ scale: 0.97 }}
                      disabled={uploading}
                    >
                      <Check size={18} className="mr-2" />
                      {uploading ? "Uploading..." : "Save Note"}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Toast Container */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{ 
          backgroundColor: themeColors.card,
          color: themeColors.text,
          borderLeft: `4px solid ${themeColors.primary}`
        }}
      />
    </>
  );
};

export default AddNoteCard;
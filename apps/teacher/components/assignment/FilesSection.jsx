'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import AddFiles from './AddFiles';
import { motion, AnimatePresence } from 'framer-motion';

export default function FilesSection() {
  const params = useParams();
  const assignmentId = params?.id;
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Fetch files when component mounts
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.post('/api/session/assignment/getFiles', { assignment_id: assignmentId });
        setFiles(res.data.files);
      } catch (err) {
        console.error('Error fetching files:', err);
      }
    };

    if (assignmentId) fetchFiles();
  }, [assignmentId]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  // Function to determine file type and preview
  const getFilePreview = (file) => {
    const fileName = file ? decodeURIComponent(file.split('/').pop()) : '';
    
    if (file?.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
      return {
        preview: (
          <div className="w-full aspect-square bg-[#010101]/60 rounded-md overflow-hidden flex items-center justify-center">
            <img 
              src={file} 
              alt={fileName} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-image.png'; // Fallback to placeholder
                e.target.className = "w-2/3 h-2/3 object-contain opacity-50";
              }}
            />
          </div>
        ),
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
        type: 'Image',
        name: fileName
      };
    } else if (file?.endsWith('.pdf')) {
      return {
        preview: (
          <div className="w-full aspect-square bg-[#3a3153]/30 rounded-md flex items-center justify-center">
            <div className="w-16 h-20 bg-[#fefcfd]/10 border border-[#fefcfd]/20 rounded flex items-center justify-center relative">
              <div className="absolute top-0 right-0 w-5 h-5 bg-[#3a3153] rounded-bl flex items-center justify-center">
                <span className="text-[9px] text-[#fefcfd] font-bold">PDF</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5f43b2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        ),
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        type: 'PDF',
        name: fileName
      };
    } else if (file?.match(/\.(doc|docx)$/i)) {
      return {
        preview: (
          <div className="w-full aspect-square bg-[#3a3153]/30 rounded-md flex items-center justify-center">
            <div className="w-16 h-20 bg-[#fefcfd]/10 border border-[#fefcfd]/20 rounded flex items-center justify-center relative">
              <div className="absolute top-0 right-0 w-5 h-5 bg-[#3a3153] rounded-bl flex items-center justify-center">
                <span className="text-[9px] text-[#fefcfd] font-bold">DOC</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5f43b2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        ),
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        type: 'Document',
        name: fileName
      };
    } else {
      // Generic file preview
      const extension = fileName.split('.').pop()?.toUpperCase() || 'FILE';
      return {
        preview: (
          <div className="w-full aspect-square bg-[#3a3153]/30 rounded-md flex items-center justify-center">
            <div className="w-16 h-20 bg-[#fefcfd]/10 border border-[#fefcfd]/20 rounded flex items-center justify-center relative">
              <div className="absolute top-0 right-0 w-5 h-5 bg-[#3a3153] rounded-bl flex items-center justify-center">
                <span className="text-[9px] text-[#fefcfd] font-bold">{extension.substring(0, 3)}</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5f43b2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        ),
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        ),
        type: extension.length > 0 ? extension : 'File',
        name: fileName
      };
    }
  };

  return (
    <div className="bg-[#010101] text-[#fefcfd] p-4 md:p-6 rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h2 className="text-xl font-medium text-[#fefcfd]">Files</h2>
          <div className="h-0.5 w-12 bg-[#5f43b2] mt-1.5 rounded-full"></div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#5f43b2] hover:bg-[#5f43b2]/90 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 hover:cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Upload
        </motion.button>
      </motion.div>
      
      {files.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {files.map((file, idx) => {
            const fileInfo = getFilePreview(file);
            
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ 
                  y: -4,
                  transition: { duration: 0.2 }
                }}
                className="group"
              >
                <div 
                  onClick={() => window.open(file, '_blank')}
                  className="cursor-pointer bg-[#3a3153] hover:bg-[#3a3153]/80 rounded-lg overflow-hidden flex flex-col transition-colors duration-200"
                >
                  {/* File Preview */}
                  <div className="mb-2">
                    {fileInfo.preview}
                  </div>
                  
                  {/* File Info */}
                  <div className="p-3 pt-0">
                    <div className="flex items-center mb-1.5 text-[#5f43b2]">
                      <div className="mr-1.5">
                        {fileInfo.icon}
                      </div>
                      <span className="text-xs text-[#b1aebb]">
                        {fileInfo.type}
                      </span>
                    </div>
                    <p className="text-xs text-[#fefcfd] truncate w-full" title={fileInfo.name}>
                      {fileInfo.name}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center bg-[#3a3153]/10 border border-[#3a3153]/20 rounded-lg py-12 px-4"
        >
          <div className="text-[#b1aebb]/70 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-[#b1aebb] text-sm">No files uploaded yet</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="mt-4 bg-[#5f43b2]/20 hover:bg-[#5f43b2]/30 text-[#5f43b2] py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 hover:cursor-pointer"
          >
            Upload your first file
          </motion.button>
        </motion.div>
      )}

      {/* Upload File Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#010101] border border-[#3a3153]/50 rounded-xl w-full max-w-md overflow-hidden"
            >
              <div className="border-b border-[#3a3153]/30 py-3 px-4 flex items-center justify-between">
                <h3 className="text-[#fefcfd] font-medium">Upload Files</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-[#b1aebb] hover:text-[#fefcfd] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <AddFiles
                  assignmentId={assignmentId}
                  files={files}
                  setFiles={setFiles}
                  onClose={() => setShowModal(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
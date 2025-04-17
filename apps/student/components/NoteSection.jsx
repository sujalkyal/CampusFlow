import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, FileText, X, ExternalLink } from "lucide-react";

const NotesSection = ({ subjectId, THEME }) => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post("/api/subject/notes/getAllNotes", {
          subject_id: subjectId,
        });
        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (subjectId) fetchNotes();
  }, [subjectId]);

  const closePopup = () => setSelectedNote(null);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center mb-4">
        <BookOpen size={18} className="mr-2 text-[#5f43b2]" />
        <h2 className="text-lg font-semibold text-[#fefdfd]">
          Course Notes
        </h2>
      </div>

      {/* Notes Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              className="w-6 h-6 border-2 border-t-[#5f43b2] rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : notes.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {notes.map((note, i) => (
              <motion.div
                key={`note-${i}`}
                onClick={() => setSelectedNote(note)}
                className="rounded-lg overflow-hidden cursor-pointer bg-[#3a3153]/50 hover:bg-[#3a3153] transition-colors p-3 border-l-4 border-[#5f43b2]"
                transition={{ type: "spring", stiffness: 500 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-[#fefdfd] font-medium text-sm">
                      {note.title || "Untitled Note"}
                    </h3>
                    {note.description && (
                      <p className="text-xs text-[#b1aebb] line-clamp-1 mt-1">
                        {note.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <div className="bg-[#5f43b2]/20 p-1 rounded-full">
                      <FileText className="w-3.5 h-3.5 text-[#fefdfd]" />
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-[#5f43b2] flex items-center">
                  <span>View materials</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <BookOpen className="w-10 h-10 text-[#3a3153] mb-2" />
            <p className="text-[#b1aebb] text-sm">No notes available</p>
          </motion.div>
        )}
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={closePopup}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#2a2a3f] rounded-xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto relative border border-[#5f43b2]/30 shadow-xl custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 bg-[#3a3153]/60 hover:bg-[#5f43b2] p-1.5 rounded-full transition-colors hover:cursor-pointer"
              >
                <X size={16} className="text-[#fefdfd]" />
              </button>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2 text-[#fefdfd]">
                  {selectedNote.title || "Untitled Note"}
                </h3>
                {selectedNote.description && (
                  <p className="text-sm text-[#b1aebb]">
                    {selectedNote.description}
                  </p>
                )}
              </div>
              
              {selectedNote.files?.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {selectedNote.files?.map((fileUrl, idx) => (
                    <motion.a
                      key={idx}
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-[#3a3153]/30 hover:bg-[#3a3153]/50 border border-[#5f43b2]/20"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="aspect-video w-full relative bg-black/20">
                        <img
                          src={fileUrl}
                          alt={`file-${idx}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-start p-3">
                          <span className="text-xs text-[#fefdfd]">View full size</span>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#b1aebb]">No files attached to this note</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotesSection;

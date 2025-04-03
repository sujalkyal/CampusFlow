// a pop up window to view title , description and files in a notes in preview mode
import React, { useState, useEffect } from 'react';

const NotesViewPopUp = ({ note, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [noteDetails, setNoteDetails] = useState(null);

  useEffect(() => {
    if (note) {
      setNoteDetails(note);
    }
  }, [note]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  if (!isOpen || !noteDetails) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{noteDetails.title}</h2>
        <p className="text-gray-700 mb-4">{noteDetails.description}</p>
        <div className="mb-4">
          {noteDetails.files && noteDetails.files.length > 0 ? (
            noteDetails.files.map((file, index) => (
// code to display preview of files in the notes and option to add new files 
              <div key={index} className="mb-2">
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {file.name}
                </a>
              </div>
            ))
          ) : (
            <p>No files available for this note.</p>
          )}
        </div>
        <button onClick={handleClose} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Close
        </button>
      </div>
    </div>
  );
}

export default NotesViewPopUp;
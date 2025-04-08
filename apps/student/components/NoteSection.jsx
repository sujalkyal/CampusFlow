import React, { useEffect, useState } from "react";
import axios from "axios";

const NotesSection = ({ subjectId, THEME }) => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.post("/api/subject/notes/getAllNotes", {
          subject_id: subjectId,
        });
        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    if (subjectId) fetchNotes();
  }, [subjectId]);

  const closePopup = () => setSelectedNote(null);

  return (
    <div
      className="rounded-lg p-6 shadow-sm"
      style={{ backgroundColor: THEME.white }}
    >
      <h2 className="text-lg font-medium mb-6" style={{ color: THEME.primary }}>
        Notes
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {notes.map((note, i) => (
          <div
            key={`note-${i}`}
            onClick={() => setSelectedNote(note)}
            className="rounded-lg shadow-sm overflow-hidden cursor-pointer border p-4"
            style={{ backgroundColor: THEME.white }}
          >
            <div className="flex flex-col justify-between h-full">
              <div>
                <h3
                  className="text-md font-semibold mb-2"
                  style={{ color: THEME.primary }}
                >
                  {note.title || "Untitled Note"}
                </h3>
                {note.description && (
                  <p className="text-sm text-gray-600">{note.description}</p>
                )}
              </div>
              <div className="mt-4 text-sm text-blue-500">
                Click to view files →
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedNote && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closePopup}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closePopup}
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
            >
              &times;
            </button>
            <h3
              className="text-lg font-bold mb-2"
              style={{ color: THEME.primary }}
            >
              {selectedNote.title || "Untitled Note"}
            </h3>
            {selectedNote.description && (
              <p className="text-sm mb-4 text-gray-700">
                {selectedNote.description}
              </p>
            )}
            <div className="grid grid-cols-2 gap-4">
              {selectedNote.files?.map((fileUrl, idx) => (
                <a
                  key={idx}
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={fileUrl}
                    alt={`file-${idx}`}
                    className="w-full h-48 object-cover"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesSection;

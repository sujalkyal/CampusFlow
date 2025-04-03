import React, { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react'; // Importing icons
import { useEdgeStore } from '../app/lib/edgestore';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotesViewPopUp = ({ note, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [noteDetails, setNoteDetails] = useState(null);
  const [deleteFiles, setDeleteFiles] = useState([]);
  const { edgestore } = useEdgeStore();

  useEffect(() => {
    if (note) {
      setNoteDetails(note);
    }
  }, [note]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleDelete = async (fileUrl) => {
    try {
      setNoteDetails((prev) => ({
        ...prev,
        files: prev.files.filter((url) => url !== fileUrl),
      }));
      setDeleteFiles((prev) => [...prev, fileUrl]); // Add to delete notes
      toast.success('File deleted successfully!');
    } catch (error) {
      toast.error('Error deleting file');
      console.error('Error deleting file:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('noteDetails: ', noteDetails); // Log the note details before sending

      const response = await axios.post('/api/subject/notes/updateFiles', {
        note_id: noteDetails.id,
        files: noteDetails.files,
      });

      for (const fileUrl of deleteFiles) {
        await edgestore.publicFiles.delete({
          url: fileUrl,
        });
      }

      if (response.status !== 200) throw new Error('Failed to update note files');

      toast.success('Note updated successfully!');
      setIsOpen(false);
      onClose();
      window.location.reload(); // Reload the page to reflect changes
    } catch (error) {
      toast.error('Error updating note');
      console.error('Error updating note:', error);
    }
  };

  const handleFileUpload = async (files) => {
    if (!files) return;
    const newFiles = [];

    try {
      for (const file of files) {
        const res = await edgestore.publicFiles.upload({ file });
        newFiles.push(res.url); // Get the uploaded file URL
      }

      setNoteDetails((prev) => ({
        ...prev,
        files: [...prev.files, ...newFiles], // Append new file URLs to existing ones
      }));

      toast.success('Files uploaded successfully!');
      console.log('files: ', noteDetails.files); // Log the updated note details
    } catch (error) {
      toast.error('Error uploading file');
      console.error('Error uploading file:', error);
    }
  };

  if (!isOpen || !noteDetails) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <h2 className="text-xl font-semibold mb-4">{noteDetails.title}</h2>
        <p className="text-gray-700 mb-4">{noteDetails.description}</p>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Files:</h3>
          <div className="grid grid-cols-3 gap-2">
            {noteDetails.files && noteDetails.files.length > 0 ? (
              noteDetails.files.map((fileUrl, index) => {
                const fileName = decodeURIComponent(fileUrl.split('/').pop()); // Extract file name

                return (
                  <div key={index} className="relative bg-gray-100/20 p-2 rounded-lg flex items-center justify-between w-26">
                    {fileUrl.match(/\.(jpeg|jpg|png|gif)$/) ? (
                      <img
                        src={fileUrl}
                        alt={fileName}
                        className="w-16 h-16 object-cover rounded-md cursor-pointer"
                        onClick={() => window.open(fileUrl, '_blank')}
                      />
                    ) : fileUrl.endsWith('.pdf') ? (
                      <iframe
                        src={fileUrl}
                        className="w-16 h-16 border rounded-md cursor-pointer"
                        title={fileName}
                        onClick={() => window.open(fileUrl, '_blank')}
                      />
                    ) : (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {fileName}
                      </a>
                    )}
                    <button onClick={() => handleDelete(fileUrl)} className="absolute top-1 right-1 text-red-500 hover:text-red-700 hover:cursor-pointer">
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="col-span-3 text-gray-500">No files available.</p>
            )}

            {/* Add File Button (Skeleton Box) */}
            <label className="w-16 h-16 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md cursor-pointer hover:bg-gray-100 mt-2">
              <input
                type="file"
                className="hidden"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <Plus size={24} className="text-gray-500" />
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button 
            onClick={handleClose} 
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Close
          </button>

          <button 
            onClick={handleSubmit} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default NotesViewPopUp;

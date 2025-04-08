import React, { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEdgeStore } from '../../../teacher/app/lib/edgestore';

const FilesUploadModal = ({ assignmentId, files, setFiles, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [deleteFiles, setDeleteFiles] = useState([]);
  const { edgestore } = useEdgeStore();

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleDelete = (file) => {
    setFiles((prev) => prev.filter((f) => f !== file));
    setDeleteFiles((prev) => [...prev, file]);
    toast.success('File removed!');
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/api/session/assignment/updateFiles', {
        assignment_id: assignmentId,
        files,
      });

      for (const file of deleteFiles) {
        await edgestore.publicFiles.delete({ url: file.url });
      }

      toast.success('Files updated successfully!');
      handleClose();
    } catch (error) {
      toast.error('Failed to update files');
      console.error('Error:', error);
    }
  };

  const handleFileUpload = async (files) => {
    if (!files) return;

    try {
      const uploadedFiles = [];

      for (const file of files) {
        const res = await edgestore.publicFiles.upload({ file });
        uploadedFiles.push(res.url);
      }

      setFiles((prev) => [...prev, ...uploadedFiles]);
      toast.success('Files uploaded successfully!');
    } catch (error) {
      toast.error('Error uploading file');
      console.error('Upload error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <h2 className="text-xl font-semibold mb-4">Upload Files</h2>

        <div className="mb-4">
          <div className="grid grid-cols-3 gap-2">
            {files.length > 0 ? (
              files.map((file, index) => {
                return (
                  <div key={index} className="relative bg-gray-100/20 p-2 rounded-lg flex items-center justify-between w-26">
                    {/\.(jpeg|jpg|png|gif)$/.test(file) ? (
                      <img
                        src={file}
                        alt={file}
                        className="w-16 h-16 object-cover rounded-md cursor-pointer"
                        onClick={() => window.open(file, '_blank')}
                      />
                    ) : file.endsWith('.pdf') ? (
                      <iframe
                        src={file}
                        className="w-16 h-16 border rounded-md cursor-pointer"
                        title={'PDF File'}
                        onClick={() => window.open(file, '_blank')}
                      />
                    ) : (
                      <a
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm"
                      >
                      </a>
                    )}
                    <button onClick={() => handleDelete(file)} className="absolute top-1 right-1 text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="col-span-3 text-gray-500">No files selected.</p>
            )}

            {/* Add File Button */}
            <label className="w-16 h-16 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md cursor-pointer hover:bg-gray-100 mt-2">
              <input
                type="file"
                className="hidden"
                multiple
                onChange={e => handleFileUpload(e.target.files)}
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

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default FilesUploadModal;

import { useState } from "react";
import { Plus } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEdgeStore } from "../app/lib/edgestore"; // Import EdgeStore hook

const AddNoteCard = ({ assignment_id, onCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrls, setFileUrls] = useState([]); // Store uploaded file URLs
  const [showPopup, setShowPopup] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { edgestore } = useEdgeStore();
  const publicFiles = edgestore.publicFiles;


  console.log("useEdgeStore():", useEdgeStore());
  console.log("publicFiles:", publicFiles);


  const handleFileUpload = async (files) => {
    setUploading(true);
    try {
      const uploadedUrls = await Promise.all(
        [...files].map(async (file) => {
            console.log("Uploading file:", file); // Log the file being uploaded
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
      await axios.post("/api/session/assignment/addFiles", {
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
            <h2 className="text-lg font-medium mb-4 text-primary">Add New Note</h2>
            <input
              type="text"
              placeholder="Title (Optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full mb-4 focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <textarea
              placeholder="Description (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full mb-4 focus:ring-2 focus:ring-primary focus:outline-none"
            ></textarea>
            <input
              type="file"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              className="border border-gray-300 p-2 rounded w-full mb-4 focus:ring-2 focus:ring-primary focus:outline-none"
              disabled={uploading}
            />
            {uploading && <p className="text-sm text-gray-500">Uploading files...</p>}
            <ul className="text-sm text-gray-600 mt-2">
              {fileUrls.map((url, index) => (
                <li key={index} className="truncate">{url}</li>
              ))}
            </ul>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleClosePopup}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition w-24 hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNote}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition w-36 hover:cursor-pointer"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Add Note"}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AddNoteCard;

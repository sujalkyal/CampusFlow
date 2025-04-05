'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation'; // For dynamic route param
import AddFiles from './AddFiles'; // Assuming this is the correct path to your AddFiles component

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
        const urls = res.data.files || [];
  
        // Convert string URLs into file objects
        const formattedFiles = urls.map(url => ({
          url,
          name: null,
          size: 'Unknown size' // unless you're storing the file size elsewhere
        }));
  
        setFiles(formattedFiles);
      } catch (err) {
        console.error('Error fetching files:', err);
      }
    };
  
    if (assignmentId) fetchFiles();
  }, [assignmentId]);
  

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-[#2F3C7E] mb-4">Files</h2>

      <div className="space-y-4">
        {files.map((file, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
              <div>

              </div>
            </div>
          </div>
        ))}

        {/* Upload File Button */}
        <div
          onClick={() => setShowModal(true)}
          className="cursor-pointer border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-50"
        >
          <button className="text-[#2F3C7E]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
          <p className="mt-2 text-sm text-gray-600">Upload File</p>
        </div>


        {/* Upload File Modal */}
      {showModal && (
        <AddFiles
          assignmentId={assignmentId}
          files={files}
          setFiles={setFiles}
          onClose={() => setShowModal(false)}
        />
      )}
      </div>
    </div>
  );
}

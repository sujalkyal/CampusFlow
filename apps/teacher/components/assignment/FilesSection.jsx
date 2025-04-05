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
  
        setFiles(res.data.files);
        console.log("the files are : ", files);
      } catch (err) {
        console.error('Error fetching files:', err);
      }
    };
  
    if (assignmentId) fetchFiles();
  }, [assignmentId]);

  console.log("the files are : ", files);
  

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-[#2F3C7E] mb-4">Files</h2>
  
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {files.length > 0 ? (
        files.map((file, idx) => (
          <div
            key={idx}
            className="relative border border-gray-200 rounded-lg p-2 bg-gray-50 shadow hover:shadow-md transition"
          >
            {file?.match(/\.(jpeg|jpg|png|gif)$/i) ? (
              <img
                src={file}
                alt={'Uploaded file'}
                className="w-full h-32 object-cover rounded-md cursor-pointer"
                onClick={() => window.open(file, '_blank')}
              />
            ) : file?.endsWith('.pdf') ? (
              <iframe
                src={file}
                className="w-full h-32 border rounded-md cursor-pointer"
                title={'PDF File'}
                onClick={() => window.open(file, '_blank')}
              />
            ) : (
              <a
                href={file}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-500 hover:underline truncate"
              >
                {decodeURIComponent(file.split('/').pop())}
              </a>
            )}
            <p className="mt-2 text-xs text-gray-600 break-words text-center">
              {decodeURIComponent(file.split('/').pop())}
            </p>
          </div>
        ))
      
        ) : (
          <div className="col-span-2 sm:col-span-3 md:col-span-4 text-center text-gray-500">
            No files uploaded yet.
            </div>
            )}
            
  
        {/* Upload File Button */}
        <div
          onClick={() => setShowModal(true)}
          className="cursor-pointer border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-100 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#2F3C7E]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <p className="mt-2 text-sm text-[#2F3C7E]">Upload File</p>
        </div>
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
  );
}  
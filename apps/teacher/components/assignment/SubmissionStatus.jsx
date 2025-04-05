// components/assignment/SubmissionStatus.js
export default function SubmissionStatus() {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-[#2F3C7E] mb-4">Submission Status</h2>
        
        <div className="flex justify-center my-6">
          <div className="relative w-36 h-36">
            {/* Donut chart using SVG */}
            <svg className="w-full h-full" viewBox="0 0 36 36">
              {/* Background circle */}
              <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#f3f4f6" strokeWidth="3"></circle>
              
              {/* Green progress (60%) */}
              <circle 
                cx="18" 
                cy="18" 
                r="15.91549430918954" 
                fill="transparent" 
                stroke="#22c55e" 
                strokeWidth="3"
                strokeDasharray="60, 100"
                strokeDashoffset="25"
                transform="rotate(-90 18 18)"
              ></circle>
              
              {/* Red progress (40%) */}
              <circle 
                cx="18" 
                cy="18" 
                r="15.91549430918954" 
                fill="transparent" 
                stroke="#ef4444" 
                strokeWidth="3"
                strokeDasharray="40, 100"
                strokeDashoffset="-35"
                transform="rotate(-90 18 18)"
              ></circle>
            </svg>
          </div>
        </div>
        
        <div className="flex justify-center space-x-10">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            <span className="text-sm text-gray-600">Submitted (3)</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            <span className="text-sm text-gray-600">Not Submitted (2)</span>
          </div>
        </div>
      </div>
    );
  }
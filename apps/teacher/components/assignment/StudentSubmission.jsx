// components/assignment/StudentSubmissions.js
export default function StudentSubmission() {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-[#2F3C7E] mb-4">Student Submissions</h2>
        
        <div className="grid grid-cols-2 gap-2">
          {/* Submitted Tab */}
          <div>
            <h3 className="font-medium text-green-500 mb-3">Submitted</h3>
            <div className="space-y-3">
              {/* Student 1 */}
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden mr-2">
                  <img src="/api/placeholder/32/32" alt="John Doe" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-500">2024-03-15 14:30</p>
                </div>
              </div>
              
              {/* Student 2 */}
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden mr-2">
                  <img src="/api/placeholder/32/32" alt="Jane Smith" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium">Jane Smith</p>
                  <p className="text-xs text-gray-500">2024-03-15 15:45</p>
                </div>
              </div>
              
              {/* Student 3 */}
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden mr-2">
                  <img src="/api/placeholder/32/32" alt="Sarah Wilson" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium">Sarah Wilson</p>
                  <p className="text-xs text-gray-500">2024-03-15 16:20</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Not Submitted Tab */}
          <div>
            <h3 className="font-medium text-red-500 mb-3">Not Submitted</h3>
            <div className="space-y-3">
              {/* Student 4 */}
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden mr-2">
                  <img src="/api/placeholder/32/32" alt="Mike Johnson" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium">Mike Johnson</p>
                </div>
              </div>
              
              {/* Student 5 */}
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden mr-2">
                  <img src="/api/placeholder/32/32" alt="Tom Brown" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium">Tom Brown</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
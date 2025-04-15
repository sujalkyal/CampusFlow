import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, CalendarClock } from 'lucide-react';

const UpcomingSessions = ({ subjectId, THEME }) => {
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post('/api/session/getUpcomingSessions', {
          subject_id: subjectId
        });
        setUpcomingClasses(response.data);
      } catch (error) {
        console.error('Error fetching upcoming sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (subjectId) fetchSessions();
  }, [subjectId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No Date';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center mb-4">
        <Calendar size={18} className="mr-2 text-[#5f43b2]" />
        <h2 className="text-lg font-semibold text-[#fefdfd]">
          Upcoming Classes
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            <motion.div
              className="w-6 h-6 border-2 border-t-[#5f43b2] rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : upcomingClasses.length > 0 ? (
          <div className="space-y-3">
            {upcomingClasses.map((session, i) => (
              <motion.div
                key={`upcoming-${i}`}
                className="bg-[#3a3153]/40 rounded-lg p-3 hover:bg-[#3a3153]/60 transition-all duration-200"
                whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-[#fefdfd] mb-1">{session.title || 'Untitled Session'}</h3>
                    <div className="flex items-center text-xs text-[#b1aebb]">
                      <CalendarClock size={12} className="mr-1" />
                      <span>{formatDate(session.date)}</span>
                    </div>
                  </div>
                  <motion.div
                    className="bg-[#5f43b2]/20 py-1 px-2 rounded-full flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Clock size={12} className="mr-1 text-[#fefdfd]" />
                    <span className="text-xs text-[#fefdfd]">Upcoming</span>
                  </motion.div>
                </div>
                {session.description && (
                  <p className="text-xs text-[#b1aebb] mt-2 line-clamp-2">{session.description}</p>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-24 text-center"
          >
            <Calendar className="w-10 h-10 text-[#3a3153] mb-2" />
            <p className="text-[#b1aebb] text-sm">No upcoming classes scheduled</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UpcomingSessions;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UpcomingSessions = ({ subjectId, THEME }) => {
  const [upcomingClasses, setUpcomingClasses] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.post('/api/session/getUpcomingSessions', {
          subject_id: subjectId
        });
        setUpcomingClasses(response.data);
      } catch (error) {
        console.error('Error fetching upcoming sessions:', error);
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
    <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: THEME.white }}>
      <h3 className="text-lg font-medium mb-6" style={{ color: THEME.primary }}>Upcoming Classes</h3>
      <div className="overflow-hidden rounded-lg border" style={{ borderColor: THEME.secondary }}>
        <div className="grid grid-cols-2 p-4" style={{ backgroundColor: THEME.secondary }}>
          <div className="text-sm font-medium" style={{ color: THEME.primary }}>TITLE</div>
          <div className="text-sm font-medium" style={{ color: THEME.primary }}>DATE</div>
        </div>
        {upcomingClasses.map((session, i) => (
          <div
            key={`upcoming-${i}`}
            className="grid grid-cols-2 p-4 border-t"
            style={{ borderColor: THEME.secondary }}
          >
            <div className="text-sm" style={{ color: THEME.primary }}>
              {session.title || 'No Title'}
            </div>
            <div className="text-sm text-gray-600">
                {formatDate(session.date)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingSessions;

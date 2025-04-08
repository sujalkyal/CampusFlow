import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PreviousClasses = ({ subjectId, THEME }) => {
  const [previousClasses, setPreviousClasses] = useState([]);

  useEffect(() => {
    const fetchPreviousClasses = async () => {
      try {
        const response = await axios.post('/api/session/getPreviousSessions', {
          subject_id: subjectId,
        });
        setPreviousClasses(response.data);
      } catch (error) {
        console.error('Error fetching previous classes:', error);
      }
    };

    if (subjectId) fetchPreviousClasses();
  }, [subjectId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No Date';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: THEME.white }}>
      <h3 className="text-lg font-medium mb-6" style={{ color: THEME.primary }}>Previous Classes</h3>
      <div className="overflow-hidden rounded-lg border" style={{ borderColor: THEME.secondary }}>
        <div className="grid grid-cols-3 p-4" style={{ backgroundColor: THEME.secondary }}>
          <div className="text-sm font-medium" style={{ color: THEME.primary }}>TITLE</div>
          <div className="text-sm font-medium" style={{ color: THEME.primary }}>DATE</div>
          <div className="text-sm font-medium" style={{ color: THEME.primary }}>ACTION</div>
        </div>
        {previousClasses.map((session, i) => (
          <div
            key={`previous-${i}`}
            className="grid grid-cols-3 p-4 border-t"
            style={{ borderColor: THEME.secondary }}
          >
            <div className="text-sm" style={{ color: THEME.primary }}>
              {session.title || 'No Title'}
            </div>
            <div className="text-sm text-gray-600">
              {formatDate(session.date)}
            </div>
            <div>
              {session.assignment_id ? (
                <a
                  href={`session/${session.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    className="text-xs py-1 px-3 rounded"
                    style={{ backgroundColor: THEME.primary, color: THEME.white }}
                  >
                    Assignment
                  </button>
                </a>
              ) : (
                <div className="text-xs text-gray-400">—</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviousClasses;

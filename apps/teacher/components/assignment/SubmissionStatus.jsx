'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function SubmissionStatus() {
  const params = useParams();
  const assignmentId = params?.id;

  const [submittedCount, setSubmittedCount] = useState(0);
  const [notSubmittedCount, setNotSubmittedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!assignmentId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const resSubmitted = await axios.post('/api/session/assignment/getSubmissionDetails', {
          assignment_id: assignmentId,
        });

        const resAll = await axios.post('/api/session/assignment/getAllStudents', {
          assignment_id: assignmentId,
        });

        const submitted = resSubmitted.data || [];
        const all = resAll.data || [];

        setSubmittedCount(submitted.length);
        setNotSubmittedCount(all.length - submitted.length);
      } catch (err) {
        console.error('Error fetching submission status:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [assignmentId]);

  const total = submittedCount + notSubmittedCount;
  const submittedPercent = total > 0 ? (submittedCount / total) * 100 : 0;
  const notSubmittedPercent = 100 - submittedPercent;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  // Animate chart on load
  const chartVariants = {
    hidden: { 
      strokeDasharray: "0, 100",
      opacity: 0 
    },
    visible: (i) => ({
      strokeDasharray: `${i}, 100`,
      opacity: 1,
      transition: { 
        duration: 1.5,
        ease: "easeOut",
        delay: 0.3
      }
    })
  };

  // Pulse animation for counts
  const pulseVariants = {
    pulse: {
      scale: [1, 1.03, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-[#010101] rounded-xl border border-[#3a3153]/30 p-6 text-[#fefcfd]"
    >
      <motion.div variants={itemVariants} className="flex items-center mb-6">
        <h2 className="text-xl font-medium text-[#fefcfd]">Submission Status</h2>
        <div className="h-0.5 w-12 bg-[#5f43b2] ml-4 rounded-full"></div>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="flex justify-center my-6 relative"
      >
        {isLoading ? (
          <div className="w-40 h-40 flex items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-t-2 border-[#5f43b2] rounded-full"
            />
          </div>
        ) : (
          <div className="relative w-40 h-40">
            {/* Background circle */}
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="transparent"
                stroke="#3a3153"
                strokeWidth="3"
              />
              
              {/* Submitted circle */}
              <motion.circle
                cx="18"
                cy="18"
                r="15.915"
                fill="transparent"
                stroke="#5f43b2"
                strokeWidth="3"
                custom={submittedPercent}
                variants={chartVariants}
                transform="rotate(-90 18 18)"
              />
              
              {/* Not submitted circle */}
              <motion.circle
                cx="18"
                cy="18"
                r="15.915"
                fill="transparent"
                stroke="#b1aebb"
                strokeWidth="3"
                custom={notSubmittedPercent}
                variants={chartVariants}
                strokeDashoffset={`-${submittedPercent}`}
                transform="rotate(-90 18 18)"
              />
            </svg>
            
            {/* Center count */}
            <motion.div 
              variants={pulseVariants}
              animate="pulse"
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <span className="text-3xl font-semibold text-[#5f43b2]">{submittedCount}</span>
              <span className="text-xs text-[#b1aebb]">of {total}</span>
            </motion.div>
          </div>
        )}
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="flex justify-center space-x-10"
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-[#3a3153]/30 px-4 py-3 rounded-lg"
        >
          <div className="flex items-center">
            <span className="w-3 h-3 bg-[#5f43b2] rounded-full mr-2"></span>
            <span className="text-sm text-[#fefcfd]">Submitted</span>
          </div>
          <div className="text-center mt-1">
            <span className="text-xl font-medium text-[#5f43b2]">{submittedCount}</span>
            <span className="text-xs text-[#b1aebb] ml-1">({Math.round(submittedPercent)}%)</span>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-[#3a3153]/30 px-4 py-3 rounded-lg"
        >
          <div className="flex items-center">
            <span className="w-3 h-3 bg-[#b1aebb] rounded-full mr-2"></span>
            <span className="text-sm text-[#fefcfd]">Not Submitted</span>
          </div>
          <div className="text-center mt-1">
            <span className="text-xl font-medium text-[#b1aebb]">{notSubmittedCount}</span>
            <span className="text-xs text-[#b1aebb] ml-1">({Math.round(notSubmittedPercent)}%)</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
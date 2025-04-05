// pages/assignment.js
import Head from 'next/head';
import AssignmentDetails from '../../../../../../components/assignment/AssignmentDetails';
import FilesSection from '../../../../../../components/assignment/FilesSection';
import SubmissionStatus from '../../../../../../components/assignment/SubmissionStatus';
import StudentSubmissions from '../../../../../../components/assignment/StudentSubmission';

export default function AssignmentPage() {
  return (
    <div className="min-h-screen bg-[#FBEAEB]">
      <Head>
        <title>Assignment Management</title>
      </Head>
      
      <main className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#2F3C7E]">Assignment</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AssignmentDetails />
          <FilesSection />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <SubmissionStatus />
          <StudentSubmissions />
        </div>
      </main>
    </div>
  );
}
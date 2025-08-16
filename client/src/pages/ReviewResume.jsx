import { FileText, Sparkles, Copy } from 'lucide-react';
import React, { useState } from 'react'
import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  /*
    ReviewResume component provides an AI-powered resume analysis and feedback tool.
    LOGIC EXPLANATION:
    - Uses useState to manage the uploaded PDF resume file (input state stores the File object)
    - Restricts file uploads to PDF format only using accept="application/pdf" 
    - onSubmitHandler would send the PDF to AI service for comprehensive resume analysis
    - Left side contains PDF upload form with validation and submit button
    - Right side shows placeholder for analysis results (would display feedback, suggestions, scores)
    - Results area has max height constraint (max-h-[600px]) to handle potentially long analysis
    - In production, would extract text from PDF and analyze formatting, content, keywords, etc.
    - Different from other tools as it processes document content rather than images
  */

  // State to store the uploaded PDF resume file (File object from file input)
  const [input, setInput] = useState("");

   // State to manage loading state (shows spinner when analyzing resume)
  const [loading, setLoading] = useState(false);
  // State to store the AI-generated resume analysis and feedback
  const [content, setContent] = useState("");

  // Clerk hook to get authentication token for API requests
  const { getToken } = useAuth();
  
  // Copy analysis results to clipboard
  const copyToClipboard = () => {
    if (content) {
      navigator.clipboard.writeText(content).then(() => {
        toast.success('Analysis copied to clipboard!');
      }).catch(() => {
        toast.error('Failed to copy analysis');
      });
    }
  };
  
  // Form submission handler - processes the uploaded PDF resume for AI analysis
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); // Show loading spinner

      // Create FormData object and append uploaded resume file
      const formData = new FormData()
      formData.append('resume', input) 
       
      // Make API call to backend to analyze resume using AI
      const { data } = await axios.post(
        "/api/ai/resume-review",
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`, // Include auth token for protected route
          },
        }
      );

      // Handle API response
      if (data.success) {
        setContent(data.content); // Store the AI-generated resume analysis
      } else {
        toast.error(data.message); // Show error message if analysis failed
      }
    } catch (error) {
      toast.error(error.message); // Show error message if API call failed

    }
    setLoading(false); // Hide loading spinner after processing
  };
  
  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left column: PDF upload form for resume analysis */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 "
      >
        {/* Form header with sparkles icon and title */}
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#00DA83]" />
          <h1 className="text-xl font-semibold">Resume Review</h1>
        </div>
        
        {/* PDF upload section - specifically restricted to PDF files */}
        <p className="mt-6 text-sm font-medium">Upload Resume</p>
        <input
          onChange={(e) => setInput(e.target.files[0])} // Gets first selected file and stores in state
          type="file"
          accept="application/pdf" // Restricts file picker to PDF files only (not images like other tools)
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required // HTML validation - form won't submit without file selection
        />

        {/* Helper text emphasizing PDF-only support */}
        <p className="text-xs text-gray-500 font-light mt-1">Supports PDF resumes only</p>

        {/* Submit button with gradient background and document icon */}
        <button disabled={loading} className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer">
          {
            loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> 
            :
            <FileText className="w-5" />

          }
          Review Resume
        </button>
      </form>

      {/* Right column: Analysis results display area with height constraints */}
      <div className="w-full max-w-xl p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-[600px] max-h-[600px]">
        {/* Results section header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[#00DA83]" />
            <h1 className="text-xl font-semibold">Analysis Results</h1>
          </div>
          {content && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 text-xs rounded-md hover:bg-green-100 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy Analysis
            </button>
          )}
        </div>

        {/* 
          Results container: uses flex-1 to take remaining space and centers content
          Has max-h-[600px] constraint because resume analysis can be lengthy
          In production, this would conditionally render:
          - Loading spinner while AI processes the PDF and extracts text
          - Comprehensive analysis results including:
            * Overall resume score/rating
            * Section-by-section feedback (contact info, summary, experience, education, skills)
            * Keyword optimization suggestions for ATS systems
            * Formatting and structure recommendations
            * Industry-specific advice based on job roles mentioned
            * Grammar and language improvement suggestions
          - Scrollable content area for long analysis reports
          - Download option for analysis report
          - Error message if PDF can't be processed or is corrupted
          - Empty state (current) when no analysis has been performed
        */}
        {
          !content ? 
          (
            <div className="flex-1 flex justify-center items-center">
          {/* Empty state: shows placeholder when no resume analysis has been performed yet */}
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <FileText className="w-9 h-9 " />
            <p>Upload a resume and click "Review Resume" to get started</p>
          </div>
        </div>
          ) 
          :
          (
            <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-600'>
              <div className='reset-tw'>
                <Markdown>{content}</Markdown>
              </div>
            </div>
          )
        }
        
      </div>
    </div>
  )
}

export default ReviewResume 
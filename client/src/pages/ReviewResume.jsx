import { FileText, Sparkles } from 'lucide-react';
import React, { useState } from 'react'

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
  
  // Form submission handler - processes the uploaded PDF resume for AI analysis
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // In production: would send PDF file to resume analysis API
    // Example: const formData = new FormData(); formData.append('resume', input);
    // const response = await fetch('/api/review-resume', { method: 'POST', body: formData })
    // API would extract text, analyze structure, check for keywords, formatting, etc.
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
        <button className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer">
          <FileText className="w-5" />
          Review Resume
        </button>
      </form>

      {/* Right column: Analysis results display area with height constraints */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        {/* Results section header */}
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#00DA83]" />
          <h1 className="text-xl font-semibold">Analysis Results</h1>
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
        <div className="flex-1 flex justify-center items-center">
          {/* Empty state: shows placeholder when no resume analysis has been performed yet */}
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <FileText className="w-9 h-9 " />
            <p>Upload a resume and click "Review Resume" to get started</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewResume 
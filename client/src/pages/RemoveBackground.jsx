import { Eraser, Sparkles, Download } from "lucide-react";
import React from "react";
import { useState } from "react";
import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";
import toast from 'react-hot-toast';


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  /*
    RemoveBackground component provides an AI-powered background removal tool for uploaded images.
    LOGIC EXPLANATION:
    - Uses useState to manage the uploaded image file (input state stores the File object)
    - File input accepts various image formats (JPG, PNG, etc.) specified by accept="image/*"
    - onSubmitHandler prevents default form submission and would process the uploaded image
    - Left side contains file upload form with validation and submit button
    - Right side shows placeholder for processed image (would display result after background removal)
    - Form uses controlled component pattern where input state manages the selected file
    - In production, would send image to AI service API and display processed result
  */

  // State to store the uploaded image file (File object from file input)
  const [input, setInput] = useState("");

  // State to manage loading state (shows spinner when processing image)
  const [loading, setLoading] = useState(false);
  // State to store the processed image URL/content from the AI
  const [content, setContent] = useState("");

  // Clerk hook to get authentication token for API requests
  const { getToken } = useAuth();

  // Download processed image function
  const downloadImage = async () => {
    if (content) {
      try {
        const response = await fetch(content);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'background-removed-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success('Image downloaded successfully!');
      } catch (error) {
        toast.error('Failed to download image');
      }
    }
  };

  // Form submission handler - processes the uploaded image for background removal
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
       setLoading(true); // Show loading spinner

      // Create FormData object and append uploaded image file
      const formData = new FormData()
      formData.append('image', input) 
       
      // Make API call to backend to remove image background using AI
      const { data } = await axios.post(
        "/api/ai/remove-image-background",
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`, // Include auth token for protected route
          },
        }
      );

      // Handle API response
      if (data.success) {
        setContent(data.content); // Store the processed image URL/content
      } else {
        toast.error(data.message); // Show error message if processing failed
      }
    } catch (error) {
      
      toast.error(error.message); // Show error message if API call failed
    }
    setLoading(false); // Hide loading spinner after processing
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left column: File upload form for background removal */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 "
      >
        {/* Form header with sparkles icon and title */}
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Background Remover</h1>
        </div>
        
        {/* File upload section */}
        <p className="mt-6 text-sm font-medium">Upload Image</p>
        <input
          onChange={(e) => setInput(e.target.files[0])} // Gets first selected file and stores in state
          type="file"
          accept="image/*" // Restricts file picker to image formats only
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required // HTML validation - form won't submit without file selection
        />

        {/* Helper text showing supported file formats */}
        <p className="text-xs text-gray-500 font-light mt-1">Supports: JPG, PNG, and other image formats</p>

        {/* Submit button with gradient background and eraser icon */}
        <button disabled={loading} className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer">
          {
            loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
            : <Eraser className="w-5" />
          }
          Remove Background
        </button>
      </form>

      {/* Right column: Results display area for processed image */}
      <div className="w-full max-w-xl p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-[28rem] ">
        {/* Results section header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eraser className="w-5 h-5 text-[#FF4938]" />
            <h1 className="text-xl font-semibold">Processed Image</h1>
          </div>
          {content && (
            <button
              onClick={downloadImage}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 text-xs rounded-md hover:bg-red-100 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          )}
        </div>

        {/* 
          Results container: uses flex-1 to take remaining space and centers content
          In production, this would conditionally render:
          - Loading spinner while processing the image
          - Processed image with transparent background when complete
          - Download button for the processed image
          - Error message if processing fails
          - Empty state (current) when no processing has been attempted
        */}

        {
          !content ? 
          (
            <div className="flex-1 flex justify-center items-center">
              {/* Empty state: shows placeholder when no image has been processed yet */}
              <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
                <Eraser className="w-9 h-9 " />
                <p>Upload an image and click "Remove Background" to get started</p>
              </div>
            </div>
          ) :
          <img src={content} alt="image" className="mt-3 w-full h-full"/>
        }
      </div>
    </div>
  );
};

export default RemoveBackground;

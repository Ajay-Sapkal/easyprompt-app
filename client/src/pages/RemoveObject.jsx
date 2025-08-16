import { Scissors, Sparkles, Download } from 'lucide-react';
import React from 'react';
import { useState } from 'react'
import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const RemoveObject = () => {
  /*
    RemoveObject component provides an AI-powered tool to selectively remove specific objects from uploaded images.
    LOGIC EXPLANATION:
    - Uses two useState hooks to manage form data:
      * input: stores the uploaded image file (File object from file input)
      * object: stores the text description of what object the user wants to remove
    - Combines image upload with text-based object identification for precise removal
    - onSubmitHandler would send both the image and object description to AI service
    - Left side contains dual input form (file upload + object description)
    - Right side shows placeholder for processed image with the specified object removed
    - More complex than background removal as it requires AI to identify and remove specific objects
    - Uses controlled components pattern for both file and text inputs
  */

  // State to store the uploaded image file (File object from file input)
  const [input, setInput] = useState("");
  // State to store the description of the object to be removed from the image
  const [object, setObject] = useState("");

   // State to manage loading state (shows spinner when generating images)
  const [loading, setLoading] = useState(false);
  // State to store the generated image URL from the AI
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
        link.download = 'object-removed-image.png';
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

  // Form submission handler - processes the image to remove the specified object
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
       setLoading(true); // Show loading spinner

       if(object.split(' ').length > 1){
        setLoading(false);
        return toast.error("Please enter only one object name to remove");
       }

      // Create FormData object and append uploaded image file
      const formData = new FormData()
      formData.append('image', input) 
      formData.append('object', object) 

      // Make API call to backend to remove image object using AI
      const { data } = await axios.post(
        "/api/ai/remove-image-object",
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
      {/* Left column: Dual input form for image upload and object description */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 "
      >
        {/* Form header with sparkles icon and title */}
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Object Removal</h1>
        </div>

        {/* File upload section - first input for selecting the image */}
        <p className="mt-6 text-sm font-medium">Upload Image</p>
        <input
          onChange={(e) => setInput(e.target.files[0])} // Gets first selected file and stores in input state
          type="file"
          accept="image/*" // Restricts file picker to image formats only
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required // HTML validation - form won't submit without file selection
        />

        {/* Object description section - second input for specifying what to remove */}
        <p className="mt-6 text-sm font-medium">Describe object name to remove</p>
        <textarea
          onChange={(e) => setObject(e.target.value)} // Updates object state as user types
          value={object} // Controlled component - value comes from object state
          rows={4}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="e.g., watch or spoon, Only single object name" // Guides user to be specific
          required // HTML validation - form won't submit if empty
        />

        {/* Submit button with gradient background and scissors icon */}
        <button disabled={loading} className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer">
          {
            loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <Scissors className="w-5" />
          }
          Remove Object
        </button>
      </form>

      {/* Right column: Results display area for processed image */}
      <div className="w-full max-w-xl p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-[28rem] max-h-[700px]">
        {/* Results section header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scissors className="w-5 h-5 text-[#4A7AFF]" />
            <h1 className="text-xl font-semibold">Processed Image</h1>
          </div>
          {content && (
            <button
              onClick={downloadImage}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs rounded-md hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          )}
        </div>

        {/* 
          Results container: uses flex-1 to take remaining space and centers content
          In production, this would conditionally render:
          - Loading spinner while AI processes the object removal
          - Processed image with the specified object removed and background intelligently filled
          - Download button for the processed image
          - Error message if AI can't identify or remove the specified object
          - Empty state (current) when no processing has been attempted
          Object removal is more complex than background removal as it requires:
          1. Object detection to locate the specified item
          2. Precise segmentation to isolate the object
          3. Intelligent inpainting to fill the removed area naturally
        */}

        {
          !content ?
          (
            <div className="flex-1 flex justify-center items-center">
              {/* Empty state: shows placeholder when no object removal has been processed yet */}
              <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
                <Scissors className="w-9 h-9 " />
                <p>Upload an image and click "Remove Object" to get started</p>
              </div>
            </div>
          ) 
          :
          (
            <img src={content} alt="img" className='mt-3 w-full h-full'/>
          )
        }
      </div>
    </div>
  )
}

export default RemoveObject 
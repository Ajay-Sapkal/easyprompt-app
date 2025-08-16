import { Image, Sparkles, Download } from 'lucide-react';
import React from 'react';
import { useState } from 'react'
import axios from "axios";
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const GenerateImages = () => {
  /*
    GenerateImages component provides an AI image generation interface with style selection and publishing options.
    LOGIC EXPLANATION:
    - Uses three useState hooks to manage form state:
      * selectedStyle: tracks which art style is currently selected from the imageStyle array
      * input: stores the user's text description for the image they want to generate
      * publish: boolean flag for whether to make the generated image public in community
    - imageStyle array contains predefined art styles that users can choose from
    - onSubmitHandler function prevents default form submission and would handle API call to generate image
    - Form includes textarea for description, clickable style tags, custom toggle switch, and submit button
    - Right side shows placeholder for generated images (would display actual results in production)
    - Uses conditional CSS classes for style selection highlighting and toggle switch animation
  */

  // Array of available art styles for image generation - users can select one of these styles
  const imageStyle = [
    "Realistic",
    "Ghibli style",
    "Anime style",
    "Cartoon style",
    "Fantasy style",
    "Realistic style",
    "3D style",
    "Portrait style",
  ];

  // State to track which art style is currently selected (defaults to "Realistic")
  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  // State to store the user's text description of the image they want to generate
  const [input, setInput] = useState("");
  // State to track whether user wants to publish the generated image publicly
  const [publish, setPublish] = useState(false);

  // State to manage loading state (shows spinner when generating images)
  const [loading, setLoading] = useState(false);
  // State to store the generated image URL from the AI
  const [content, setContent] = useState("");

    // Clerk hook to get authentication token for API requests
  const { getToken } = useAuth();

  // Download generated image function
  const downloadImage = async () => {
    if (content) {
      try {
        const response = await fetch(content);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'generated-image.png';
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

  // Form submission handler - generates AI image based on user inputs
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); // Show loading spinner

      // Create a detailed prompt for the AI with description and style context
      const prompt = `Generate an image of ${input} in the style ${selectedStyle}.`;

      // Make API call to backend to generate image using AI (ClipDrop API)
      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish }, // Send prompt and publish flag
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`, // Include auth token for protected route
          },
        }
      );

      // Handle API response
      if (data.success) {
        setContent(data.content); // Store the generated image URL
      } else {
        toast.error(data.message); // Show error message if generation failed
      }
    } catch (error) {
      toast.error(error.message); // Show error message if API call failed
    }
    setLoading(false); // Hide loading spinner after processing
  };
  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left column: Image generation form with input controls */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 "
      >
        {/* Form header with sparkles icon and title */}
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">AI Image Generator</h1>
        </div>
        
        {/* Image description input section */}
        <p className="mt-6 text-sm font-medium">Describe your image</p>
        <textarea
          onChange={(e) => setInput(e.target.value)} // Updates input state as user types
          value={input} // Controlled component - value comes from state
          rows={4}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="Describe what you want to see in the image..."
          required // HTML validation - form won't submit if empty
        />

        {/* Art style selection section */}
        <p className="mt-4 text-sm font-medium">Style</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {/* Maps through imageStyle array to create clickable style tags */}
          {imageStyle.map((item) => (
            <span
              onClick={() => setSelectedStyle(item)} // Updates selectedStyle state when clicked
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedStyle === item
                  ? "bg-green-50 text-green-700" // Active style: green background and text
                  : "text-gray-500 border-gray-300" // Inactive style: gray colors
              } `}
              key={item}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Custom toggle switch for public publishing option */}
        <div className='my-6 flex items-center gap-2'>
          <label className='relative cursor-pointer '>
            {/* Hidden checkbox input - screen reader accessible but visually hidden */}
            <input
              type="checkbox"
              checked={publish} // Controlled by publish state
              onChange={(e) => setPublish(e.target.checked)} // Updates publish state when toggled
              className="sr-only peer " // sr-only hides visually but keeps accessible
            />

            {/* Toggle switch background - changes color based on checked state using peer classes */}
            <div className='w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition'></div>

            {/* Toggle switch slider dot - moves right when checked using peer-checked:translate-x-4 */}
            <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4'></span>
          </label>
          <p className='text-sm'>Make this image public</p>
        </div>

        {/*  Submit button with loading state and conditional icon display  */}
        <button disabled={loading} className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer">
          {
            loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> 
            : <Image className="w-5" />
          }
          
          Generate Image
        </button>
      </form>

      {/* Right column: Results display area for generated images */}
      <div className="w-full max-w-xl p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-[28rem] ">
        {/* Results section header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image className="w-5 h-5 text-[#00AD25]" />
            <h1 className="text-xl font-semibold">Generated images</h1>
          </div>
          {content && (
            <button
              onClick={downloadImage}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 text-xs rounded-md hover:bg-green-100 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          )}
        </div>

        {/* 
          Results container: uses flex-1 to take remaining space and centers content
          In production, this would conditionally render either:
          - Loading spinner while generating
          - Generated image(s) when complete
          - Error message if generation fails
          - Empty state (current) when no generation has been attempted
        */}

        {/* Conditional rendering: shows placeholder or generated image  */}
        {
          !content ? (
            <div className="flex-1 flex justify-center items-center">
          {/* Empty state: shows placeholder when no images have been generated yet */}
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Image className="w-9 h-9 " />
            <p>Enter a topic and click "Generate Image" to get started</p>
          </div>
        </div>
          ) : (
            /* Generated image display with full width and height */
            <div className='mt-3 h-full'>
              <img src={content} alt="img" className='w-full h-full'/>
            </div>
          )
        }
        
      </div>
    </div>
  )
}

export default GenerateImages
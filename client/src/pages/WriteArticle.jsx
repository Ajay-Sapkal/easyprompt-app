import { Edit, Sparkles, Copy } from "lucide-react";
import React, { useState } from "react";
import  axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  /*
    WriteArticle component provides an AI-powered article generation tool with configurable length options.
    LOGIC EXPLANATION:
    - Uses two useState hooks to manage form configuration:
      * selectedLength: tracks which article length option is currently selected (defaults to first option)
      * input: stores the user's article topic/prompt text
    - articleLength array contains predefined length options with both display text and word count values
    - Length selection uses clickable tags that compare selectedLength.text for active state styling
    - onSubmitHandler would send both topic and selected length to AI service for article generation
    - Left side contains topic input and length selection interface
    - Right side shows placeholder for generated article with height constraints for long content
    - Different from other tools as it generates substantial text content rather than processing files
  */

  // Array of article length options with word count values and display text
  // Each object contains: length (word count for API), text (user-friendly display)
  const articleLength = [
    { length: 800, text: "Short (500-800 words)" },
    { length: 1200, text: "Medium (800-1200 words)" },
    { length: 1600, text: "Long (1200+ words)" },
  ];

  // State to track which article length option is currently selected (defaults to first option - Short)
  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  // State to store the user's article topic/prompt text
  const [input, setInput] = useState("");
 
  // State to manage loading state (shows spinner when generating article)
  const [loading, setLoading] = useState(false);

  // State to store the generated article content from the AI
  const [content, setContent] = useState("");

  // Clerk hook to get authentication token for API requests
  const { getToken } = useAuth();

  // Copy article to clipboard functionality
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Article copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy article");
    }
  };

  // Form submission handler - processes article generation with topic and length parameters
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true) // Show loading spinner
      
      // Create a clean user-friendly prompt for display in dashboard
      const userPrompt = `Write a ${selectedLength.length}-word article on the topic: ${input}`;
      
      // Create a detailed prompt for the AI with technical instructions
      const aiPrompt = `Write a ${selectedLength.length}-word article on the topic: ${input}. 

IMPORTANT: Start directly with the article content. Do not include any introductory phrases like "Here's an article" or "I'll write an article about". Begin immediately with the article title or first paragraph.

Format the article with proper markdown headings and structure for professional presentation.`;

      // Make API call to backend to generate article using AI
      const {data} = await axios.post(
        '/api/ai/generate-article',
        { 
          prompt: aiPrompt,           // Full prompt with AI instructions for generation
          userPrompt: userPrompt,     // Clean prompt for database storage and dashboard display
          length: selectedLength.length 
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`, // Include auth token for protected route
          },
        }
      );

      // Handle API response
      if (data.success) {
        setContent(data.content); // Store the generated article content
      }else{
        toast.error(data.message); // Show error message if generation failed
      }
    } catch (error) {
      toast.error(error.message); // Show error message if API call failed
    }
    setLoading(false); // Hide loading spinner
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left column: Article configuration form with topic input and length selection */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 "
      >
        {/* Form header with sparkles icon and title */}
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Article Configuration</h1>
        </div>
        
        {/* Article topic input section */}
        <p className="mt-6 text-sm font-medium">Article Topic</p>
        <input
          onChange={(e) => setInput(e.target.value)} // Updates input state as user types
          value={input} // Controlled component - value comes from state
          type="text"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="The future of AI is...." // Example prompt to guide user input
          required // HTML validation - form won't submit if empty
        />

        {/* Article length selection section */}
        <p className="mt-4 text-sm font-medium">Article Length</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {/* Maps through articleLength array to create clickable length option tags */}
          {articleLength.map((item, index) => (
            <span
              onClick={() => setSelectedLength(item)} // Updates selectedLength state when clicked
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedLength.text === item.text // Compares current selection with this option
                  ? "bg-blue-50 text-blue-700" // Active option: blue background and text
                  : "text-gray-500 border-gray-300" // Inactive option: gray colors
              } `}
              key={index}
            >
              {item.text} {/* Displays user-friendly text like "Short (500-800 words)" */}
            </span>
          ))}
        </div>
        <br />
        
         {/* Submit button with gradient background and loading state  */}
        <button disabled = {loading} className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer">
          {
            loading ? <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span> // Loading spinner
            : <Edit className="w-5" /> // Edit icon when not loading
          }
          Generate Article
        </button>
      </form>

      {/* Right column: Generated article display area with height constraints for long content */}
      <div className="w-full max-w-xl p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-[600px] max-h-[600px]">
        {/* Results section header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Edit className="w-5 h-5 text-[#4A7AFF]" />
            <h1 className="text-xl font-semibold">Generated Article</h1>
          </div>
          
          {/* Copy button - only show when content exists */}
          {content && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs rounded-md hover:bg-blue-100 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy Article
            </button>
          )}
        </div>

        {/* 
          Article content container: uses flex-1 to take remaining space and centers content
          Has max-h-[600px] constraint because articles can be very long (up to 1600+ words)
          In production, this would conditionally render:
          - Loading spinner with progress indicator while AI generates the article
          - Generated article content with proper formatting:
            * Title/headline
            * Introduction paragraph
            * Main body sections with subheadings
            * Conclusion paragraph
            * Proper paragraph breaks and formatting
          - Scrollable content area for long articles
          - Copy to clipboard functionality
          - Download as text/PDF options
          - Word count display showing actual vs requested length
          - Edit/regenerate options for specific sections
          - Error message if generation fails or topic is inappropriate
          - Empty state (current) when no article has been generated
        */}

        {!content ? (
        <div className="flex-1 flex justify-center items-center">
          {/* Empty state: shows placeholder when no article has been generated yet */}
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Edit className="w-9 h-9 " />
            <p>Enter a topic and click "Generate Article" to get started</p>
          </div>
        </div>

        ) : (
          /* Generated article display with markdown formatting and scrollable content */
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <div className="reset-tw">
              <Markdown>{content}</Markdown> {/* Renders markdown content with proper formatting */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteArticle;

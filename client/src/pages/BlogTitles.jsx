import { Hash, Sparkles, Copy } from "lucide-react";
import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Markdown from "react-markdown";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  /*
    BlogTitles component provides an AI-powered blog title generation interface.
    LOGIC EXPLANATION:
    - Uses useState to manage form inputs (keyword input and selected category)
    - blogCategories array defines available topic categories for title generation
    - Form submission handler prevents default behavior and would trigger AI API call
    - Dynamic category selection updates selectedCategory state and applies conditional styling
    - Two-column layout: left side has the input form, right side shows generated results
    - Currently shows placeholder content on the right; would display AI-generated titles after API integration
  */

  // Static array of blog categories - these are the topic options users can choose from
  const blogCategories = [
    "General",
    "Technology",
    "Business",
    "Health",
    "Lifestyle",
    "Education",
    "Travel",
    "Food",
  ];

  // State for currently selected category (defaults to "General")
  const [selectedCategory, setSelectedCategory] = useState("General");
  // State for user's keyword input
  const [input, setInput] = useState("");

  // State to manage loading state (shows spinner when generating blog titles)
  const [loading, setLoading] = useState(false);
  // State to store the generated blog titles content from the AI
  const [content, setContent] = useState("");

  // Clerk hook to get authentication token for API requests
  const { getToken } = useAuth();

  // Copy blog titles to clipboard functionality
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Blog titles copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy blog titles");
    }
  };

  // Form submission handler - processes blog title generation with keyword and category
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); // Show loading spinner
      // Create a detailed prompt for the AI with keyword and category context
      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory}. `;
      // Make API call to backend to generate blog titles using AI
      const { data } = await axios.post(
        "/api/ai/generate-blog-title",
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`, // Include auth token for protected route
          },
        }
      );

      // Handle API response
      if (data.success) {
        setContent(data.content); // Store the generated blog titles
      } else {
        toast.error(data.message); // Show error message if generation failed
      }
    } catch (error) {
      toast.error(error.message); // Show error message if API call failed
    }
    setLoading(false); // Hide loading spinner
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left column: Input form for blog title generation */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 "
      >
        {/* Form header with icon and title */}
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">AI Title Generator</h1>
        </div>

        {/* Keyword input field */}
        <p className="mt-6 text-sm font-medium">Keyword</p>
        <input
          onChange={(e) => setInput(e.target.value)} // Updates input state on every keystroke
          value={input} // Controlled input - value comes from state
          type="text"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="The future of AI is...."
          required // HTML5 validation - form won't submit if empty
        />

        {/* Category selection section */}
        <p className="mt-4 text-sm font-medium">Category</p>

        {/* Category tags: dynamically rendered from blogCategories array */}
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {blogCategories.map((item) => (
            <span
              onClick={() => setSelectedCategory(item)} // Updates selectedCategory state when clicked
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedCategory === item
                  ? "bg-purple-50 text-purple-700" // Active category styling
                  : "text-gray-500 border-gray-300" // Inactive category styling
              } `}
              key={item} // React key for list rendering
            >
              {item}
            </span>
          ))}
        </div>
        <br />
        {/* Submit button: triggers form submission and would generate blog titles */}
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Hash className="w-5" />
          )}
          Generate Title
        </button>
      </form>

      {/* Right column: Results display area */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ">
        {/* Results header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hash className="w-5 h-5 text-[#8E37EB]" />
            <h1 className="text-xl font-semibold">Generated titles</h1>
          </div>
          
          {/* Copy button - only show when content exists */}
          {content && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-600 text-xs rounded-md hover:bg-purple-100 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy Titles
            </button>
          )}
        </div>

        {/* Results content area: currently shows placeholder, would display AI-generated titles */}
        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            {/* Placeholder content: appears when no titles have been generated yet */}
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Hash className="w-9 h-9 " />
              <p>Enter a topic and click "Generate Title" to get started</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <div className="reset-tw">
              <Markdown>{content}</Markdown>{" "}
              {/* Renders markdown content with proper formatting */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;

import { useUser } from '@clerk/clerk-react';
import React, { useState, useEffect } from 'react'
import { dummyPublishedCreationData } from '../assets/assets';
import { Heart, Users, Download, Copy } from 'lucide-react';import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const Community = () => {
  /*
    Community component displays a gallery of published AI-generated creations from all users.
    FEATURES IMPLEMENTED:
    - Real-time backend integration with API authentication
    - Optimistic UI updates for instant like feedback
    - Instagram-like heart animations with custom CSS keyframes
    - Hover effects for image overlays and prompt display
    - Error handling with toast notifications
    
    LOGIC EXPLANATION:
    - Uses useState to manage creations array and animation states
    - useUser and useAuth hooks for Clerk authentication and API tokens
    - fetchCreations function loads published creations via authenticated API call
    - imageLikeToggle implements optimistic updates with fallback error handling
    - Custom CSS animations for heart pop effects and floating like animations
    - Group hover classes create smooth overlay transitions on image cards
    - Loading spinner displayed during initial data fetch
  */

  // State to store array of published community creations (loaded from backend API)
  const [creations, setCreations] = useState([]);
  // Get current user info from Clerk for authentication and like functionality
  const {user} = useUser();
  // Loading state for initial data fetch from server
  const [loading, setLoading] = useState(true);
  // State to track which creation is showing Instagram-like heart animation
  const [animatingLike, setAnimatingLike] = useState(null);
  // State to track which prompt is expanded (showing full text)
  const [expandedPrompt, setExpandedPrompt] = useState(null);
  // Clerk authentication hook to get JWT tokens for API requests
  const { getToken } = useAuth();

  // Function to truncate long prompts and handle expansion
  const truncateText = (text, maxLength = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Toggle prompt expansion
  const togglePromptExpansion = (creationId, e) => {
    e.stopPropagation();
    setExpandedPrompt(expandedPrompt === creationId ? null : creationId);
  };

  // Copy prompt functionality
  const copyPrompt = async (prompt, e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success("Prompt copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy prompt");
    }
  };

  // Download functionality for community images
  const downloadImage = async (imageUrl, creationId) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `community-image-${creationId}-${Date.now()}.png`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Image downloaded successfully!");
    } catch (err) {
      toast.error("Failed to download image");
    }
  };

  // Function to fetch published creations from backend API with authentication
  const fetchCreations = async () => {
    try {
      // Make authenticated API call to get all published community creations
      const {data} = await axios.get('/api/user/get-published-creations', {
        headers: {
          Authorization: `Bearer ${await getToken()}` // Include JWT token for authentication
        }
      });
      if (data.success) {
        setCreations(data.creations); // Update state with fetched creations
      } else {
        toast.error(data.message); // Show error if API returns failure
      }
    } catch (error) {
      toast.error(error.message); // Handle network or other errors
    }
    setLoading(false); // Hide loading spinner after fetch completes
  };

  /*
    OPTIMISTIC LIKE TOGGLE FUNCTION
    Implements Instagram-like instant like feedback with backend synchronization
    
    FEATURES:
    - Optimistic UI updates: Heart fills immediately on click for instant feedback
    - Instagram-style animations: Heart pop effect only triggers when liking (not unliking)
    - Error handling: Reverts optimistic changes if API call fails
    - Background sync: API call happens after UI update for perceived speed
    
    FLOW:
    1. Check current like status to determine if this is a like or unlike action
    2. If liking: trigger Instagram-style heart pop animation for 1 second
    3. Immediately update UI state (optimistic update) before API call
    4. Make authenticated API call to backend in background
    5. If API fails: revert the optimistic update and show error message
  */
  const imageLikeToggle = async (id) =>{
    try {
      // Check if this is a like (not unlike) to show animation
      const currentCreation = creations.find(creation => creation.id === id);
      const isCurrentlyLiked = currentCreation?.likes.includes(user.id);
      
      // Show Instagram-style animation only when liking (not unliking)
      if (!isCurrentlyLiked) {
        setAnimatingLike(id); // Trigger heart pop animation
        // Remove animation state after 1 second to complete the effect
        setTimeout(() => setAnimatingLike(null), 1000);
      }

      // OPTIMISTIC UPDATE: immediately update UI before API call for instant feedback
      setCreations(prevCreations => 
        prevCreations.map(creation => {
          if (creation.id === id) {
            return {
              ...creation,
              likes: isCurrentlyLiked 
                ? creation.likes.filter(userId => userId !== user.id) // Remove user's like
                : [...creation.likes, user.id] // Add user's like
            };
          }
          return creation;
        })
      );

      // Make authenticated API call in background after UI update
      const {data} = await axios.post('/api/user/toggle-like-creations',
        {id}, 
        {
        headers: {
          Authorization: `Bearer ${await getToken()}` // Include JWT for authentication
        }
      });
      
      if (!data.success) {
        // REVERT OPTIMISTIC UPDATE: If API call fails, undo the UI changes
        setCreations(prevCreations => 
          prevCreations.map(creation => {
            if (creation.id === id) {
              const wasLiked = creation.likes.includes(user.id);
              return {
                ...creation,
                likes: wasLiked 
                  ? creation.likes.filter(userId => userId !== user.id) // Revert: remove like
                  : [...creation.likes, user.id] // Revert: add like back
              };
            }
            return creation;
          })
        );
        toast.error(data.message);
      }
    } catch (error) {
      // HANDLE NETWORK ERRORS: Revert optimistic update if API call fails
      setCreations(prevCreations => 
        prevCreations.map(creation => {
          if (creation.id === id) {
            const wasLiked = creation.likes.includes(user.id);
            return {
              ...creation,
              likes: wasLiked 
                ? creation.likes.filter(userId => userId !== user.id) // Revert: remove like
                : [...creation.likes, user.id] // Revert: add like back
            };
          }
          return creation;
        })
      );
      toast.error(error.message);
    }
  }

  // useEffect runs fetchCreations when user becomes available (after authentication)
  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]); // Dependency on user ensures it runs when user logs in

  return !loading ? (
    <>
      {/* 
        CUSTOM CSS ANIMATIONS FOR INSTAGRAM-LIKE INTERACTIONS
        
        heartPop: Button heart animation for the like button itself
        - Quick pop effect that scales from 1 → 1.5 → 1 
        - Fast 0.2s timing for snappy Instagram-like feedback
        - Triggers only when liking (not unliking) for authentic feel
      */}
      <style jsx>{`
        @keyframes heartPop {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.5);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
      
      <div className='flex-1 h-full flex flex-col gap-4 p-6'>
      {/* Page header with icon and title */}
      <div className='flex items-center gap-3'>
        <Users className='w-6 h-6 text-[#4A7AFF]' />
        <h1 className='text-2xl font-semibold text-slate-700'>Community Creations</h1>
      </div>
      
      {/* Scrollable container for creation gallery */}
      <div className='bg-white h-full w-full rounded-xl overflow-y-scroll '>
        {/* Map through creations array to render each creation as an image card */}
        {creations.map((creation, index) => (
          <div key={index} className='relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3'>
            {/* Main creation image (content contains the image URL for published images) */}
            <img src={creation.content} alt="" className='w-full h-full object-cover rounded-lg' />

            {/* Download button: positioned at top-right corner */}
            <div className='absolute top-5 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10'>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadImage(creation.content, creation.id);
                }}
                className='bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-200 cursor-pointer hover:scale-110'
                title='Download Image'
              >
                <Download className='w-4 h-4' />
              </button>
            </div>

            {/* 
              Overlay div: uses CSS 'group' classes for hover effects
              - Normally positioned at bottom-right showing only like count
              - On hover: spans full image with dark gradient, shows prompt text
            */}
            <div className='absolute bottom-0 top-0 right-0 left-3 flex flex-col justify-end p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg'>
              {/* Prompt text: hidden by default, shows on hover with expandable functionality */}
              <div className='text-sm hidden group-hover:block mb-2'>
                <div className='flex items-start justify-between gap-2'>
                  <div className='cursor-pointer flex-1' onClick={(e) => togglePromptExpansion(creation.id, e)}>
                    <p className='break-words'>
                      {expandedPrompt === creation.id 
                        ? creation.prompt 
                        : truncateText(creation.prompt)
                      }
                      {creation.prompt.length > 50 && (
                        <span className='ml-1 text-blue-300 hover:text-blue-100 font-medium'>
                          {expandedPrompt === creation.id ? ' (click to collapse)' : ' (click to expand)'}
                        </span>
                      )}
                    </p>
                  </div>
                  
                  {/* Copy prompt button */}
                  <button
                    onClick={(e) => copyPrompt(creation.prompt, e)}
                    className='bg-white/20 hover:bg-white/30 p-1.5 rounded-md transition-colors duration-200 flex-shrink-0'
                    title='Copy prompt'
                  >
                    <Copy className='w-3.5 h-3.5' />
                  </button>
                </div>
              </div>
              
              {/* Like section: shows count and interactive heart icon */}
              <div className='flex gap-1 items-center justify-end'>
                {/* Like count: shows number of users who liked this creation */}
                <p>{creation.likes.length}</p>
                {/* 
                  Heart icon: interactive like button with bounce animation
                  - Checks if current user's ID is in the likes array
                  - If liked: filled red heart, if not liked: white outline heart
                  - Hover effect scales the icon slightly
                */}
                <Heart 
                  onClick={() => imageLikeToggle(creation.id)} 
                  className={`min-w-5 h-5 cursor-pointer transition-all duration-300 ${
                    creation.likes.includes(user.id) 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-white hover:text-red-300 hover:scale-110'
                  } ${
                    animatingLike === creation.id ? 'animate-bounce scale-125' : ''
                  }`} 
                  style={{
                    transformOrigin: 'center',
                    ...(animatingLike === creation.id && {
                      animation: 'heartPop 0.5s ease-out'
                    })
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  )
  :
  (
    <div className='flex justify-center items-center h-full'>
      <span className='w-10 h-10 rounded-full border-3 border-primary border-t-transparent animate-spin'></span>
    </div>
  )
}

export default Community 
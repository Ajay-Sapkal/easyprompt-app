import React, { useEffect, useState } from 'react'
import { dummyCreationData } from '../assets/assets';
import { Gem, Sparkles } from 'lucide-react';
import { Protect, useAuth } from '@clerk/clerk-react';
import CreationsItem from '../components/CreationsItem';
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const Dashboard = () => {
  /*
    Dashboard component displays the main dashboard page after user login.
    
    FEATURES IMPLEMENTED:
    - Real-time backend integration with API authentication using Clerk JWT tokens
    - Loading state management with centered spinner during data fetch
    - Error handling with toast notifications for API failures
    - Statistics cards showing user metrics (total creations, active plan)
    - Dynamic creations list using CreationsItem components
    - Accordion behavior for recent creations (only one expanded at a time)
    
    LOGIC EXPLANATION:
    - Uses useState to manage creations array state and loading state
    - useAuth hook from Clerk provides JWT token for authenticated API calls
    - getDashboardData function makes authenticated API call to fetch user's creations
    - useEffect runs getDashboardData on component mount to load user's creations
    - Conditional rendering shows loading spinner while fetching, then displays content
    - Uses Clerk's Protect component to conditionally show "Premium" or "Free" based on user's subscription
    - Maps through creations array to render each creation using CreationsItem component
    - handleCreationToggle manages accordion behavior ensuring only one creation is expanded
    - The dashboard provides an overview of user's AI content generation activity
  */

  // State to store user's creations (articles, images, etc.) fetched from backend API
  const [creations, setCreations] = useState([]);
  // Loading state to show spinner while fetching data from server
  const [loading, setLoading] = useState(true);
  // State to track which creation is currently expanded (accordion behavior)
  const [expandedCreationId, setExpandedCreationId] = useState(null);
  // Clerk authentication hook to get JWT tokens for API requests
  const {getToken} = useAuth();

  // Function to fetch dashboard data from backend API with authentication
  const getDashboardData = async ()=> {
    try {
      // Make authenticated API call to get user's creations using JWT token
      const { data } = await axios.get('/api/user/get-user-creations', 
        {
        headers: {
          Authorization: `Bearer ${await getToken()}` // Include Clerk JWT token for authentication
        }
      })

      if(data.success){
        setCreations(data.creations); // Set creations state with fetched data from server
      }else{
        toast.error(data.message); // Show error message if API returns failure
      }
    } catch (error) {
      toast.error(error.message); // Handle network errors or other API failures
    }
    setLoading(false); // Hide loading spinner after API call completes (success or error)
  }

  // Function to handle accordion behavior for creation items
  const handleCreationToggle = (creationId) => {
    // If the clicked creation is already expanded, collapse it
    // Otherwise, expand the clicked creation and collapse any previously expanded one
    setExpandedCreationId(expandedCreationId === creationId ? null : creationId);
  }

  // useEffect hook runs getDashboardData when component mounts (empty dependency array [])
  useEffect(()=>{
    getDashboardData()
  }, [])

  return (
    <div className='w-full p-6'>
      {/* Statistics cards section: shows key metrics in card format */}
      <div className='flex justify-start gap-4 flex-wrap '>
        {/* Total Creations Card: displays count of user's total AI-generated content */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200 '>
          {/* Left side: metric label and value */}
          <div className='text-slate-600'>
            <p className='text-sm'>Total Creations</p>
            {/* creations.length dynamically shows the count of items in creations array */}
            <h2 className='text-xl font-semibold'>{creations.length}</h2>
          </div>
          {/* Right side: decorative icon with gradient background */}
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex items-center justify-center'>
            <Sparkles className='w-5 text-white' />
          </div>
        </div>
        {/* Active Plan Card: shows user's subscription status using Clerk's plan protection */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200 '>
          {/* Left side: plan label and conditional plan name */}
          <div className='text-slate-600'>
            <p className='text-sm'>Active Plan</p>
            <h2 className='text-xl font-semibold'>
              {/* Protect component from Clerk: shows "Premium" if user has premium plan, "Free" otherwise */}
              <Protect plan='premium' fallback='free'>Premium</Protect>
            </h2>
          </div>
          {/* Right side: decorative gem icon for premium plan indication */}
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex items-center justify-center'>
            <Gem className='w-5 text-white' />
          </div>
        </div>

      </div>

      {
        loading ? 
        (
          /* 
            LOADING STATE: Centered spinner display
            - Shows while API call is in progress to fetch user's creations
            - Uses flexbox for perfect horizontal and vertical centering
            - min-h-[400px] ensures adequate space for proper centering
            - w-full makes container span full width for horizontal centering
            - Purple spinner matches app's color scheme with smooth rotation animation
          */
          <div className='flex justify-center items-center min-h-[400px] w-full'>
            <div className='animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent'></div>
          </div>
        )
        :
        (
          /* 
            CONTENT STATE: Recent Creations section displays after loading completes
            - Shows list of user's AI-generated content fetched from backend
            - Uses space-y-3 for consistent vertical spacing between creation items
            - Each creation rendered as CreationsItem component with hover effects
            - Dynamic list updates when creations state changes from API responses
          */
          <div className='space-y-3'>
            <p className='mt-6 mb-4'>Recent Creations</p>
            {/* 
              Map function iterates through creations array and renders CreationsItem component for each
              ACCORDION BEHAVIOR:
              - Each item receives isExpanded prop (true if this item's ID matches expandedCreationId)
              - Each item receives onToggle callback that passes the item ID to handleCreationToggle
              - Only one creation can be expanded at a time (accordion pattern)
              - Smooth animations handle expand/collapse transitions
            */}
            {
              creations.map((item) => (
                <CreationsItem 
                  key={item.id} 
                  item={item} 
                  isExpanded={expandedCreationId === item.id}
                  onToggle={() => handleCreationToggle(item.id)}
                />
              ))
            }
          </div>
        )
      }

      
    </div>
  )
}

export default Dashboard
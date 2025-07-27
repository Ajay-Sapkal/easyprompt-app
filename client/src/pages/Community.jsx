import { useUser } from '@clerk/clerk-react';
import React, { useState, useEffect } from 'react'
import { dummyPublishedCreationData } from '../assets/assets';
import { Heart, Users } from 'lucide-react';

const Community = () => {
  /*
    Community component displays a gallery of published AI-generated creations from all users.
    LOGIC EXPLANATION:
    - Uses useState to manage creations array (list of published community content)
    - useUser hook gets current user info for like functionality
    - fetchCreations function loads published creations (currently dummy data, would be API call)
    - useEffect runs fetchCreations when user is available (prevents loading before authentication)
    - Maps through creations to render each as an image card with hover effects
    - Each card shows the creation image, prompt on hover, and like count with interactive heart
    - Heart icon changes color/fill based on whether current user has liked the creation
    - Uses CSS group hover classes for overlay effects on image hover
  */

  // State to store array of published community creations
  const [creations, setCreations] = useState([]);
  // Get current user info from Clerk for like functionality
  const {user} = useUser();
  
  // Function to fetch published creations from community (would be API call in production)
  const fetchCreations = async () => {
    // In production: const response = await fetch('/api/community/creations')
    setCreations(dummyPublishedCreationData);
  };

  // useEffect runs fetchCreations when user becomes available (after authentication)
  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]); // Dependency on user ensures it runs when user logs in

  return (
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

            {/* 
              Overlay div: uses CSS 'group' classes for hover effects
              - Normally positioned at bottom-right showing only like count
              - On hover: spans full image with dark gradient, shows prompt text
            */}
            <div className='absolute bottom-0 top-0 right-0 left-3 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg'>
              {/* Prompt text: hidden by default, shows on hover */}
              <p className='text-sm hidden group-hover:block'>{creation.prompt}</p>
              
              {/* Like section: shows count and interactive heart icon */}
              <div className='flex gap-1 items-center'>
                {/* Like count: shows number of users who liked this creation */}
                <p>{creation.likes.length}</p>
                {/* 
                  Heart icon: interactive like button
                  - Checks if current user's ID is in the likes array
                  - If liked: filled red heart, if not liked: white outline heart
                  - Hover effect scales the icon slightly
                */}
                <Heart className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${creation.likes.includes(user.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  )
}

export default Community 
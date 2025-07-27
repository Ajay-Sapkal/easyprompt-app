import React, { useEffect, useState } from 'react'
import { dummyCreationData } from '../assets/assets';
import { Gem, Sparkles } from 'lucide-react';
import { Protect } from '@clerk/clerk-react';
import CreationsItem from '../components/CreationsItem';

const Dashboard = () => {
  /*
    Dashboard component displays the main dashboard page after user login.
    LOGIC EXPLANATION:
    - Uses useState to manage creations array state (list of user's AI-generated content)
    - useEffect runs getDashboardData on component mount to load user's creations
    - getDashboardData function sets the creations state with dummy data (in real app, this would be an API call)
    - Displays statistics cards showing total creations count and user's active plan
    - Uses Clerk's Protect component to conditionally show "Premium" or "Free" based on user's subscription
    - Maps through creations array to render each creation using CreationsItem component
    - The dashboard provides an overview of user's AI content generation activity
  */

  // State to store user's creations (articles, images, etc.)
  const [creations, setCreations] = useState([]);

  // Function to fetch dashboard data (currently uses dummy data, would be API call in production)
  const getDashboardData = async ()=> {
    // In a real app, this would be: const response = await fetch('/api/user/creations')
    setCreations(dummyCreationData)
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

      {/* Recent Creations section: displays list of user's AI-generated content */}
      <div className='space-y-3'>
        <p className='mt-6 mb-4'>Recent Creations</p>
        {/* 
          Map function iterates through creations array and renders CreationsItem component for each
          Each item gets a unique key (item.id) and the full item object as props
          This creates a dynamic list that updates when creations state changes
        */}
        {
          creations.map((item) => <CreationsItem key={item.id} item={item} />)
        }
      </div>
      
    </div>
  )
}

export default Dashboard
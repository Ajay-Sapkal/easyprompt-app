import React from 'react'
import {PricingTable} from '@clerk/clerk-react'


const Plan = () => {
  /*
    The Plan component displays the pricing section of your app.
    It uses Clerk's <PricingTable /> component to show available subscription plans and payment options.
    The layout centers the content and provides a headline, description, and the pricing table.
    Tailwind CSS classes are used for spacing, alignment, and responsive design.
  */
  return (
    <div className='max-w-2xl mx-auto z-20 my-30'>
      {/* Headline and description for the pricing section */}
      <div className='text-center'>
        <h2 className='text-slate-700 text-[42px] font-semibold'>Choose Your Plan</h2>
        <p className='text-gray-500 max-w-lg mx-auto'>
          Start for free and scale up as you grow. Find the perfect plan for your content creation needs.
        </p>
      </div>

      {/* PricingTable is a pre-built component from Clerk that displays pricing options and handles checkout */}
      <div className='mt-14 max-sm:mx-8'>
        <PricingTable/>
      </div>
    </div>
  )
}

export default Plan
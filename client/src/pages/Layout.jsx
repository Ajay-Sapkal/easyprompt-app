import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { useUser, SignIn } from '@clerk/clerk-react'


const Layout = () => {
  /*
    Layout component serves as the main app wrapper that provides consistent navigation and layout structure.
    LOGIC EXPLANATION:
    - Acts as a protected route wrapper - only shows app content if user is authenticated
    - Uses useState to manage sidebar visibility (for mobile responsive menu)
    - useEffect manipulates document.body styles to create a fixed layout without body scrolling
    - Conditionally renders either the main app layout (if user logged in) or sign-in form (if not)
    - Uses React Router's Outlet to render child routes within the layout
    - Provides consistent top navigation bar with logo and mobile menu toggle
    - Creates a sidebar + main content area layout structure
  */

  // React Router hooks for navigation and current route detection
  const navigate = useNavigate();
  const location = useLocation();
  
  // State to control sidebar visibility (important for mobile responsiveness)
  const[sidebar, setSidebar] = useState(false);
  
  // Clerk hook to get current user authentication status
  const { user } = useUser();

  // useEffect to apply body styles for fixed layout (prevents double scrollbar issues)
  useEffect(() => {
    // Set body to fixed height and hide overflow to prevent background scrolling
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    
    // Cleanup function: restores original body styles when component unmounts
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [location]); // Re-run when route changes

  // Conditional rendering: show app layout if user exists, otherwise show sign-in
  return user ? (
    /* Main app layout: fixed height container with header and content area */
    <div className='flex flex-col h-screen overflow-hidden'>
      {/* Top navigation bar: logo on left, mobile menu toggle on right */}
      <nav className='w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200'>
        {/* Logo: clickable, navigates to home page */}
        <img className='cursor-pointer w-32 sm:w-44' src={assets.logo} alt="" onClick={() => navigate('/')}/>
        {/* 
          Mobile menu toggle: shows X when sidebar is open, hamburger menu when closed
          Only visible on small screens (sm:hidden hides it on larger screens)
        */}
        {
          sidebar ? <X onClick={()=> setSidebar(false)} className='w-6 h-6 text-gray-600 sm:hidden' />
          : <Menu onClick={()=> setSidebar(true)} className='w-6 h-6 text-gray-600 sm:hidden' />
        }
      </nav>

      {/* Main content area: sidebar on left, page content on right */}
      <div className='flex flex-1 overflow-hidden'>
        {/* Sidebar component: receives sidebar state and setter function as props */}
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        {/* Main content area: where child routes render via Outlet */}
        <div className='flex-1 bg-[#F4F7FB] overflow-y-auto'>
          {/* Outlet renders the current route's component (Dashboard, WriteArticle, etc.) */}
          <Outlet />
        </div>
      </div>

    </div>
  ) : (
    /* Sign-in screen: centered login form when user is not authenticated */
    <div className='flex items-center justify-center h-screen'>
      {/* Clerk's SignIn component handles the authentication flow */}
      <SignIn />
    </div>
  )
}

export default Layout
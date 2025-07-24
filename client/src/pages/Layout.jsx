import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { useUser, SignIn } from '@clerk/clerk-react'


const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const[sidebar, setSidebar] = useState(false);
  const { user } = useUser();

  // Apply different CSS classes to body based on route
  useEffect(() => {
    // For AI pages, we want fixed layout without body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    
    return () => {
      // Cleanup when component unmounts
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [location]);

  return user ? (
    <div className='flex flex-col h-screen overflow-hidden'>

      <nav className='w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200'>
        <img className='cursor-pointer w-32 sm:w-44' src={assets.logo} alt="" onClick={() => navigate('/')}/>
        {
          sidebar ? <X onClick={()=> setSidebar(false)} className='w-6 h-6 text-gray-600 sm:hidden' />
          : <Menu onClick={()=> setSidebar(true)} className='w-6 h-6 text-gray-600 sm:hidden' />
        }
      </nav>

      <div className='flex flex-1 overflow-hidden'>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <div className='flex-1 bg-[#F4F7FB] overflow-y-auto'>
          <Outlet />
        </div>
      </div>

    </div>
  ) : (
    <div className='flex items-center justify-center h-screen'>
      <SignIn />
    </div>
  )
}

export default Layout
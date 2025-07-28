import React from 'react'
import { assets } from '../assets/assets'
import { Protect, useClerk, useUser } from '@clerk/clerk-react'
import { Eraser, FileText, Hash, House, Image, LogOut, Scissors, SquarePen, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'


// navItems is an array of objects, each representing a navigation link in the sidebar.
// Each object contains:
//   - to: the route path
//   - label: the text to display
//   - Icon: the icon component to show
// This array is used to dynamically render the sidebar navigation links.
const navItems = [
  { to: '/ai', label: 'Dashboard', Icon: House },
  { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
  { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
  { to: '/ai/generate-images', label: 'Generate Images', Icon: Image },
  { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
  { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors },
  { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
  { to: '/ai/community', label: 'Community', Icon: Users },
]


const Sidebar = ({sidebar, setSidebar}) => {
    /*
      Sidebar component displays the vertical navigation menu for the app.
      LOGIC EXPLANATION:
      - Receives sidebar (boolean) and setSidebar (function) as props to control sidebar visibility (for mobile responsiveness).
      - Uses useUser() to get the current user's info (profile image, name).
      - Uses useClerk() to get signOut (logout function) and openUserProfile (opens user profile modal).
      - Renders a list of navigation links using navItems. For each item:
          - NavLink from react-router-dom is used for navigation and to highlight the active link.
          - When a link is clicked, setSidebar(false) closes the sidebar (on mobile).
          - The className is dynamically set based on whether the link is active, changing its style.
      - At the bottom, shows the user's profile info and a logout button.
      - The Protect component from Clerk displays "Premium" if the user has a premium plan, otherwise "Free".
      - The sidebar slides in/out on mobile using Tailwind classes and the sidebar prop.
    */

    const {user} = useUser();
    const {signOut, openUserProfile} = useClerk();
    return (
        <div className={`w-60 sm:w-60 md:w-60 lg:w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center h-full overflow-y-auto 
            md:static md:translate-x-0 
            max-md:fixed max-md:top-0 max-md:left-0 max-md:h-screen max-md:z-50 max-md:w-64
            ${sidebar ? 'translate-x-0' : 'max-md:-translate-x-full'} 
            transition-all duration-300 ease-in-out`}>
            {/* User profile section at the top */}
            <div className='my-7 w-full'>
                <img src={user.imageUrl} alt="User avatar" className='w-13 rounded-full mx-auto'/>
                <h1 className='mt-1 mb-1 text-center'>{user.fullName}</h1>
                {/* Navigation links rendered from navItems array */}
                <div className='px-4 md:px-6 mt-5 text-sm text-gray-600 font-medium'>
                    {navItems.map(({to, label, Icon})=>(
                        <NavLink
                            key={to}
                            to={to}
                            end={to == '/ai'} // Only exact match for dashboard
                            onClick={() => setSidebar(false)} // Close sidebar on link click (mobile)
                            className={({isActive}) =>
                                `px-3 py-3 md:px-3.5 md:py-2.5 flex items-center gap-3 rounded mb-1 transition-colors duration-0 transition-transform duration-150
                                ${isActive ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white scale-100' : 'text-black hover:scale-105 hover:bg-gray-100'}
                                `
                            }
                        >
                            {({isActive}) => (
                                <>
                                    {/* Icon and label for each nav item; icon color changes if active */}
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''} transition-none`} />
                                    {label}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </div>  

            {/* User profile and logout section at the bottom */}
            <div className='w-full border-t border-gray-200 p-3 md:p-4 px-4 md:px-7 flex items-center justify-between'>
                <div className='flex gap-2 items-center cursor-pointer' onClick={openUserProfile}>
                    <img src={user.imageUrl} alt="User avatar" className='w-8 h-8 rounded-full object-cover' />
                    <div className='min-w-0 flex-1'>
                        <h1 className='text-sm font-medium truncate'>{user.fullName}</h1>
                        <p className='text-xs text-gray-500'>
                            {/* Protect shows "Premium" if user has premium plan, else "Free" */}
                            <Protect plan='premium' fallback="Free">Premium </Protect>
                            Plan    
                        </p>
                    </div>
                </div>
                {/* Logout icon triggers signOut from Clerk */}
                <LogOut onClick={signOut} className='w-4 h-4 md:w-4.5 md:h-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer flex-shrink-0' />
            </div>
        </div>
    )
}

export default Sidebar
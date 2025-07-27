import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ArrowRight, User } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
    // Initialize navigation hook
    const navigate = useNavigate();
    // Get current user info from Clerk
    const {user} = useUser();
    // Get sign-in function from Clerk
    const {openSignIn} = useClerk();

    // Render the navigation bar
    return (
        <div className="fixed z-5 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32 cursor-pointer">
            {/* Logo, navigates to home on click */}
            <img
                src={assets.logo}
                alt="logo"
                className='w-36 sm:w-48 cursor-pointer'
                onClick={() => navigate("/")}
            />

            {/* Show user button if logged in, else show Get Started button */}
            {
                user ? <UserButton /> : 
                (
                    <button onClick={openSignIn} className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5'>
                        Get Started <ArrowRight className="w-4 h-4" />
                    </button>
                )
            }
        </div>
    );
};


// Exporting Navbar component as default
export default Navbar;

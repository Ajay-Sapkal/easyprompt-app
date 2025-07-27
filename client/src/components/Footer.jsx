import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";


const Footer = () => {
  // useNavigate is a React Router hook that lets you change the page programmatically
  const navigate = useNavigate();

  /*
    The Footer component displays the bottom section of your website.
    It provides:
      - Branding and a short description of your app
      - Company navigation links (Home, About, Contact, Privacy)
      - A newsletter subscription form (UI only, not functional yet)
      - Copyright notice
    The layout is responsive and styled using Tailwind CSS utility classes.
  */
  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-gray-500 mt-20">
      {/*
        The main content area of the footer is split into two columns on desktop:
          - Left: Logo and app description
          - Right: Company links and newsletter form
        On mobile, these stack vertically.
      */}
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
        {/* Branding and app description */}
        <div className="md:max-w-96">
          <img className="h-9" src={assets.logo} alt="dummyLogoDark" />
          <p className="mt-6 text-sm">
            Experience the power of AI with EasyPrompt. <br />
            Transform your content creation with our suite of premium AI tools.
            Write articles, generate images, and enhance your workflow.
          </p>
        </div>
        {/* Company navigation links and newsletter form */}
        <div className="flex-1 flex items-start md:justify-end gap-20">
          {/*
            Company navigation links: clicking scrolls to top and navigates home (can be customized)
            All links currently navigate to the homepage and scroll to the top smoothly.
            You can update the navigate() path for real About, Contact, Privacy pages in the future.
          */}
          <div>
            <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a
                  className="cursor-pointer"
                  onClick={() => {
                    navigate("/");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  className="cursor-pointer"
                  onClick={() => {
                    navigate("/");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  About us
                </a>
              </li>
              <li>
                <a
                  className="cursor-pointer"
                  onClick={() => {
                    navigate("/");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Contact us
                </a>
              </li>
              <li>
                <a
                  className="cursor-pointer"
                  onClick={() => {
                    navigate("/");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Privacy policy
                </a>
              </li>
            </ul>
          </div>
          {/*
            Newsletter subscription form (UI only, not connected to backend)
            This is just for display; you can add real functionality later.
          */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-5">
              Subscribe to our newsletter
            </h2>
            <div className="text-sm space-y-2">
              <p>
                The latest news, articles, and resources, sent to your inbox
                weekly.
              </p>
              <div className="flex items-center gap-2 pt-4">
                <input
                  className="border border-gray-500/30 placeholder-gray-500 focus:ring-2 ring-indigo-600 outline-none w-full max-w-64 h-9 rounded px-2"
                  type="email"
                  placeholder="Enter your email"
                />
                <button className="bg-primary w-24 h-9 text-white rounded cursor-pointer">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*
        Copyright and legal notice:
        - Shows the year and app name
        - Clicking the app name scrolls to top and navigates home
      */}
      <p className="pt-4 text-center text-xs md:text-sm pb-5">
        Copyright 2025 ©{" "}
        <a
          onClick={() => {
            navigate("/");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="cursor-pointer"
        >
          EasyPrompt
        </a>
        . All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;

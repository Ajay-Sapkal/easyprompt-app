import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Hero = () => {
  /*
    useNavigate is a React Router hook that lets you programmatically change the page (route) in your app.
    Here, we use it to send the user to a different page when they click a button.
  */
  const navigate = useNavigate();

  /*
    This component returns the main hero section of your homepage.
    The hero section is the big, eye-catching area at the top of a website that introduces what your app does.
    It includes:
      - A headline and description to explain your app's value
      - Two buttons for user actions (start using the app or watch a demo)
      - A trust indicator showing how many users trust your app
    The layout uses Tailwind CSS utility classes for styling and responsiveness.
  */
  return (
    <div
      className="px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen"
    >
      {/*
        Headline and description area:
        - <h1> is the main title, using different font sizes for different screen sizes.
        - <span> highlights the words "AI tools" in a special color.
        - <p> is a short description below the title, explaining what the app offers.
        - The text is centered and spaced for a clean look.
      */}
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2]">
          Create amazing content <br /> with
          <span className="text-primary"> AI tools</span>
        </h1>
        <p className="mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto max-sm:text-xs text-gray-600">
          Transform your content creation with our suite of premium AI tools.
          Write articles, generate images, and enhance your workflow.
        </p>
      </div>

      {/*
        Action buttons area:
        - The first button says "Start Creating now" and takes the user to the /ai page when clicked.
        - The second button says "Watch demo" (you can later add a video or modal for this).
        - Both buttons are styled for a modern look and have hover/active effects for interactivity.
        - The layout is responsive and wraps on small screens.
      */}
      <div className="flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs">
        <button
          onClick={() => navigate("/ai")}
          className="bg-primary text-white px-10 py-3 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer"
        >
          Start Creating now
        </button>
        <button className="bg-white px-10 py-3 rounded-lg border border-gray-300 hover:scale-102 active:scale-95 transition cursor-pointer">
          Watch demo
        </button>
      </div>

      {/*
        Trust indicator area:
        - Shows an image of a group of users (from your assets) and a message "Trusted by 10k+ users".
        - This helps build credibility for new visitors.
        - The layout centers the image and text, and uses a subtle color.
      */}
      <div className="flex items-center gap-4 mt-8 mx-auto text-gray-600">
        <img src={assets.user_group} alt="" className="h-8" /> Trusted by 10k+
        users
      </div>
    </div>
  );
};

export default Hero;

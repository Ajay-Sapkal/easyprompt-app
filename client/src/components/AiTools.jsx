import React from "react";
import { AiToolsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const AiTools = () => {
  /*
    The AiTools component displays a grid of available AI tools for the user to explore and use.
    It uses data from AiToolsData (imported from assets) to dynamically render each tool as a card.
    The user must be logged in to navigate to a tool's page (handled by Clerk's useUser hook).
    Tailwind CSS classes are used for layout, spacing, and responsive design.
  */

  // useNavigate is a React Router hook for programmatic navigation
  const navigate = useNavigate();
  // useUser is a Clerk hook that provides info about the currently signed-in user
  const { user } = useUser();

  return (
    <div className="px-4 sm:px-20 xl:px-32 my-24">
      {/* Section headline and description */}
      <div className="text-center ">
        <h2 className="text-slate-700 text-[42px] font-semibold">
          PowerFul AI Tools
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Everything you need to create, enhance, add optimize your content with
          cutting-edge AI technology
        </p>
      </div>

      {/*
        Tool cards grid:
        - Loops through AiToolsData array and renders a card for each tool.
        - Each card shows the tool's icon, title, and description.
        - The card is clickable only if the user is logged in; clicking navigates to the tool's page.
        - Icon uses a gradient background from the tool's data.
        - Cards have hover and transition effects for interactivity.
      */}
      <div className="flex flex-wrap justify-center mt-10">
        {AiToolsData.map((tool, index) => (
          <div
            key={index}
            className="p-8 m-4 max-w-xs rounded-lg bg-[#FDFDFE] shadow-lg border border-gray-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={() => user && navigate(tool.path)}
          >
            <tool.Icon
              className="w-12 h-12 p-3 text-white rounded-xl"
              style={{
                background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})`,
              }}
            />
            <h3 className="mt-6 mb-3 text-lg font-semibold">{tool.title}</h3>
            <p className="text-gray-400 text-sm max-w-[95%]">
              {tool.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiTools;

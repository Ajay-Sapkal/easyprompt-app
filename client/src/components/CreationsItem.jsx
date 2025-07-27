import React from 'react'
import { useState } from 'react';
import Markdown from 'react-markdown';

const CreationsItem = ({item}) => {
    /*
      CreationsItem component displays a single AI-generated creation (article, image, etc.) in an expandable card format.
      LOGIC EXPLANATION:
      - Receives an 'item' prop containing creation data (prompt, content, type, created_at, etc.)
      - Uses useState hook to manage the 'expanded' state - whether the card shows full content or just summary
      - When clicked, toggles between collapsed (showing only prompt & metadata) and expanded (showing full content)
      - Conditionally renders content based on item.type:
          * If type is 'image': displays the image from item.content
          * If type is text-based (article, blog-title): renders the text content using react-markdown for proper formatting
      - The Markdown component converts markdown text to HTML for rich text display
      - Uses responsive design with hover effects for better UX
    */

    // State to track whether this creation item is expanded (showing full content) or collapsed (showing only summary)
    const [expanded, setExpanded] = useState(false);

    return (
        <div onClick={() => setExpanded(!expanded)} className='p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer transition-shadow duration-200 hover:shadow-lg hover:border-blue-300'>
            {/* Header section: always visible, shows prompt, metadata, and type badge */}
            <div className='flex items-center justify-between gap-4'>
                {/* Left side: prompt text and metadata (type and creation date) */}
                <div>
                    {/* The original prompt/question that was given to the AI */}
                    <h2>{item.prompt}</h2>
                    {/* Shows content type and formatted creation date */}
                    <p className='text-gray-500'>{item.type} - {new Date(item.created_at).toLocaleDateString()}</p>
                </div>
                {/* Right side: type badge button (visual indicator of content type) */}
                <button className='bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-1 rounded-full'>{item.type}</button>
            </div>

            {/* 
              Conditional rendering: only show content when expanded is true
              Uses JavaScript's && operator - if expanded is false, nothing renders
            */}
            {
                expanded && (
                    <div>
                        {/* Ternary operator: check item type to decide how to render content */}
                        {item.type === 'image' ? (
                            /* Image content: display the generated image */
                            <div>
                                {/* item.content contains the image URL for image types */}
                                <img src={item.content} alt="image" className='mt-3 w-full max-w-md'/>
                            </div>
                        ) : (
                            /* Text content: for articles, blog titles, etc. */
                            <div className='mt-3 w-full overflow-y-scroll text-sm text-slate-700'>
                                {/* reset-tw class removes Tailwind's default styling that might interfere with markdown */}
                                <div className='reset-tw'>
                                    {/* Markdown component parses markdown syntax and converts to proper HTML */}
                                    {/* item.content contains markdown text for text-based content types */}
                                    <Markdown>{item.content}</Markdown>
                                </div>
                            </div>
                        )}
                    </div>
                )
            }
        </div>
    )
}

export default CreationsItem
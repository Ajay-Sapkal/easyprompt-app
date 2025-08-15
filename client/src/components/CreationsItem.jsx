import React from 'react'
import Markdown from 'react-markdown';

const CreationsItem = ({item, isExpanded, onToggle}) => {
    /*
      CreationsItem component displays a single AI-generated creation (article, image, etc.) in an expandable card format.
      SMOOTH ACCORDION BEHAVIOR:
      - Receives 'isExpanded' prop to determine if this item should be expanded
      - Receives 'onToggle' callback function to notify parent when clicked
      - Parent (Dashboard) manages which item is expanded (accordion behavior)
      - Only one creation can be expanded at a time across all items
      - Uses max-height and opacity transitions for smooth expand/collapse animations
      
      ANIMATION DETAILS:
      - Collapsed state: max-height: 0, opacity: 0, overflow: hidden
      - Expanded state: max-height: 1000px, opacity: 1, with top margin
      - Duration: 500ms for height transition, 300ms for content padding
      - Easing: ease-in-out for natural feeling animations
      
      LOGIC EXPLANATION:
      - Receives an 'item' prop containing creation data (prompt, content, type, created_at, etc.)
      - Uses controlled expansion state from parent component for accordion behavior
      - When clicked, calls onToggle callback to notify parent component
      - Conditionally renders content based on item.type:
          * If type is 'image': displays the image from item.content
          * If type is text-based (article, blog-title): renders the text content using react-markdown for proper formatting
      - The Markdown component converts markdown text to HTML for rich text display
      */    return (
        <div onClick={onToggle} className='p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-black-300'>
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
              Smooth expanding/collapsing content container
              Uses max-height and opacity transitions for smooth accordion animation
              - Collapsed: max-height: 0, opacity: 0, overflow: hidden
              - Expanded: max-height: 1000px (enough for most content), opacity: 1
            */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isExpanded 
                    ? 'max-h-[1000px] opacity-100 mt-3' 
                    : 'max-h-0 opacity-0 mt-0'
            }`}>
                {/* Content wrapper with additional padding when expanded */}
                <div className={`transition-all duration-300 ${isExpanded ? 'pt-2' : 'pt-0'}`}>
                    {/* Ternary operator: check item type to decide how to render content */}
                    {item.type === 'image' ? (
                        /* Image content: display the generated image */
                        <div className="transition-all duration-300 ease-in-out">
                            {/* item.content contains the image URL for image types */}
                            <img src={item.content} alt="image" className='w-full max-w-md rounded-lg'/>
                        </div>
                    ) : (
                        /* Text content: for articles, blog titles, etc. */
                        <div className='w-full overflow-y-auto text-sm text-slate-700 max-h-96'>
                            {/* reset-tw class removes Tailwind's default styling that might interfere with markdown */}
                            <div className='reset-tw'>
                                {/* Markdown component parses markdown syntax and converts to proper HTML */}
                                {/* item.content contains markdown text for text-based content types */}
                                <Markdown>{item.content}</Markdown>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CreationsItem
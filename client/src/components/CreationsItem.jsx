import React from 'react'
import Markdown from 'react-markdown';
import { Copy, Download } from 'lucide-react';
import toast from 'react-hot-toast';

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
      */    

    // Copy to clipboard functionality
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(item.content);
            toast.success("Content copied to clipboard!");
        } catch (err) {
            toast.error("Failed to copy content");
        }
    };

    // Download functionality for images
    const downloadImage = async () => {
        try {
            // Fetch the image from the URL
            const response = await fetch(item.content);
            const blob = await response.blob();
            
            // Create a temporary URL for the blob
            const url = window.URL.createObjectURL(blob);
            
            // Create a temporary download link
            const link = document.createElement('a');
            link.href = url;
            
            // Generate filename based on content type and timestamp
            const timestamp = Date.now();
            let filename;
            switch(item.type) {
                case 'image':
                    filename = `ai-generated-image-${timestamp}.png`;
                    break;
                case 'background-removal':
                    filename = `background-removed-${timestamp}.png`;
                    break;
                case 'object-removal':
                    filename = `object-removed-${timestamp}.png`;
                    break;
                default:
                    filename = `downloaded-image-${timestamp}.png`;
            }
            
            link.download = filename;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.success("Image downloaded successfully!");
        } catch (err) {
            console.error('Download error:', err);
            toast.error("Failed to download image");
        }
    };

    return (
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
                    
                    {/* Action buttons header - only visible when expanded */}
                    {isExpanded && (
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs text-gray-500">Creation Content</span>
                            <div className="flex gap-2">
                                {/* Copy Button for text-based content */}
                                {(item.type === 'article' || item.type === 'blog-title' || item.type === 'resume-review') && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent accordion toggle when clicking button
                                            copyToClipboard(); // Call copy function
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs rounded-md hover:bg-blue-100 transition-colors"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                        Copy
                                    </button>
                                )}
                                
                                {/* Download Button for image-based content */}
                                {(item.type === 'image' || item.type === 'background-removal' || item.type === 'object-removal') && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent accordion toggle when clicking button
                                            downloadImage(); // Call download function
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 text-xs rounded-md hover:bg-green-100 transition-colors"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        Download
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

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
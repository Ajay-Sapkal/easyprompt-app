import React from 'react'
import { assets } from '../assets/assets'



const Testimonial = () => {
    /*
      The Testimonial component displays user feedback and reviews for your app.
      LOGIC EXPLANATION:
      - It defines an array called dummyTestimonialData, where each object represents a user's testimonial (review).
      - The component uses the JavaScript map() function to loop through this array and generate a testimonial card for each entry.
      - For the star rating, it creates an array of 5 elements (for 5 stars), and for each star, it checks if the current index is less than the testimonial's rating. If so, it shows a filled star; otherwise, it shows a dull (empty) star. This is a common pattern for rendering ratings visually.
      - All testimonial cards are displayed in a flexbox grid, and each card includes the user's review, name, title, and profile image.
      - The component is a React functional component, so it re-renders automatically if the data changes (though here the data is static).
      - Tailwind CSS classes are used for layout, spacing, and responsive design, but the logic for rendering is handled by React and JavaScript.
    */

    // Array of testimonial objects, each representing a user's review
    const dummyTestimonialData = [
        {
            image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
            name: 'John Doe',
            title: 'Marketing Director, TechCorp',
            content: 'ContentAI has revolutionized our content workflow. The quality of the articles is outstanding, and it saves us hours of work every week.',
            rating: 4,
        },
        {
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
            name: 'Jane Smith',
            title: 'Content Creator, TechCorp',
            content: 'ContentAI has made our content creation process effortless. The AI tools have helped us produce high-quality content faster than ever before.',
            rating: 5,
        },
        {
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
            name: 'David Lee',
            title: 'Content Writer, TechCorp',
            content: 'ContentAI has transformed our content creation process. The AI tools have helped us produce high-quality content faster than ever before.',
            rating: 4,
        },
    ]

    return (
        <div className='px-4 sm:px-20 xl:px-32 py-24'>
            {/* Section headline and description */}
            <div className='text-center'>
                <h2 className='text-slate-700 text-[42px] font-semibold'>Loved by Creators</h2>
                <p className='text-gray-500 max-w-lg mx-auto'>Don't just take our word for it. Here's what our users are saying.</p>
            </div>

            {/*
              Testimonial cards grid:
              - We use map() to loop through dummyTestimonialData and render a card for each testimonial.
              - For each testimonial, we use Array(5).fill(0).map(...) to create 5 stars. If the current star index is less than the testimonial's rating, we show a filled star; otherwise, a dull star.
              - This logic allows us to visually represent ratings out of 5 in a dynamic way.
              - The rest of the card displays the testimonial's content, and user info.
            */}
            <div className='flex flex-wrap mt-10 justify-center'>
                {dummyTestimonialData.map((testimonial, index) => (
                    <div key={index} className='p-8 m-4 max-w-xs rounded-lg bg-[#FDFDFE] shadow-lg border border-gray-100 hover:-translate-y-1 transition duration-300 cursor-pointer'>
                        {/* Star rating: filled or dull star icons based on testimonial.rating */}
                        <div className="flex items-center gap-1">
                            {Array(5).fill(0).map((_, img) => (
                                // For each star, check if its index is less than the rating. If so, show filled star, else dull star.
                                <img key={img} src={img < testimonial.rating ? assets.star_icon : assets.star_dull_icon} 
                                className='w-4 h-4' alt="star"/>
                            ))}
                        </div>
                        {/* Testimonial content (user's review) */}
                        <p className='text-gray-500 text-sm my-5'>"{testimonial.content}"</p>
                        <hr className='mb-5 border-gray-300' />
                        {/* User info: profile image, name, and title */}
                        <div className='flex items-center gap-4'>
                            <img src={testimonial.image} className='w-12 object-contain rounded-full' alt='' />
                            <div className='text-sm text-gray-600'>
                                <h3 className='font-medium'>{testimonial.name}</h3>
                                <p className='text-xs text-gray-500'>{testimonial.title}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Testimonial;
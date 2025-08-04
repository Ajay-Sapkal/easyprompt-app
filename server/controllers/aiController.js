// Import and configure OpenAI, database, Clerk, axios, and Cloudinary for AI and image operations
import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";

// Initialize OpenAI client for Gemini API
const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});


// This function generates an article using AI and saves it to the database.
// Steps:
// 1. Get user info and request data (prompt and length)
// 2. Check if the user is allowed to use this feature (free or premium)
// 3. Ask the AI to write an article based on the prompt
// 4. Save the article to the database
// 5. If the user is free, update their usage count
// 6. Send the article back to the client
export const generateArticle = async (req, res) => {
    try {
        const { userId } = req.auth(); // Get the user's ID from authentication
        const { prompt, length } = req.body; // Get the prompt and length from the request
        const plan = req.plan; // User's plan (free or premium)
        const freeUsage = req.free_usage; // How many free uses the user has left

        // If the user is free and has used up their limit, block the request
        if (plan !== 'premium' && freeUsage >= 10) {
            return res.json({
                success: false,
                message: 'Free usage limit exceeded. Upgrade to premium for unlimited access.'
            });
        }

        // Ask the AI to generate an article
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: length,
        });

        const content = response.choices[0].message.content; // Get the article text from the AI response

        // Save the article to the database
        await sql`
            INSERT INTO creations (user_id, prompt, content, type)
            VALUES (${userId}, ${prompt}, ${content}, 'article')
        `;

        // If the user is free, increase their usage count
        if (plan !== 'premium') {
            await clerkClient.users.updateUser(userId, {
                privateMetadata: {
                    free_usage: freeUsage + 1
                }
            });
        }

        // Send the article back to the client
        res.json({
            success: true,
            content
        });

    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        });
    }
}


// This function generates blog titles using AI and saves them to the database.
// Steps are similar to generateArticle, but for blog titles.
export const generateBlogTitle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt } = req.body;
        const plan = req.plan;
        const freeUsage = req.free_usage;

        // Check usage limit for free users
        if (plan !== 'premium' && freeUsage >= 10) {
            return res.json({
                success: false,
                message: 'Free usage limit exceeded. Upgrade to premium for unlimited access.'
            });
        }

        // Ask the AI to generate blog titles
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 100,
        });

        const content = response.choices[0].message.content; // Get the blog titles from the AI response

        // Save the blog titles to the database
        await sql`
            INSERT INTO creations (user_id, prompt, content, type)
            VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
        `;

        // If the user is free, increase their usage count
        if (plan !== 'premium') {
            await clerkClient.users.updateUser(userId, {
                privateMetadata: {
                    free_usage: freeUsage + 1
                }
            });
        }

        // Send the blog titles back to the client
        res.json({
            success: true,
            content
        });

    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        });
    }
}


// This function lets premium users generate an image using an external AI image API (ClipDrop),
// uploads the generated image to Cloudinary, and saves the image URL in the database.
// Steps:
// 1. Check if the user is premium (only premium users can use this)
// 2. Send the prompt to the ClipDrop API to generate an image
// 3. Convert the image data to base64 format
// 4. Upload the image to Cloudinary and get the image URL
// 5. Save the image URL in the database
// 6. Return the image URL to the client
export const generateImage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, publish } = req.body;
        const plan = req.plan;

        // Only premium users can generate images
        if (plan !== 'premium') {
            return res.json({
                success: false,
                message: "Free users cannot generate images. Upgrade to premium for this feature."
            });
        }

        // Prepare the prompt for the ClipDrop API
        const formData = new FormData()
        formData.append('prompt', prompt);
        // Call the ClipDrop API to generate an image
        const {data} = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
            headers: {'x-api-key': process.env.CLIPDROP_API_KEY,},
            responseType: 'arraybuffer',
        })

        // Convert the image data to base64 so Cloudinary can accept it
        const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;
        // Upload the image to Cloudinary and get the URL
        const {secure_url} = await cloudinary.uploader.upload(base64Image)

        // Save the image URL to the database
        await sql`
            INSERT INTO creations (user_id, prompt, content, type, publish)
            VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})
        `;

        // Send the image URL back to the client
        res.json({
            success: true,
            content: secure_url
        });

    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        });
    }
}



// This function removes the background from an uploaded image using Cloudinary's background removal feature.
// Only premium users can use this feature.
export const removeImageBackground = async (req, res) => {
    try {
        const { userId } = req.auth(); // Get the user's ID from authentication
        const {image} = req.file;    // Get the uploaded image file
        const plan = req.plan;       // Get the user's plan (free or premium)

        // Only premium users can generate images
        // Only premium users can generate images
        if (plan !== 'premium') {
            return res.json({
                success: false,
                message: "Free users cannot generate images. Upgrade to premium for this feature."
            });
        }

        

        // Upload the image to Cloudinary and apply background removal transformation
        const {secure_url} = await cloudinary.uploader.upload(image.path, {
            transformation: [
                {
                    effect: "background_removal",
                    background_removal: "remove_the_background"
                }
            ]
        })

        // Save the new image URL in the database
        await sql`
            INSERT INTO creations (user_id, prompt, content, type)
            VALUES (${userId}, 'Remove Background from image', ${secure_url}, 'image')
        `;

        // Send the image URL back to the client
        // Send the new image URL back to the client
        res.json({
            success: true,
            content: secure_url
        });

    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        });
    }
}


// This function removes a specified object from an uploaded image using Cloudinary's generative removal feature.
// Only premium users can use this feature.
export const removeImageObject = async (req, res) => {
    try {
        const { userId } = req.auth(); // Get the user's ID from authentication
        const { object } = req.body; // Get the object to remove from the request body
        const {image} = req.file;    // Get the uploaded image file
        const plan = req.plan;       // Get the user's plan (free or premium)

        // Only premium users can generate images
        // Only premium users can generate images
        if (plan !== 'premium') {
            return res.json({
                success: false,
                message: "Free users cannot generate images. Upgrade to premium for this feature."
            });
        }


        

        // Upload the image to Cloudinary and get its public ID
        const {public_id} = await cloudinary.uploader.upload(image.path)

        // Generate a new image URL with the specified object removed using Cloudinary's transformation
        const imageURL = cloudinary.url(public_id, {
            transformation: [
                {
                    effect: `gen_remove: ${object}`, // Remove the specified object
                }
            ],
            resource_type: 'image',
        })

        // Save the new image URL in the database
        await sql`
            INSERT INTO creations (user_id, prompt, content, type)
            VALUES (${userId}, ${`Removed ${object} from image`}, ${imageURL}, 'image')
        `;

        // Send the image URL back to the client
        // Send the new image URL back to the client
        res.json({
            success: true,
            content: imageURL
        });

    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        });
    }
}





// This function reviews a user's uploaded resume (PDF), generates AI feedback, and saves the review in the database.
// Only premium users can use this feature.
export const resumeReview = async (req, res) => {
    try {
        const { userId } = req.auth(); // Get the user's ID from authentication
        const {resume} = req.file;   // Get the uploaded resume file
        const plan = req.plan;       // Get the user's plan (free or premium)

        // Only premium users can generate images
        // Only premium users can use this feature
        if (plan !== 'premium') {
            return res.json({
                success: false,
                message: "Free users cannot generate images. Upgrade to premium for this feature."
            });
        }

        // Check if the resume file size exceeds 5MB
        if(resume.size > 5 * 1024 * 1024){
            return res.json({
                success: false,
                message: "Resume file size exceeds 5MB limit."
            });
        } 

        // Read the resume file into a buffer
        const dataBuffer = fs.readFileSync(resume.path);
        // Parse the PDF to extract text content
        const pdfData = await pdf(dataBuffer);

        // Create a prompt for the AI to review the resume
        const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume content:\n\n${pdfData.text}`;

        // Ask the AI to generate feedback for the resume
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const content = response.choices[0].message.content; // Get the feedback text from the AI response
        // Save the feedback in the database
        await sql`
            INSERT INTO creations (user_id, prompt, content, type)
            VALUES (${userId}, 'review the uploaded resume', ${content}, 'resume-review')
        `;

        // Send the feedback back to the client
        res.json({
            success: true,
            content
        });

    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        });
    }
}
// This file defines the API routes for AI features (article, blog title, image generation)
// Each route uses the auth middleware to check user authentication and plan

import express from 'express';
import { auth } from '../middlewares/auth.js';
import { generateArticle, generateBlogTitle, generateImage } from '../controllers/aiController.js';

const aiRouter = express.Router();

// Route to generate an article using AI
aiRouter.post('/generate-article', auth, generateArticle);
// Route to generate blog titles using AI
aiRouter.post('/generate-blog-title', auth, generateBlogTitle);
// Route to generate an image using AI (premium users only)
aiRouter.post('/generate-image', auth, generateImage);

export default aiRouter;
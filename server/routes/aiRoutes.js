// This file defines the API routes for AI features (article, blog title, image generation)
// Each route uses the auth middleware to check user authentication and plan

import express from 'express';
import { auth } from '../middlewares/auth.js';
import { generateArticle, generateBlogTitle, generateImage, removeImageBackground, removeImageObject, resumeReview } from '../controllers/aiController.js';
import { upload } from '../configs/multer.js';


const aiRouter = express.Router();

// Route to generate an article using AI
aiRouter.post('/generate-article', auth, generateArticle);
// Route to generate blog titles using AI
aiRouter.post('/generate-blog-title', auth, generateBlogTitle);
// Route to generate an image using AI (premium users only)
aiRouter.post('/generate-image', auth, generateImage);

aiRouter.post('/remove-image-background', upload.single('image'), auth, removeImageBackground);

aiRouter.post('/remove-image-object', upload.single('image'), auth, removeImageObject);

aiRouter.post('/resume-review', upload.single('resume'), auth, resumeReview);

export default aiRouter;
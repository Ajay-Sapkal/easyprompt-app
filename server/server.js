// Main server file: Sets up Express app, middleware, routes, and starts the server
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';

const app = express()

// Connect to Cloudinary for image uploads
await connectCloudinary();

// Enable CORS for cross-origin requests
app.use(cors())
// Parse incoming JSON requests
app.use(express.json())
// Clerk middleware for authentication
app.use(clerkMiddleware())

// Health check route
app.get('/', (req, res) => res.send('server is Live!'))

// Require authentication for all routes below
app.use(requireAuth())

// Mount AI feature routes under /api/ai
app.use('/api/ai', aiRouter)

const PORT = process.env.PORT || 3000;

// Start the server and listen on the specified port
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
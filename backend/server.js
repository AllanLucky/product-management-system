import dotenv from 'dotenv';
dotenv.config({ path: './config/config.env' }); // ✅ load env only once

import app from './app.js';
import { connectMongoDatabase } from './config/db.js';
import { v2 as cloudinary } from 'cloudinary';

// Connect to MongoDB
connectMongoDatabase();

// Handle uncaught exceptions (synchronous errors)
process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    console.error(`Server shutting down...`);
    process.exit(1);
});

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`🚀 Server running on port ${port} in ${process.env.NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    console.error(`Server shutting down...`);
    server.close(() => process.exit(1));
});

// Graceful shutdown on SIGTERM (e.g., Heroku/Render signals)
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Closing server...');
    server.close(() => {
        console.log('Server closed gracefully.');
        process.exit(0);
    });
});

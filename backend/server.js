import dotenv from 'dotenv';
dotenv.config({ path: './backend/config/config.env' }); // load env first

import app from './app.js';
import { connectMongoDatabase } from './config/db.js';
import { v2 as cloudinary } from 'cloudinary';

// Connect to MongoDB
connectMongoDatabase();

// Handle uncaught exception errors
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Server is shutting down due to uncaught exception`);
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
    console.log(`Server is running on Port ${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Server is shutting down due to unhandled promise rejection`);
    server.close(() => {
        process.exit(1);
    });
});

// Graceful shutdown on SIGTERM
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Closing server...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});



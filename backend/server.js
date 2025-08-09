// server.js
import dotenv from 'dotenv';
import app from './app.js';
import { connectMongoDatabase } from './config/db.js';
import { v2 as cloudinary } from 'cloudinary';

// 2. Connect to MongoDB
connectMongoDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

// handle uncaught exceptions (safety net for any sync errors you forgot to catch)
process.on('uncaughtException', (err) => {
    console.error(`❌ Uncaught Exception: ${err.message}`);
    // Gracefully close the server, then exit
    process.exit(1);
});

// 3. Start the Express server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
    console.log(`✅ Server is running on PORT ${PORT}`);
});

// 4. Handle unhandled promise rejections (safety net for any async errors you forgot to catch)
process.on('unhandledRejection', (err) => {
    console.error(`❌ Unhandled Promise Rejection: ${err.message}`);
    // Gracefully close the server, then exit
    server.close(() => process.exit(1));
});

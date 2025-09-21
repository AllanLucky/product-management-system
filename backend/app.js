import express from 'express';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import errorHandlerMiddleware from './middleware/error.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables first
if (process.env.NODE_ENV !== "PRODUCTION") {
    dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });
}

const app = express();

// ---------- Middleware ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

// ---------- API Routes ----------
app.use('/api/v1', productRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', transactionRoutes);

// ---------- Serve Frontend (Vite build) ----------
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// SPA fallback: only non-API routes should go to index.html
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next(); // let API routes continue
    }
    res.sendFile(path.resolve(frontendPath, 'index.html'));
});

// ---------- Error Handler ----------
app.use(errorHandlerMiddleware);

export default app;

import express from 'express';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import transactionRoutes from './routes/transactionRoutes.js'; // ✅ new route
import errorHandlerMiddleware from './middleware/error.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

// Routes
app.use('/api/v1', productRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', transactionRoutes);
app.use('/receipts', express.static(path.join(__dirname, 'receipts')));

// Error handler middleware (keep it last)
app.use(errorHandlerMiddleware);

export default app;



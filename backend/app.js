import express from 'express';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import errorHandlerMiddleware from './middleware/error.js';

const app = express();

// Middleware
app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: true })); // parse URL-encoded bodies
app.use(cookieParser());
app.use(fileUpload());

// Routes
app.use('/api/v1', productRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', transactionRoutes); // M-Pesa transactions

// Error handler (last)
app.use(errorHandlerMiddleware);

export default app;

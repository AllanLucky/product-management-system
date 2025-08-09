import express from 'express';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import errorHandlerMiddleware from './middleware/error.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';


const app = express();

// Middleware to parse JSON and  cookies requests
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());


// Routes
app.use('/api/v1', productRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', orderRoutes)



// Global Error Handler (must be last)
app.use(errorHandlerMiddleware);

export default app;



import mongoose from "mongoose";

export const connectMongoDatabase = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`✅ MongoDB connected with server: ${connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB connection failed: ${error.message}`);
        process.exit(1); // Exit the app if connection fails
    }
};

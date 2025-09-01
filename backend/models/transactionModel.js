import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    productName: { type: String, required: true },
    status: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending"
    },
    merchantRequestId: { type: String, index: true },
    checkoutRequestId: { type: String, index: true },
    resultCode: String,
    resultDesc: String,
    mpesaReceiptNumber: String,  // Safaricom returns this on success
    transactionDate: String,     // YYYYMMDDHHMMSS format from Safaricom
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // optional
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);



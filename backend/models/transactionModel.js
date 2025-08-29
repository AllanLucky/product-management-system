import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    productName: { type: String, required: true },
    status: { type: String, default: "pending" }, // pending, success, failed
    merchantRequestId: String,
    checkoutRequestId: String,
    resultCode: String,
    resultDesc: String
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);


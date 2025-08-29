import express from "express";
import { startPayment, paymentNotification } from "../controllers/transactionController.js"

const router = express.Router();

// Route to start a new STK Push transaction
router.post("/payments/request", startPayment);

// Route to handle asynchronous M-Pesa payment notifications (callback)
router.post("/payments/notification", paymentNotification);

export default router;

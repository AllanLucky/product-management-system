import express from "express";
import { processPayment, paymentNotification } from "../controllers/transactionController.js";
import { verifyUserAuth } from "../middleware/userAuth.js";

const router = express.Router();

// Protected route: only authenticated users can initiate payment
router.post("/transaction/process", verifyUserAuth, processPayment);

// Callback route: Safaricom M-Pesa will call this, no auth required
router.post("/transaction/notify", verifyUserAuth, paymentNotification);

export default router;


import Transaction from "../models/transactionModel.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import { generateStkPush, getAccessToken } from "../utils/mpesaService.js";
import { generateReceipt } from "../utils/receiptGenerator.js";

/**
 * Controller to initiate M-Pesa STK Push payment
 */
export const processPayment = handleAsyncError(async (req, res) => {
    // Get phoneNumber from frontend (order confirmation)
    const { phoneNumber, amount, productName, customDesc } = req.body;

    // Validate required fields
    if (!phoneNumber || !amount || !productName) {
        return res.status(400).json({
            success: false,
            error: "phoneNumber, amount, and productName are required.",
        });
    }

    // Get access token
    const accessToken = await getAccessToken();
    if (!accessToken) throw new Error("Failed to obtain access token");

    // Initiate STK Push using the phone number from order confirmation
    const stkResponse = await generateStkPush(phoneNumber, amount, productName, customDesc, accessToken);
    console.log("STK Push Response:", stkResponse);

    if (!stkResponse || stkResponse.ResponseCode !== "0") {
        return res.status(400).json({
            success: false,
            error: stkResponse?.errorMessage || "Failed to initiate STK Push",
        });
    }

    // Create transaction object
    const transactionData = {
        phoneNumber,
        amount,
        productName,
        description: customDesc || `Payment for ${productName}`,
        status: "pending",
        merchantRequestId: stkResponse.MerchantRequestID,
        checkoutRequestId: stkResponse.CheckoutRequestID,
    };

    // Save it to the database
    const transaction = await Transaction.create(transactionData);

    // Return response with exact product name
    res.status(200).json({
        success: true,
        message: "Your M-Pesa payment request has been successfully initiated. Please check your phone to complete the transaction.",
        productName: transaction.productName, // exact product name
        order: transaction, // returning saved transaction
    });
});

/**
 * Controller to handle M-Pesa callback notifications
 */
export const paymentNotification = handleAsyncError(async (req, res) => {
    const callbackData = req.body;
    console.log("M-Pesa Callback Received:", JSON.stringify(callbackData, null, 2));

    const stkCallback = callbackData?.Body?.stkCallback;
    if (!stkCallback) {
        return res.status(400).json({ success: false, error: "Invalid callback data" });
    }

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

    const transaction = await Transaction.findOne({ checkoutRequestId: CheckoutRequestID });
    if (!transaction) {
        return res.status(404).json({ success: false, error: "Transaction not found" });
    }

    transaction.status = ResultCode === 0 ? "success" : "failed";
    transaction.resultDescription = ResultDesc;

    if (ResultCode === 0 && CallbackMetadata?.Item) {
        const items = Object.fromEntries(CallbackMetadata.Item.map((i) => [i.Name, i.Value]));
        transaction.mpesaReceiptNumber = items.MpesaReceiptNumber || null;
        transaction.transactionDate = items.TransactionDate || null;
        transaction.amountPaid = items.Amount || transaction.amount;

        // Generate receipt PDF and store path
        transaction.receiptPath = await generateReceipt(transaction);
    }

    await transaction.save();

    return res.status(200).json({
        success: true,
        message: "Callback processed successfully",
        productName: transaction.productName, // exact product name
        receiptPath: transaction.receiptPath ? `/receipts/${transaction.checkoutRequestId}.pdf` : null,
    });
});

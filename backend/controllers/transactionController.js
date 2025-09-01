import Transaction from "../models/transactionModel.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import { generateStkPush, getAccessToken } from "../utils/mpesaService.js";
import { generateReceipt } from "../utils/receiptGenerator.js";

/**
 * Initiate M-Pesa STK Push payment
 */
export const processPayment = handleAsyncError(async (req, res) => {
    const { phoneNumber, amount, productName, customDesc } = req.body;

    if (!phoneNumber || !amount || !productName) {
        return res.status(400).json({
            success: false,
            error: "Phone number, amount, and product name are required.",
        });
    }

    const accessToken = await getAccessToken();
    if (!accessToken) throw new Error("Failed to obtain access token from Safaricom.");

    const stkResponse = await generateStkPush(phoneNumber, amount, productName, customDesc, accessToken);
    console.log("STK Push Response:", stkResponse);

    if (!stkResponse || stkResponse.ResponseCode !== "0") {
        return res.status(400).json({
            success: false,
            error: stkResponse?.errorMessage ||
                "M-Pesa transaction could not be processed. Check your phone number and try again.",
        });
    }

    const transactionData = {
        phoneNumber,
        amount,
        productName,
        description: customDesc || `Payment for ${productName}`,
        status: "pending",
        merchantRequestId: stkResponse.MerchantRequestID,
        checkoutRequestId: stkResponse.CheckoutRequestID,
    };

    const transaction = await Transaction.create(transactionData);

    res.status(200).json({
        success: true,
        message: "M-Pesa payment request initiated. Check your phone to complete the transaction.",
        productName: transaction.productName,
        order: transaction,
    });
});

/**
 * Handle M-Pesa callback notifications
 */
export const paymentNotification = handleAsyncError(async (req, res) => {
    const callbackData = req.body;
    console.log("M-Pesa Callback Received:", JSON.stringify(callbackData, null, 2));

    const stkCallback = callbackData?.Body?.stkCallback;
    if (!stkCallback) return res.status(400).json({ success: false, error: "Invalid callback data." });

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;
    const transaction = await Transaction.findOne({ checkoutRequestId: CheckoutRequestID });

    if (!transaction) return res.status(404).json({ success: false, error: "Transaction not found." });

    // Update transaction status
    transaction.status = ResultCode === 0 ? "success" : "failed";
    transaction.resultCode = ResultCode;
    transaction.resultDesc = ResultDesc;

    if (ResultCode === 0 && CallbackMetadata?.Item) {
        const items = Object.fromEntries(CallbackMetadata.Item.map(i => [i.Name, i.Value]));
        transaction.mpesaReceiptNumber = items.MpesaReceiptNumber || null;
        transaction.transactionDate = items.TransactionDate || null;
        transaction.amountPaid = items.Amount || transaction.amount;

        // Generate receipt PDF
        transaction.receiptPath = await generateReceipt(transaction);
    }

    await transaction.save();

    res.status(200).json({
        success: true,
        message: transaction.status === "success" ? "Payment completed successfully." : "Transaction failed or cancelled.",
        productName: transaction.productName,
        receiptPath: transaction.receiptPath ? `/receipts/${transaction.checkoutRequestId}.pdf` : null,
        order: transaction,
    });
});

/**
 * Verify payment status (frontend can poll this)
 */
export const verifyPayment = handleAsyncError(async (req, res) => {
    const { checkoutRequestId } = req.params;

    const transaction = await Transaction.findOne({ checkoutRequestId });
    if (!transaction) return res.status(404).json({ success: false, error: "Transaction not found." });

    res.status(200).json({
        success: true,
        status: transaction.status.toUpperCase(),
        productName: transaction.productName,
        order: transaction,
    });
});

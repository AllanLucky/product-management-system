import { generateStkPush } from "../utils/mpesaServices.js";
import Transaction from "../models/transactionModel.js";
import { generateReceipt } from "../utils/receiptGenerator.js";

/**
 * Controller for initiating M-Pesa STK Push
 */
export const startPayment = async (req, res) => {
    try {
        const { accessToken, phoneNumber, amount, productName, customDesc } = req.body;

        // ✅ Validate required fields
        if (!accessToken || !phoneNumber || !amount || !productName) {
            return res.status(400).json({
                success: false,
                error: "Payment request failed: Please provide all required fields — accessToken, phoneNumber, amount, and productName."
            });
        }

        // ✅ Call Safaricom API via service
        const stkResponse = await generateStkPush(
            accessToken,
            phoneNumber,
            amount,
            productName,
            customDesc
        );

        // ✅ Handle failed response from Safaricom
        if (!stkResponse || stkResponse.ResponseCode !== "0") {
            return res.status(400).json({
                success: false,
                error: stkResponse?.errorMessage || "Failed to initiate STK Push"
            });
        }

        // ✅ Save to DB
        const transaction = await Transaction.create({
            phoneNumber,
            amount,
            productName,
            description: customDesc || "No description",
            status: "pending",
            merchantRequestId: stkResponse.MerchantRequestID,
            checkoutRequestId: stkResponse.CheckoutRequestID
        });

        return res.status(200).json({
            success: true,
            message: "STK Push initiated successfully",
            data: transaction
        });

    } catch (error) {
        console.error("STK Push Error:", error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
            details: error.message
        });
    }
};

/**
 * Controller for handling M-Pesa Callback Notification
 * Generates a PDF receipt if payment is successful
 */
export const paymentNotification = async (req, res) => {
    try {
        const callbackData = req.body;
        console.log("📩 M-Pesa Callback Received:", JSON.stringify(callbackData, null, 2));

        const stkCallback = callbackData?.Body?.stkCallback;
        if (!stkCallback) {
            return res.status(400).json({ success: false, error: "Invalid callback data" });
        }

        const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

        // ✅ Find the matching transaction
        const transaction = await Transaction.findOne({ checkoutRequestId: CheckoutRequestID });
        if (!transaction) {
            return res.status(404).json({ success: false, error: "Transaction not found" });
        }

        // ✅ Update transaction status
        transaction.status = ResultCode === 0 ? "success" : "failed";
        transaction.resultDescription = ResultDesc;

        // ✅ Extract metadata if payment was successful
        if (ResultCode === 0 && CallbackMetadata?.Item) {
            const items = {};
            CallbackMetadata.Item.forEach(i => items[i.Name] = i.Value);

            transaction.mpesaReceiptNumber = items.MpesaReceiptNumber || null;
            transaction.transactionDate = items.TransactionDate || null;
            transaction.amountPaid = items.Amount || transaction.amount;

            // ✅ Generate receipt PDF
            const receiptPath = await generateReceipt(transaction);
            transaction.receiptPath = receiptPath; // store path in DB
        }

        await transaction.save();

        // ✅ Respond to Safaricom callback
        return res.status(200).json({
            success: true,
            message: "Callback processed successfully",
            receiptPath: transaction.receiptPath ? `/receipts/${transaction.checkoutRequestId}.pdf` : null
        });

    } catch (error) {
        console.error("❌ Callback Error:", error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
            details: error.message
        });
    }
};

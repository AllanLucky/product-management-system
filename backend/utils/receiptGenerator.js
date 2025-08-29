import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateReceipt = async (transaction) => {
    const receiptsDir = path.join("./receipts");

    // Create receipts folder if it doesn't exist
    if (!fs.existsSync(receiptsDir)) {
        fs.mkdirSync(receiptsDir);
    }

    const filePath = path.join(receiptsDir, `${transaction.checkoutRequestId}.pdf`);
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text("Payment Receipt", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Transaction ID: ${transaction.checkoutRequestId}`);
    doc.text(`MPESA Receipt Number: ${transaction.mpesaReceiptNumber}`);
    doc.text(`Phone Number: ${transaction.phoneNumber}`);
    doc.text(`Product: ${transaction.productName}`);
    doc.text(`Amount Paid: KES ${transaction.amountPaid}`);
    doc.text(`Transaction Date: ${transaction.transactionDate}`);
    doc.text(`Status: ${transaction.status}`);

    doc.end();

    return filePath; // return path to store in DB or send to frontend
};

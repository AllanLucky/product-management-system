export async function generateStkPush(accessToken, phoneNumber, amount, productName, customDesc) {
    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const callbackurl = process.env.MPESA_CALLBACK_URL;

    const generateTimestamp = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    };

    const timestamp = generateTimestamp();
    const password = Buffer.from(shortcode + passkey + timestamp).toString("base64");

    const requestBody = {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: shortcode,
        PhoneNumber: phoneNumber,
        CallBackURL: callbackurl,
        AccountReference: productName,
        TransactionDesc: customDesc || `Payment of KES ${amount} for ${productName}`,
    };

    try {
        const response = await fetch(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            }
        );

        return await response.json();
    } catch (error) {
        console.error("❌ STK Push Request Failed:", error);
        throw error;
    }
}


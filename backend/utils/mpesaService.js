import dotenv from 'dotenv';
dotenv.config();

/**
 * Fetches M-Pesa access token from Safaricom API
 */
export async function getAccessToken() {
    try {
        const consumerKey = process.env.MPESA_CONSUMER_KEY;
        const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

        if (!consumerKey || !consumerSecret) {
            throw new Error(
                "M-Pesa consumer key or secret is missing in environment variables. Please configure them correctly."
            );
        }

        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

        const response = await fetch(
            "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
            { headers: { "Authorization": `Basic ${auth}` } }
        );

        if (!response.ok) {
            throw new Error(
                `Failed to fetch access token from Safaricom API. Status: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        if (!data.access_token) {
            throw new Error(
                "Safaricom API did not return an access token. Please check your credentials."
            );
        }

        return data.access_token;
    } catch (error) {
        console.error("Error obtaining M-Pesa access token:", error.message);
        throw new Error("Unable to connect to M-Pesa API. Please try again later.");
    }
}

/**
 * Initiates M-Pesa STK Push transaction
 */
export async function generateStkPush(phoneNumber, amount, productName, customDesc = "", accessToken) {
    try {
        const shortcode = process.env.MPESA_SHORTCODE;
        const passkey = process.env.MPESA_PASSKEY;
        const callbackUrl = process.env.MPESA_CALLBACK_URL;

        if (!shortcode || !passkey || !callbackUrl) {
            throw new Error(
                "M-Pesa shortcode, passkey, or callback URL is missing in environment variables. Please configure them correctly."
            );
        }

        // Format timestamp
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
        const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');

        // Format phone number: remove + or spaces
        const formattedPhoneNumber = phoneNumber.replace(/\D/g, "");

        // Validate local number length for Kenya (should be 12 digits including country code 254)
        if (!/^2547\d{8}$/.test(formattedPhoneNumber)) {
            throw new Error(
                "Invalid phone number! Use format 2547XXXXXXXX for Kenya."
            );
        }

        const requestBody = {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: formattedPhoneNumber,
            PartyB: shortcode,
            PhoneNumber: formattedPhoneNumber,
            CallBackURL: callbackUrl,
            AccountReference: productName,
            TransactionDesc: customDesc || `Payment of KES ${amount} for ${productName}`,
        };

        const response = await fetch(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData?.errorMessage || "Your M-Pesa transaction could not be processed. Please check your details and try again."
            );
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error generating STK Push:", error.message);
        throw new Error(
            error.message || "Your M-Pesa transaction could not be processed. Please try again."
        );
    }
}

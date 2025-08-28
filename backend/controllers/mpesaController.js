import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" }); // load your env file

// Function to generate access token
export const getAccessToken = async () => {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

    try {
        const response = await axios.get(
            "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
            {
                headers: { Authorization: `Basic ${auth}` },
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error("Error fetching access token:", error.response?.data || error.message);
        throw error;
    }
};

// STK Push Controller
export const stkPush = async (req, res) => {
    try {
        const token = await getAccessToken();

        // Generate timestamp
        const timestamp = new Date()
            .toISOString()
            .replace(/[^0-9]/g, "")
            .slice(0, 14);

        // Generate password (shortcode + passkey + timestamp, base64 encoded)
        const password = Buffer.from(
            process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timestamp
        ).toString("base64");

        const response = await axios.post(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            {
                BusinessShortCode: process.env.MPESA_SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: "CustomerPayBillOnline",
                Amount: req.body.amount,
                PartyA: req.body.phone,   // Customer phone number
                PartyB: process.env.MPESA_SHORTCODE,
                PhoneNumber: req.body.phone,
                CallBackURL: process.env.MPESA_CALLBACK_URL,
                AccountReference: "Order123",
                TransactionDesc: "Payment for goods",
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        res.json(response.data);
    } catch (error) {
        console.error("STK Push error:", error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

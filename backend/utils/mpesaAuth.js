export async function getAccessToken() {
    try {
        const consumerKey = process.env.MPESA_CONSUMER_KEY;
        const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

        if (!consumerKey || !consumerSecret) {
            throw new Error("Missing M-Pesa consumer key or secret in environment variables.");
        }

        // Convert to base64
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

        const response = await fetch(
            "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
            {
                method: "GET",
                headers: {
                    "Authorization": `Basic ${auth}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch token: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.access_token) {
            throw new Error("No access token returned from Safaricom API");
        }

        return data.access_token;

    } catch (error) {
        console.error("Error getting M-Pesa access token:", error.message);
        throw error;
    }
}

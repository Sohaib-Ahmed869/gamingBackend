const axios = require("axios");

const FATOORAH_BASE_URL =
  process.env.FATOORAH_BASE_URL || "https://apitest.myfatoorah.com";
const FATOORAH_API_KEY =
  process.env.FATOORAH_API_KEY ||
  "rLtt6JWvbUHDDhsZnfpAhpYk4dxYDQkbcPTyGaKp2TYqQgG7FGZ5Th_WD53Oq8Ebz6A53njUoo1w3pjU1D4vs_ZMqFiz_j0urb_BH9Oq9VZoKFoJEDAbRZepGcQanImyYrry7Kt6MnMdgfG5jn4HngWoRdKduNNyP4kzcp3mRv7x00ahkm9LAK7ZRieg7k1PDAnBIOG3EyVSJ5kK4WLMvYr7sCwHbHcu4A5WwelxYK0GMJy37bNAarSJDFQsJ2ZvJjvMDmfWwDVFEVe_5tOomfVNt6bOg9mexbGjMrnHBnKnZR1vQbBtQieDlQepzTZMuQrSuKn-t5XZM7V6fCW7oP-uXGX-sMOajeX65JOf6XVpk29DP6ro8WTAflCDANC193yof8-f5_EYY-3hXhJj7RBXmizDpneEQDSaSz5sFk0sV5qPcARJ9zGG73vuGFyenjPPmtDtXtpx35A-BVcOSBYVIWe9kndG3nclfefjKEuZ3m4jL9Gg1h2JBvmXSMYiZtp9MR5I6pvbvylU_PP5xJFSjVTIz7IQSjcVGO41npnwIxRXNRxFOdIUHn0tjQ-7LwvEcTXyPsHXcMD8WtgBh-wxR8aKX7WPSsT1O8d8reb2aR7K3rkV3K82K_0OgawImEpwSvp9MNKynEAJQS6ZHe_J_l77652xwPNxMRTMASk1ZsJL";

if (!FATOORAH_API_KEY) {
  throw new Error("FATOORAH_API_KEY is required");
}

const fatoorahAxios = axios.create({
  baseURL: FATOORAH_BASE_URL,
  headers: {
    Authorization: `Bearer ${FATOORAH_API_KEY}`,
    "Content-Type": "application/json",
  },
});

const createPayment = async ({
  amount,
  customerEmail,
  customerName,
  productName,
  successUrl,
  errorUrl,
}) => {
  try {
    const payload = {
      PaymentMethodId: 1,
      CustomerName: customerName,
      DisplayCurrencyIso: "KWD",
      MobileCountryCode: "+965",
      CustomerEmail: customerEmail,
      InvoiceValue: amount,
      CallBackUrl: successUrl,
      ErrorUrl: errorUrl,
      Language: "en",
      CustomerReference: `REF_${Date.now()}`,
      InvoiceItems: [
        {
          ItemName: productName,
          Quantity: 1,
          UnitPrice: amount,
        },
      ],
      NotificationOption: "Lnk",
    };

    const response = await fatoorahAxios.post("/v2/SendPayment", payload);

    console.log("Fatoorah payment creation response:", response.data);

    return {
      invoiceId: response.data.Data.InvoiceId,
      paymentUrl: response.data.Data.InvoiceURL,
    };
  } catch (error) {
    console.error(
      "Fatoorah payment creation error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create payment"
    );
  }
};

const verifyPaymentStatus = async (paymentId) => {
  try {
    const response = await fatoorahAxios.post("/v2/GetPaymentStatus", {
      Key: paymentId,
      KeyType: "PaymentId",
    });

    const paymentData = response.data.Data;
    console.log("Fatoorah payment verification response:", paymentData);
    return {
      isSuccess: paymentData.InvoiceStatus === "Paid",
      paymentId: paymentData.InvoiceId,
      invoiceStatus: paymentData.InvoiceStatus,
      paymentMethod: paymentData.PaymentGateway,
      paymentAmount: paymentData.InvoiceValue,
      customerName: paymentData.CustomerName,
      customerEmail: paymentData.CustomerEmail,
      paymentDate: paymentData.CreatedDate,
    };
  } catch (error) {
    console.error(
      "Fatoorah payment verification error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to verify payment"
    );
  }
};

module.exports = {
  createPayment,
  verifyPaymentStatus,
};

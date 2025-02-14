// controllers/paymentController.js
const { createPayment, verifyPaymentStatus } = require('../services/fatoorahService');

const initiatePayment = async (req, res, next) => {
  try {
    const {
      amount,
      customerEmail,
      customerName,
      productName,
      successUrl,
      errorUrl
    } = req.body;

    // Validate required fields
    if (!amount || !customerEmail || !customerName || !productName) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    const paymentData = await createPayment({
      amount,
      customerEmail,
      customerName,
      productName,
      successUrl,
      errorUrl
    });

    res.json({
      status: 'success',
      data: paymentData
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        status: 'error',
        message: 'Payment ID is required'
      });
    }

    const verificationData = await verifyPaymentStatus(paymentId);
    res.json({
      status: 'success',
      data: verificationData
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  initiatePayment,
  verifyPayment
};

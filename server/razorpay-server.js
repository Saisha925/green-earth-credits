const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Razorpay Instance - Using Test Credentials
// Replace these with your actual credentials from Razorpay dashboard
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5MMOk7YCFYZ',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'tFt5d5cKDHHVF0iH4F2Xg7hL',
});

/**
 * Create Razorpay Order
 * POST /api/razorpay/create-order
 */
app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    // Validate input
    if (!amount || !currency || !receipt) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: amount, currency, receipt',
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0',
      });
    }

    // Create order with Razorpay
    const options = {
      amount: amount, // Amount in paise (smallest currency unit)
      currency: currency,
      receipt: receipt,
      notes: {
        key_name: 'Green Earth Credits - Carbon Retirement',
        timestamp: new Date().toISOString(),
      },
    };

    const order = await razorpayInstance.orders.create(options);

    console.log('[Razorpay] Order created:', order.id);

    res.status(200).json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (error) {
    console.error('[Razorpay] Error creating order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order',
    });
  }
});

/**
 * Verify Razorpay Payment
 * POST /api/razorpay/verify-payment
 */
app.post('/api/razorpay/verify-payment', (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // Validate input
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification data',
      });
    }

    // Create the signature for verification
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', razorpayInstance.key_secret)
      .update(body.toString())
      .digest('hex');

    // Compare signatures
    const isValidSignature = expectedSignature === razorpay_signature;

    console.log('[Razorpay] Payment verification:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      isValid: isValidSignature,
    });

    if (isValidSignature) {
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          verifiedAt: new Date().toISOString(),
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment signature verification failed',
      });
    }
  } catch (error) {
    console.error('[Razorpay] Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed',
    });
  }
});

/**
 * Health Check
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Razorpay backend server is running',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`[Server] Razorpay backend running on http://localhost:${PORT}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[Server] Using Razorpay Key ID: ${razorpayInstance.key_id.substring(0, 10)}...`);
});

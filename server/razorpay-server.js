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
 * Carbon Authentication Utilities
 */

const CARBONMARK_BASE_URL = 'https://v18.api.carbonmark.com';
const CARBONMARK_API_KEY = 'cm_api_sandbox_13d435c7-525d-455e-ad44-d28a70522a5c';

const carbonmarkHeaders = {
  Authorization: `Bearer ${CARBONMARK_API_KEY}`,
  Accept: 'application/json',
};

/**
 * Calculate similarity between two strings
 */
function calculateSimilarity(a, b) {
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();

  if (!aLower || !bLower) return 0;

  const matches = findMatches(aLower, bLower);
  const totalLength = Math.max(aLower.length, bLower.length);

  return totalLength > 0 ? matches / totalLength : 0;
}

/**
 * Find matching characters between two strings
 */
function findMatches(a, b) {
  let matches = 0;
  const shorter = a.length < b.length ? a : b;
  const longer = a.length < b.length ? b : a;

  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) {
      matches++;
    }
  }

  return matches;
}

/**
 * Fetch Carbonmark listings
 */
async function fetchCarbonmarkListings() {
  try {
    const url = `${CARBONMARK_BASE_URL}/listings`;
    const response = await fetch(url, {
      headers: carbonmarkHeaders,
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Carbonmark API error: ${response.statusText}`);
    }

    const payload = await response.json();

    // Handle both list and wrapped responses
    if (Array.isArray(payload)) {
      return payload;
    } else if (typeof payload === 'object' && payload.data) {
      return payload.data;
    }

    return [];
  } catch (error) {
    console.error('[Carbon] Error fetching Carbonmark listings:', error);
    throw error;
  }
}

/**
 * Authenticate certificate against Carbonmark data
 */
function authenticateCertificate(cert, listings) {
  let bestMatch = null;
  let bestScore = 0;

  for (const listing of listings) {
    const project = listing.project || {};
    let score = 0;

    // Project name (50%)
    score += calculateSimilarity(cert.project_name || '', project.name || '') * 0.5;

    // Vintage (20%)
    if (cert.vintage && String(project.vintage) === cert.vintage) {
      score += 0.2;
    }

    // Country (15%)
    if (cert.country && cert.country.toLowerCase() === (project.country || '').toLowerCase()) {
      score += 0.15;
    }

    // Methodology (15%)
    if (cert.methodology === project.methodology) {
      score += 0.15;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = listing;
    }
  }

  return {
    authenticated: bestScore >= 0.75,
    confidence: Math.round(bestScore * 100) / 100,
    matched_credit_id: bestMatch?.creditId || null,
    matched_project: bestMatch?.project || null,
  };
}

/**
 * Authenticate Carbon Credit
 * POST /api/carbon/authenticate
 */
app.post('/api/carbon/authenticate', async (req, res) => {
  try {
    const { certificate } = req.body;

    // Validate input
    if (!certificate || typeof certificate !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid certificate data. Expected object with certificate fields.',
      });
    }

    console.log('[Carbon] Authenticating certificate:', certificate);

    // Fetch Carbonmark listings
    const listings = await fetchCarbonmarkListings();
    console.log('[Carbon] Fetched listings:', listings.length);

    // Authenticate
    const result = authenticateCertificate(certificate, listings);
    console.log('[Carbon] Authentication result:', result);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[Carbon] Error authenticating certificate:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to authenticate certificate',
    });
  }
});

/**
 * Extract Certificate Fields
 * POST /api/carbon/extract
 */
app.post('/api/carbon/extract', (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid text. Expected string.',
      });
    }

    const patterns = {
      project_name: /Project Name:\s*(.+)/i,
      vintage: /Vintage Year:\s*(\d{4})/i,
      country: /Country:\s*(.+)/i,
      methodology: /Methodology:\s*(.+)/i,
    };

    const fields = {};

    for (const [key, pattern] of Object.entries(patterns)) {
      const match = text.match(pattern);
      if (match) {
        fields[key] = match[1].trim();
      }
    }

    console.log('[Carbon] Extracted fields:', fields);

    res.status(200).json({
      success: true,
      data: fields,
    });
  } catch (error) {
    console.error('[Carbon] Error extracting fields:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to extract fields',
    });
  }
});

/**
 * Health Check
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Razorpay + Carbon Auth backend server is running',
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

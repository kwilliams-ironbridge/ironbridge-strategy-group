import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Etsy API configuration
const ETSY_API_BASE = 'https://openapi.etsy.com/v3';
const ETSY_CLIENT_ID = process.env.ETSY_CLIENT_ID;
const ETSY_CLIENT_SECRET = process.env.ETSY_CLIENT_SECRET;
const ETSY_REDIRECT_URI = process.env.ETSY_REDIRECT_URI || `http://localhost:${PORT}/auth/callback`;

// Middleware
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// OAuth callback handler
app.get('/auth/callback', async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  try {
    const tokenResponse = await axios.post(
      `${ETSY_API_BASE}/oauth/token`,
      {
        grant_type: 'authorization_code',
        client_id: ETSY_CLIENT_ID,
        client_secret: ETSY_CLIENT_SECRET,
        redirect_uri: ETSY_REDIRECT_URI,
        code,
      }
    );

    const accessToken = tokenResponse.data.access_token;
    res.json({
      success: true,
      access_token: accessToken,
      message: 'OAuth authentication successful. Store this token securely.',
    });
  } catch (error) {
    console.error('OAuth token exchange failed:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to exchange authorization code' });
  }
});

// Get Etsy shop products
app.get('/api/products', async (req, res) => {
  const accessToken = req.headers.authorization?.replace('Bearer ', '');

  if (!accessToken) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const shopResponse = await axios.get(
      `${ETSY_API_BASE}/application/shop`,
      {
        headers: {
          'x-api-key': ETSY_CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const shopId = shopResponse.data.shop_id;

    const productsResponse = await axios.get(
      `${ETSY_API_BASE}/shops/${shopId}/listings/active`,
      {
        headers: {
          'x-api-key': ETSY_CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          limit: 100,
        },
      }
    );

    res.json({
      success: true,
      shop_id: shopId,
      products: productsResponse.data.results || [],
      count: productsResponse.data.results?.length || 0,
    });
  } catch (error) {
    console.error('Failed to fetch products:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch products from Etsy',
      details: error.response?.data || error.message,
    });
  }
});

// Get Etsy OAuth authorization URL
app.get('/auth/url', (req, res) => {
  const scopes = ['shops:read', 'listings:read'];
  const authUrl = `https://www.etsy.com/oauth/connect?response_type=code&client_id=${ETSY_CLIENT_ID}&redirect_uri=${encodeURIComponent(ETSY_REDIRECT_URI)}&scope=${scopes.join('%20')}`;

  res.json({
    authorization_url: authUrl,
    message: 'Visit this URL to authorize the connector with Etsy',
  });
});

// Serve the marketing site
app.use(express.static('.'));

// Start server
app.listen(PORT, () => {
  console.log(`Etsy connector server running on http://localhost:${PORT}`);
  console.log(`OAuth callback URI: ${ETSY_REDIRECT_URI}`);
});

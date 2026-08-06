# Etsy Connector Setup Guide

This document explains how to set up and use the Etsy product connector for the Ironbridge Strategy Group marketing site.

## Prerequisites

- Node.js 16+ installed
- An Etsy Shop
- Etsy API credentials (Client ID and Client Secret)

## Step 1: Get Etsy API Credentials

1. Go to [Etsy Developer Portal](https://www.etsy.com/developers)
2. Sign in with your Etsy account
3. Create a new application:
   - App name: "Ironbridge Etsy Connector"
   - App description: "Product synchronization for Ironbridge Strategy Group"
4. Accept the terms and create the app
5. You'll receive:
   - **Keystring** (Client ID)
   - **Shared Secret** (Client Secret)
6. Set your OAuth Redirect URI to: `http://localhost:3000/auth/callback` (adjust if using a different port or domain)

## Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Etsy credentials:
   ```
   ETSY_CLIENT_ID=your_keystring_here
   ETSY_CLIENT_SECRET=your_shared_secret_here
   ETSY_REDIRECT_URI=http://localhost:3000/auth/callback
   ```

3. (Optional) Change the PORT if needed

**Important:** Never commit `.env` to git. It contains secrets.

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Start the Server

### Development (with auto-restart):
```bash
npm run dev
```

### Production:
```bash
npm start
```

The server will run on `http://localhost:3000` (or your configured PORT).

## Using the Connector

### 1. Get Authorization URL

```bash
curl http://localhost:3000/auth/url
```

Response:
```json
{
  "authorization_url": "https://www.etsy.com/oauth/connect?...",
  "message": "Visit this URL to authorize the connector with Etsy"
}
```

Visit the URL in your browser. Etsy will ask you to authorize the app with your shop.

### 2. Handle OAuth Callback

After authorization, Etsy redirects to `/auth/callback` with an authorization code. The server automatically exchanges it for an access token and returns it.

Save the `access_token` from the response — you'll need it to fetch products.

### 3. Fetch Products from Etsy

```bash
curl http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

Response:
```json
{
  "success": true,
  "shop_id": 12345678,
  "products": [
    {
      "listing_id": 999999999,
      "title": "Product Title",
      "description": "Product description",
      "price": 1500,
      "currency_code": "USD",
      "url": "https://www.etsy.com/listing/...",
      ...
    }
  ],
  "count": 25
}
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/auth/url` | Get Etsy OAuth authorization URL |
| GET | `/auth/callback` | OAuth callback handler (Etsy redirects here) |
| GET | `/api/products` | Fetch active listings from Etsy shop |

## Security Notes

- **Never commit `.env` with real credentials**
- Store access tokens securely (database, encrypted cache, etc.)
- Access tokens have an expiration time; implement token refresh for production
- Rotate your Etsy API credentials regularly
- Use HTTPS in production

## Troubleshooting

### "Invalid client ID" error
- Verify your ETSY_CLIENT_ID matches your app's keystring
- Check that you copied the full ID without extra spaces

### "Redirect URI mismatch" error
- Ensure the ETSY_REDIRECT_URI in `.env` matches what you configured in the Etsy Developer Portal
- For production, update to your actual domain

### "Failed to fetch products" error
- Verify the access token is valid and not expired
- Check that the Authorization header format is: `Bearer YOUR_TOKEN`

## Next Steps

- Implement database storage for products
- Add token refresh logic for production use
- Create scheduled syncs to update products periodically
- Integrate product data into the marketing site

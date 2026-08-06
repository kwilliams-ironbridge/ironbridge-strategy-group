# Ironbridge Strategy Group - Project Log

## 2026-08-06

### Etsy Connector Implementation (Branch: `claude/etsy-connector-creation-yuf6b1`)

**Completed Tasks:**
- Set up Express.js server for Etsy API integration
- Implemented OAuth2 authentication flow for Etsy
- Created `/api/products` endpoint to fetch active Etsy shop listings
- Set up environment variable configuration with `.env.example`
- Created comprehensive setup and usage documentation in `ETSY_CONNECTOR.md`
- Added `.gitignore` to protect sensitive credentials

**Files Created:**
- `server.js` - Main Express server with OAuth2 and product sync logic
- `package.json` - Node.js dependencies (Express, Axios, dotenv)
- `.env.example` - Template for required environment variables
- `ETSY_CONNECTOR.md` - Complete setup, usage, and troubleshooting guide
- `.gitignore` - Git ignore rules for sensitive files and dependencies

**Commit:** `367e37f` - "Set up Etsy connector with OAuth2 and product sync"

**Next Steps:**
- [ ] Register app in [Etsy Developer Portal](https://www.etsy.com/developers)
- [ ] Configure `.env` with Etsy API credentials (Client ID, Client Secret)
- [ ] Test OAuth2 flow with actual Etsy shop
- [ ] Implement database storage for synced products
- [ ] Add token refresh logic for production deployment
- [ ] Create scheduled sync tasks to update products periodically
- [ ] Integrate product display into marketing site (`index.html`)
- [ ] Deploy connector service to production environment

**Architecture:**
- **Frontend:** Static marketing site (`index.html`)
- **Backend:** Node.js/Express server handling Etsy API integration
- **Authentication:** OAuth2 with Etsy
- **Data Sync:** On-demand product fetch via `/api/products` endpoint

**Tech Stack:**
- Express.js (Node.js server framework)
- Axios (HTTP client for API calls)
- dotenv (Environment configuration)

---

## Previous History

### Initial Setup
- Marketing website for Ironbridge Strategy Group (leadership coaching)
- Mailchimp integration for email capture
- Single-page HTML application

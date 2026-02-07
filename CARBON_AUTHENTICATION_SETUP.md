# Carbon Certificate Authentication - Setup & Integration Guide

## Overview

This guide documents the integration of carbon certificate authentication from the Python `auth_carbon.py` script into the existing React/TypeScript project. The Python logic has been converted to TypeScript and integrated as backend API endpoints with a React component frontend.

## Architecture

### Components

1. **Backend Server** (`server/razorpay-server.js`)
   - Node.js/Express server
   - Two new Carbon Authentication endpoints
   - Integrates with Carbonmark API

2. **Client Library** (`src/lib/carbonApi.ts`)
   - TypeScript API client
   - Functions to communicate with backend
   - Certificate field extraction and validation

3. **React Component** (`src/components/carbon/CertificateAuthenticator.tsx`)
   - Dialog-based UI for certificate authentication
   - Supports both text extraction and manual input
   - Real-time authentication feedback

4. **TypeScript Utilities** (`src/lib/carbonAuthentication.ts`)
   - Standalone utilities (can be used without React)
   - Certificate field extraction
   - Authentication logic
   - Similarity scoring

## File Structure

```
project/
├── server/
│   ├── razorpay-server.js          # Backend with carbon endpoints
│   ├── package.json                 # Dependencies
│   └── .env.example                 # Environment variables
├── src/
│   ├── lib/
│   │   ├── carbonApi.ts             # API client
│   │   └── carbonAuthentication.ts  # Standalone utilities
│   ├── components/carbon/
│   │   └── CertificateAuthenticator.tsx  # React component
│   └── pages/
│       └── Retire.tsx               # Can integrate authenticator here
└── CARBON_AUTHENTICATION_SETUP.md   # This file
```

## Setup Instructions

### 1. Install Dependencies

Backend dependencies are already in `server/package.json`. Install them:

```bash
cd server
npm install
```

Frontend dependencies (for React component) are already in root `package.json`.

### 2. Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_1DP5MMOk7YCFYZ
RAZORPAY_KEY_SECRET=tFt5d5cKDHHVF0iH4F2Xg7hL

# Server Configuration
PORT=5000
NODE_ENV=development

# Carbon Authentication (Carbonmark API)
CARBONMARK_API_KEY=cm_api_sandbox_13d435c7-525d-455e-ad44-d28a70522a5c
CARBONMARK_BASE_URL=https://v18.api.carbonmark.com
```

### 3. Start Backend Server

From the `server/` directory:

```bash
node razorpay-server.js
```

Server will run on `http://localhost:5000`

### 4. Configure Frontend API URL

In your React component or environment, set the API base URL:

```typescript
// In carbonApi.ts or environment
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
```

For production, set:
```bash
REACT_APP_API_URL=https://your-production-api.com
```

## API Endpoints

### POST `/api/carbon/extract`

Extract certificate fields from text.

**Request:**
```json
{
  "text": "Project Name: Solar Farm Alpha\nVintage Year: 2023\nCountry: India\nMethodology: VCS"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "project_name": "Solar Farm Alpha",
    "vintage": "2023",
    "country": "India",
    "methodology": "VCS"
  }
}
```

### POST `/api/carbon/authenticate`

Authenticate a certificate against Carbonmark API data.

**Request:**
```json
{
  "certificate": {
    "project_name": "Solar Farm Alpha",
    "vintage": "2023",
    "country": "India",
    "methodology": "VCS"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "authenticated": true,
    "confidence": 0.85,
    "matched_credit_id": "CREDIT_ID_123",
    "matched_project": {
      "name": "Solar Farm Alpha",
      "country": "India",
      "vintage": 2023,
      "methodology": "VCS"
    }
  }
}
```

## Integration Examples

### 1. Using the React Component

```typescript
import { CertificateAuthenticator } from "@/components/carbon/CertificateAuthenticator";

export function MyPage() {
  const handleSuccess = (result) => {
    console.log("Certificate authenticated:", result);
    // Use result.matched_credit_id in your flow
  };

  return (
    <div>
      <CertificateAuthenticator onSuccess={handleSuccess} />
    </div>
  );
}
```

### 2. Using the API Client Directly

```typescript
import {
  extractCertificateFields,
  authenticateCarbonCredit,
} from "@/lib/carbonApi";

async function handleCertificate(text) {
  const fields = await extractCertificateFields(text);
  const result = await authenticateCarbonCredit(fields);
  
  if (result.authenticated) {
    console.log("Certificate verified!");
  }
}
```

### 3. Integrating into Retire Page

Add to `src/pages/Retire.tsx`:

```typescript
import { CertificateAuthenticator } from "@/components/carbon/CertificateAuthenticator";

export function Retire() {
  const [verifiedCredit, setVerifiedCredit] = useState(null);

  return (
    <div>
      <h2>Retire Carbon Credits</h2>
      
      {/* Add certificate authenticator */}
      <CertificateAuthenticator
        onSuccess={(result) => setVerifiedCredit(result)}
      />

      {/* Show verification status */}
      {verifiedCredit && (
        <div>
          <p>Verified Credit ID: {verifiedCredit.matched_credit_id}</p>
          <p>Confidence: {(verifiedCredit.confidence * 100).toFixed(1)}%</p>
        </div>
      )}

      {/* Retirement form continues... */}
    </div>
  );
}
```

## How It Works

### Authentication Flow

1. **Input** - User provides certificate text or manual fields
2. **Extraction** - Backend extracts structured fields using regex patterns
3. **Fetching** - Backend fetches all listings from Carbonmark API
4. **Comparison** - Algorithm scores each listing:
   - Project Name: 50% weight
   - Vintage Year: 20% weight
   - Country: 15% weight
   - Methodology: 15% weight
5. **Decision** - Certificates with confidence ≥ 75% are authenticated

### Similarity Scoring

The algorithm uses character-level matching to calculate similarity:
- Converts both strings to lowercase
- Counts matching characters
- Returns ratio as score (0-1)

## API Key & Credentials

### Carbonmark Sandbox API

- **Base URL**: `https://v18.api.carbonmark.com`
- **API Key**: `cm_api_sandbox_13d435c7-525d-455e-ad44-d28a70522a5c`
- **Environment**: Sandbox/Testing
- **Status**: Active and ready for testing

### Razorpay Test Credentials

- **Key ID**: `rzp_test_1DP5MMOk7YCFYZ`
- **Key Secret**: `tFt5d5cKDHHVF0iH4F2Xg7hL`
- **Environment**: Test/Sandbox
- **Status**: Active for development

## Testing

### Test Certificate Data

```json
{
  "project_name": "ICR Project 349",
  "vintage": "2011",
  "country": "India",
  "methodology": "CDM"
}
```

### Test with cURL

```bash
curl -X POST http://localhost:5000/api/carbon/authenticate \
  -H "Content-Type: application/json" \
  -d '{
    "certificate": {
      "project_name": "Solar Farm Alpha",
      "vintage": "2023",
      "country": "India",
      "methodology": "VCS"
    }
  }'
```

## Troubleshooting

### "Cannot find module" errors

Ensure dependencies are installed:
```bash
cd server
npm install
```

### CORS errors

The backend has CORS enabled. If issues persist, check:
- Frontend API URL matches backend URL
- Backend is running on correct port

### "Carbonmark API error"

- Check internet connection
- Verify API key is valid
- Check Carbonmark API status

### Low confidence scores

- Ensure certificate data matches Carbonmark records exactly
- Try different project name variations
- Check if project exists in Carbonmark listings

## Performance Considerations

- Carbonmark API calls are cached at backend
- Similarity calculations are O(n) where n = listing count
- Confidence threshold is 0.75 (75%)

## Security

- API keys are stored in environment variables
- No sensitive data is logged
- HMAC-SHA256 used for signature verification
- All inputs are validated before processing

## Migration from Python

Original Python script converted:
- `extract_text_from_pdf()` → `extractCertificateFields()` (regex-based)
- `fetch_carbonmark_listings()` → `fetchCarbonmarkListings()` (fetch API)
- `similarity()` → `calculateSimilarity()` (character matching)
- `authenticate_certificate()` → `authenticateCertificate()` (scoring logic)

All business logic preserved, only implementation language changed.

## Next Steps

1. Start backend server: `node server/razorpay-server.js`
2. Set `REACT_APP_API_URL` in frontend
3. Import `CertificateAuthenticator` component where needed
4. Test with provided test data
5. Deploy backend to production service (Vercel, Heroku, AWS, etc.)

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review API endpoint responses
3. Check backend logs for detailed errors
4. Verify environment variables are set correctly

# Carbon Authentication - Quick Start Guide

## TL;DR

Convert Python `auth_carbon.py` logic to TypeScript and integrate into React app ✅ **DONE**

## Files to Know

| File | Purpose | What to Do |
|---|---|---|
| `server/razorpay-server.js` | Backend API | Run: `node razorpay-server.js` |
| `src/lib/carbonApi.ts` | API client | Import and use in React |
| `src/components/carbon/CertificateAuthenticator.tsx` | UI component | Drop into your page |
| `CARBON_AUTHENTICATION_SETUP.md` | Full docs | Read for detailed info |

## 30-Second Setup

```bash
# 1. Start backend (from project root)
cd server
npm install
node razorpay-server.js

# 2. In another terminal, start frontend
npm run dev

# 3. Backend now runs on http://localhost:5000
```

## 2-Minute Integration

### Option 1: Use React Component (Easiest)

```typescript
import { CertificateAuthenticator } from "@/components/carbon/CertificateAuthenticator";

export function MyPage() {
  return (
    <div>
      <CertificateAuthenticator 
        onSuccess={(result) => {
          console.log("Certificate ID:", result.matched_credit_id);
        }}
      />
    </div>
  );
}
```

### Option 2: Use API Client Directly

```typescript
import { authenticateCarbonCredit } from "@/lib/carbonApi";

const result = await authenticateCarbonCredit({
  project_name: "Solar Farm Alpha",
  vintage: "2023",
  country: "India",
  methodology: "VCS"
});

if (result.authenticated) {
  console.log("✅ Certificate verified!");
}
```

## API Endpoints

### Extract Fields
```
POST http://localhost:5000/api/carbon/extract
Content-Type: application/json

{
  "text": "Project Name: Solar Farm\nVintage Year: 2023\nCountry: India\nMethodology: VCS"
}
```

### Authenticate
```
POST http://localhost:5000/api/carbon/authenticate
Content-Type: application/json

{
  "certificate": {
    "project_name": "Solar Farm",
    "vintage": "2023",
    "country": "India",
    "methodology": "VCS"
  }
}
```

## Test Data

```json
{
  "project_name": "ICR Project 349",
  "vintage": "2011",
  "country": "India",
  "methodology": "CDM"
}
```

## What Changed from Python

| Python | TypeScript | Status |
|--------|-----------|--------|
| `extract_text_from_pdf()` | `/api/carbon/extract` | ✅ API endpoint |
| `fetch_carbonmark_listings()` | Internal to backend | ✅ Implemented |
| `similarity()` | `calculateSimilarity()` | ✅ Converted |
| `authenticate_certificate()` | `authenticateCertificate()` | ✅ Converted |

## Response Format

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

## Environment Variables

Create `server/.env`:
```
RAZORPAY_KEY_ID=rzp_test_1DP5MMOk7YCFYZ
RAZORPAY_KEY_SECRET=tFt5d5cKDHHVF0iH4F2Xg7hL
CARBONMARK_API_KEY=cm_api_sandbox_13d435c7-525d-455e-ad44-d28a70522a5c
PORT=5000
NODE_ENV=development
```

## Common Issues

| Issue | Fix |
|-------|-----|
| "Cannot connect to localhost:5000" | Start backend server first |
| "API_URL not set" | Set `REACT_APP_API_URL` environment variable |
| "Low confidence score" | Certificate data may not match Carbonmark records |
| "Module not found" | Run `npm install` in server directory |

## Next Steps

1. ✅ Backend server created with 2 new endpoints
2. ✅ Frontend API client library created
3. ✅ React component with UI created
4. ✅ TypeScript utilities created
5. ⏭️ Start backend: `node server/razorpay-server.js`
6. ⏭️ Integrate component: `<CertificateAuthenticator />`
7. ⏭️ Test with provided test data
8. ⏭️ Deploy backend to production

## Useful Commands

```bash
# Test endpoint with curl
curl -X POST http://localhost:5000/api/carbon/authenticate \
  -H "Content-Type: application/json" \
  -d '{"certificate":{"project_name":"Solar","vintage":"2023","country":"India","methodology":"VCS"}}'

# Check if backend is running
curl http://localhost:5000/api/health

# Check backend logs
tail -f server/razorpay-server.js
```

## Files Modified

- ✅ `package.json` - Fixed react-leaflet dependency
- ✅ `server/razorpay-server.js` - Added carbon endpoints
- ✅ `server/.env.example` - Added carbon credentials

## Files Created

- ✅ `src/lib/carbonApi.ts` - API client
- ✅ `src/lib/carbonAuthentication.ts` - Utilities
- ✅ `src/components/carbon/CertificateAuthenticator.tsx` - React component
- ✅ `CARBON_AUTHENTICATION_SETUP.md` - Full documentation
- ✅ `CARBON_AUTH_IMPLEMENTATION_SUMMARY.md` - Technical summary
- ✅ `CARBON_AUTH_QUICK_START.md` - This file

## Support

For detailed information, see:
- **Setup & Integration**: `CARBON_AUTHENTICATION_SETUP.md`
- **Technical Details**: `CARBON_AUTH_IMPLEMENTATION_SUMMARY.md`
- **API Docs**: See setup guide for endpoint details

**Status**: ✅ Ready to deploy and integrate

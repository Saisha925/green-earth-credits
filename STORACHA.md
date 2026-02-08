# Storacha (Decentralized Storage) Setup

This project can use [Storacha](https://docs.storacha.network/) to store:

- **Certificate PDFs** – After authentication, the uploaded certificate is stored on IPFS/Filecoin and a public gateway URL is returned.
- **Marketplace listings** – The listings dataset is uploaded to Storacha after each update; reads use the latest CID so your “database” lives on decentralized storage.

All data on Storacha is **public** and **permanent**. Do not store private or sensitive data unencrypted.

## 1. Create an account and Space

1. Install the CLI:
   ```bash
   npm install -g @storacha/cli
   ```

2. Log in with your email (you’ll receive a validation link):
   ```bash
   storacha login YOUR_EMAIL@example.com
   ```

3. Create a Space (name cannot be changed later):
   ```bash
   storacha space create green-earth-credits
   ```

4. Use that Space for the next steps:
   ```bash
   storacha space use green-earth-credits
   ```
   (Or use the DID printed by `storacha space ls`.)

## 2. Get KEY and PROOF for the backend

The app uses **“Bring your own delegations”** so the server can upload without interactive login.

1. Create an agent key and get your private key and DID:
   ```bash
   storacha key create
   ```
   **Store the private key** (starts with `Mg...`) securely. You’ll set it as `STORACHA_KEY`.

2. Create a delegation from your CLI to that agent (run this **after** `storacha space use ...`):
   ```bash
   storacha delegation create DID_FROM_STEP_1 --base64
   ```
   **Store the base64 output** as `STORACHA_PROOF`.

3. Add to your `.env` in `green-earth-credits/`:
   ```env
   STORACHA_KEY=Mg...
   STORACHA_PROOF=...
   ```

## 3. Optional: Pin listings CID in env

After the first listing is saved, the server writes the latest listings CID to `server/data/storacha-listings-cid.txt`. You can also set it explicitly:

```env
STORACHA_LISTINGS_CID=bafybe...
```

Then the app will prefer reading listings from that CID (Storacha/IPFS) and fall back to local `listings.json` if the fetch fails.

## 4. Behaviour summary

| Feature              | Without Storacha env      | With `STORACHA_KEY` + `STORACHA_PROOF`      |
|----------------------|---------------------------|---------------------------------------------|
| Certificate auth     | Works (no upload)         | Works; PDF is uploaded, `storachaUrl` in response |
| Listings read/write  | Local `listings.json` only | Local file + upload to Storacha; CID saved; reads use CID when set |

- Docs: [Storacha Upload](https://docs.storacha.network/how-to/upload/), [Bring your own delegations](https://docs.storacha.network/how-to/upload/#bring-your-own-delegations)

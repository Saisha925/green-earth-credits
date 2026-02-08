# Green Earth Credits – ERC20 (GEC) on Testnet

ERC20 token **Green Earth Credits (GEC)** for platform transactions. Deployable to **Sepolia** (or other testnets).

- **Token:** Green Earth Credits (GEC), 18 decimals  
- **Platform wallet:** `0xFA510493D1921407a9893d2f8E72cAF919B4e459`  
  - Receives the full initial supply  
  - Is the contract **owner** (can mint more later)

## 1. Install deps

```bash
npm install
```

## 2. Compile

```bash
npm run compile
```

## 3. Configure env for deploy

In `green-earth-credits/.env` (or your shell):

- **DEPLOYER_PRIVATE_KEY** – Private key of the wallet that will pay gas (e.g. `0x...`). Can be the same as the platform wallet or another funded wallet.
- **SEPOLIA_RPC_URL** (optional) – Defaults to `https://rpc.sepolia.org`. You can use an Alchemy/Infura Sepolia RPC for reliability.

Never commit `.env` or share your private key.

## 4. Get Sepolia ETH

The deployer wallet needs a little Sepolia ETH for gas:

- https://sepoliafaucet.com  
- https://www.alchemy.com/faucets/ethereum-sepolia  

## 5. Deploy to Sepolia

```bash
npm run deploy:sepolia
```

Example output:

- `GreenEarthCredits (GEC) deployed to: 0x...`
- Initial supply: 1,000,000 GEC sent to `0xFA510493D1921407a9893d2f8E72cAF919B4e459`
- Owner: `0xFA510493D1921407a9893d2f8E72cAF919B4e459`

Save the deployed contract address for the frontend/backend.

## 6. Local (Hardhat) test deploy

No real network or env needed:

```bash
npm run deploy:local
```

## Contract summary

| Item        | Value |
|------------|--------|
| Name       | Green Earth Credits |
| Symbol     | GEC |
| Decimals   | 18 |
| Initial supply | 1,000,000 GEC (in wei) |
| Recipient  | `0xFA510493D1921407a9893d2f8E72cAF919B4e459` |
| Owner      | Same address (can `mint`) |

- **Constructor:** `GreenEarthCredits(initialSupplyAmount, platformWallet)`  
- **Owner:** `mint(to, amount)` to create new GEC.

## Using the token in the app

After deployment, use the contract address and any Web3 provider (e.g. ethers.js, wagmi, MetaMask) to:

- Read: `balanceOf`, `totalSupply`, `allowance`  
- Write (owner): `mint`  
- Write (users): `transfer`, `approve`, `transferFrom` for payments/escrow.

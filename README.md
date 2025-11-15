# 🏠 Highp Haus Faucet

Modern Base Mainnet faucet with Farcaster verification, Reown AppKit wallet support, and transparent ETH contributions.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📋 Features

- ✅ **Reown AppKit** – 300+ wallets (MetaMask, Coinbase, Rainbow, etc.)
- ✅ **Farcaster Verification** – Only verified Farcaster IDs can claim
- ✅ **Recurring Claims** – $0.10 worth of ETH every 7 days
- ✅ **Chainlink Oracle** – Dynamic price feed for accurate payouts
- ✅ **ETH Contributions** – Support builders, tracked on-chain
- ✅ **Server Attestation** – Reown signature from trusted attestor wallet

## 🔗 Current Deployment

**HighPhausFaucetDynamic (Base Mainnet)**  
Address: `0xBcA9D185EdAfa8649C1d13Bc8Eecd048697CC72d`  
Explorer: https://basescan.org/address/0xBcA9D185EdAfa8649C1d13Bc8Eecd048697CC72d

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Auth**: Privy (Farcaster integration)
- **Blockchain**: Base (Sepolia testnet)
- **Smart Contracts**: Solidity 0.8.20
- **Oracles**: Chainlink ETH/USD Price Feed
- **Farcaster**: On-chain ID Registry verification

## 📁 Project Structure

```
highp-haus/
├── src/
│   ├── app/              # Next.js pages & API routes
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── config/           # Configuration
│   └── types/            # TypeScript types
├── public/               # Static assets
├── hardhat-deploy/       # Smart contract
└── docs/                 # Documentation
```

## 🔐 Environment Variables

Create `.env.local` with:

```env
# Reown AppKit (get from https://cloud.reown.com)
NEXT_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id

# Contract Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0xBcA9D185EdAfa8649C1d13Bc8Eecd048697CC72d

# Server Wallet (attestor key – must match trustedAttestor)
FAUCET_PRIVATE_KEY=0xYourServerWalletPrivateKey

# RPC URLs
BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_BASE_RPC=https://mainnet.base.org
```

See `CONTRACT_DEPLOYMENT_GUIDE.md`, `HOW_IT_WORKS.md`, and `REOWN_APPKIT_SETUP.md` for full setup details.

## 📚 Documentation

- **HOW_IT_WORKS.md** – Attestation + claim flow
- **CONTRACT_DEPLOYMENT_GUIDE.md** – Deploying the faucet contract
- **REOWN_APPKIT_SETUP.md** – Wallet integration + theming
- **DEPLOYMENT_INSTRUCTIONS.md** – Frontend + environment setup
- **QUICK_START_GUIDE.md** – TL;DR runbook
- **FINAL_CLEANUP_SUMMARY.md** – What was removed & why

## 🎯 How It Works

1. **Connect Wallet** – Reown AppKit modal (MetaMask, Coinbase, Rainbow…)
2. **Authenticate** – Farcaster quick auth (FID extracted)
3. **Request Signature** – Backend verifies cooldown + signs claim payload
4. **Submit Transaction** – User calls `claim(farcasterIdHash, expiry, signature)` (user pays gas)
5. **Receive $0.10 ETH** – Amount calculated at runtime via Chainlink oracle
6. **Support Builders** – Anyone can contribute ETH via `contribute()` (tracked on-chain)

## 🧪 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🚀 Deployment

Contract is already deployed to Base Sepolia at:
`0x527585EE01F9a86B895b98Fb59E14d8C943cF6db`

Frontend can be deployed to Vercel:

```bash
vercel deploy
```

Make sure to set environment variables in Vercel dashboard.

## 📝 License

MIT

## 🙏 Credits

Built with ❤️ for the Base ecosystem

---

**Need help?** Check `FARCASTER_ONLY_SETUP.md` or `DEPLOYED_CONTRACT_INFO.md` for details.

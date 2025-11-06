# 🏠 Highp Haus Faucet

A modern Base network faucet with Farcaster authentication and USDC donations.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📋 Features

- ✅ **Privy Authentication** - Farcaster login
- ✅ **Farcaster FID Claiming** - One claim per Farcaster account (on-chain verification)
- ✅ **One-time Claims** - Each Farcaster ID claims once
- ✅ **Dynamic Pricing** - Chainlink ETH/USD oracle ($0.10 worth of ETH)

## 🔗 Deployed Contract

**BaseFarcasterFaucet**  
Address: `0x527585EE01F9a86B895b98Fb59E14d8C943cF6db`  
Network: Base Sepolia  
Explorer: https://sepolia.basescan.org/address/0x527585EE01F9a86B895b98Fb59E14d8C943cF6db

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
# Required
NEXT_PUBLIC_PRIVY_APP_ID=cmhni9xo30171l50cunm9361e
NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=0x527585EE01F9a86B895b98Fb59E14d8C943cF6db
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_id
```

See `FARCASTER_ONLY_SETUP.md` and `DEPLOYED_CONTRACT_INFO.md` for details.

## 📚 Documentation

- **FARCASTER_ONLY_SETUP.md** - Current setup guide (Farcaster authentication)
- **DEPLOYED_CONTRACT_INFO.md** - Contract details & admin functions

## 🎯 How It Works

1. **Connect** - Users connect with Privy Farcaster login
2. **Verify** - Contract checks Farcaster FID on-chain via ID Registry
3. **Claim** - User receives $0.10 worth of ETH (one-time per FID)
4. **Done** - Each Farcaster ID can only claim once!

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

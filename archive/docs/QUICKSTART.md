# 🚀 Quick Start Guide

Get your Base ETH Faucet running in under 5 minutes!

## Prerequisites

- **Node.js 18+** and **npm 9+**
- A **WalletConnect Project ID** (free at [cloud.walletconnect.com](https://cloud.walletconnect.com/))

## 1. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd "highp haus"

# Install dependencies
npm install
```

## 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local
```

Edit `.env.local`:

```env
# 🔑 REQUIRED: Get your WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=paste_your_project_id_here

# ✅ RECOMMENDED: Enable mock mode for testing
NEXT_PUBLIC_MOCK_MODE=true

# Optional: Customize claim settings
NEXT_PUBLIC_CLAIM_COOLDOWN_MINUTES=1440
NEXT_PUBLIC_CLAIM_AMOUNT_ETH=0.01
```

### Get Your WalletConnect Project ID

1. Go to [cloud.walletconnect.com](https://cloud.walletconnect.com/)
2. Sign up or log in
3. Create a new project
4. Copy your Project ID
5. Paste it in `.env.local`

## 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 4. Test the Faucet

With `NEXT_PUBLIC_MOCK_MODE=true`:

1. Click **"Connect Wallet"**
2. Select your wallet and connect
3. Click **"Claim ETH"**
4. Watch the animated claim flow!

The mock mode simulates blockchain interactions without requiring:
- Real ETH
- Deployed smart contract
- Test network connection

## Next Steps

### For Development

- Explore components in `src/components/`
- Customize colors in `tailwind.config.ts`
- Modify claim logic in `src/hooks/use-claim.ts`
- Check out `docs/design-system.md`

### For Production

1. **Deploy Smart Contract**
   ```bash
   # See contracts/Faucet.sol and scripts/deploy-contract.sh
   ```

2. **Update Environment**
   ```env
   NEXT_PUBLIC_MOCK_MODE=false
   NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=0xYourDeployedContract
   ```

3. **Deploy to Vercel**
   ```bash
   # Push to GitHub
   git add .
   git commit -m "Initial setup"
   git push

   # Import to Vercel and set environment variables
   ```

## Project Structure

```
highp haus/
├── src/
│   ├── app/              # Next.js pages and API routes
│   ├── components/       # React components
│   ├── hooks/           # Custom hooks
│   ├── config/          # Configuration
│   └── lib/             # Utilities
├── contracts/           # Smart contracts
├── scripts/             # Deployment scripts
└── docs/               # Documentation
```

## Common Issues

### "Module not found" errors
```bash
npm install
```

### TypeScript errors
```bash
npm run type-check
```

### Port already in use
```bash
# Change port
PORT=3001 npm run dev
```

### WalletConnect not working
- Check your Project ID is correct
- Ensure it's in `.env.local` (not `.env.example`)
- Restart dev server after changing env vars

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
npm run type-check  # Check TypeScript types
npm run format      # Format code with Prettier
```

## Features to Try

- ✅ Connect with 300+ wallets via WalletConnect
- ✅ Animated claim flow with confetti
- ✅ Real-time statistics
- ✅ Recent claims history
- ✅ Responsive mobile design
- ✅ Dark glassmorphic UI

## Admin Panel

Visit [http://localhost:3000/admin](http://localhost:3000/admin)

Default password (mock mode): `admin`

## Need Help?

- 📖 Read the full [README.md](./README.md)
- 🎨 Check [Design System](./docs/design-system.md)
- 🐛 Open an [issue](https://github.com/your-repo/issues)
- 💬 Join our community

---

**Happy building! 🌊**



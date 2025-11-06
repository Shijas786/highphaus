# ⚡ Quick Start - Deploy in 10 Minutes

## Prerequisites
- ✅ MetaMask installed
- ✅ Some Base Sepolia ETH ([Get here](https://www.alchemy.com/faucets/base-sepolia))

---

## Step 1: Create `.env.local` (30 seconds)

Run this command:

```bash
cat > .env.local << 'EOF'
# Privy (Already configured!)
NEXT_PUBLIC_PRIVY_APP_ID=cmhni9xo30171l50cunm9361e
PRIVY_APP_SECRET=3MyQ8JndHkyx7ch12b7e6kw7XUKgDbZiw9jgerjpwogQux1dJ91fGjfnw3cJ7RGkyzaPkMKWW1kJHZEpZiJ9Wdc7

# Backend Signer (Already generated!)
SIGNER_PRIVATE_KEY=0x9d4273e786df16208472dd56b30ea353bcead4e5723099d3014adfe00aa7dca0

# Contract (Update after deployment)
NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# Environment
NEXT_PUBLIC_MOCK_MODE=false
EOF
```

---

## Step 2: Deploy Contract with Remix (5 minutes)

### 2a. Open Remix
https://remix.ethereum.org

### 2b. Create File
- New file: `BaseFarcasterAuthFaucet.sol`
- Copy from: `contracts/BaseFarcasterAuthFaucet.sol`

### 2c. Compile
- Compiler tab → 0.8.20
- Enable optimization (200 runs)
- Click "Compile"

### 2d. Deploy
- Deploy tab → "Injected Provider"
- Connect MetaMask (Base Sepolia)
- Constructor param: `0xC3323D12a35081a45d7Ff1F7EeD6f50038CB4637`
- Click "Deploy" → Confirm in MetaMask

### 2e. Copy Contract Address
After deployment, copy the address shown in Remix.

---

## Step 3: Update `.env.local` (10 seconds)

Edit `.env.local` and replace:
```env
NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=<YOUR_DEPLOYED_ADDRESS>
```

---

## Step 4: Fund Contract (1 minute)

In MetaMask:
1. Send 0.1 ETH to your contract address
2. Or use cast:
   ```bash
   cast send <CONTRACT_ADDRESS> \
     --value 0.1ether \
     --private-key $YOUR_PRIVATE_KEY \
     --rpc-url https://sepolia.base.org
   ```

---

## Step 5: Enable Farcaster in Privy (2 minutes)

1. Go to https://dashboard.privy.io
2. Login with your account
3. Select your app
4. Settings → Login Methods
5. Enable **Farcaster**
6. Save

---

## Step 6: Test! (1 minute)

```bash
# Start dev server
npm run dev

# Test backend signing
curl -X POST http://localhost:3000/api/sign-attestation \
  -H "Content-Type: application/json" \
  -d '{"wallet": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", "baseId": "test"}'

# Should return signature ✅
```

Open http://localhost:3000
- Connect with Privy
- Try claiming!

---

## ✅ Done!

Your faucet is live! 🎉

**What you have:**
- ✅ Privy authentication
- ✅ Farcaster support
- ✅ Base App attestations
- ✅ USDC donations
- ✅ One-time claims per wallet
- ✅ Smart contract deployed

---

## 📚 Next Steps

- **Deploy to Mainnet**: Follow same steps on Base Mainnet
- **Customize UI**: Edit `src/app/page.tsx`
- **Add more tokens**: Edit `src/config/tokens.ts`
- **Monitor claims**: Check `/api/donations` endpoint

---

**Need help?** Check:
- `DEPLOY_GUIDE.md` - Detailed deployment
- `PRIVY_FARCASTER_INTEGRATION.md` - Integration docs
- `SETUP_NOW.md` - Complete setup guide


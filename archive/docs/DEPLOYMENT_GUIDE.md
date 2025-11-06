# 🚀 Deployment Guide

Complete guide for deploying your Base ETH Faucet to production.

## Prerequisites

- [ ] WalletConnect Project ID
- [ ] Base RPC endpoint (Alchemy/Infura recommended)
- [ ] Vercel account (free tier works)
- [ ] GitHub repository
- [ ] Wallet with ETH for contract deployment
- [ ] Domain name (optional)

## Step 1: Smart Contract Deployment

### Option A: Using Foundry (Recommended)

1. **Install Foundry**
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Install OpenZeppelin**
   ```bash
   forge install OpenZeppelin/openzeppelin-contracts
   ```

3. **Configure deployment**
   Edit `scripts/deploy-contract.sh`:
   ```bash
   CLAIM_AMOUNT="0.01"     # ETH per claim
   COOLDOWN_TIME="86400"   # 24 hours
   NETWORK="base-sepolia"  # or "base-mainnet"
   ```

4. **Deploy to Base Sepolia (Testnet)**
   ```bash
   # Set your private key
   export PRIVATE_KEY=your_private_key_here
   
   # Deploy
   forge create contracts/Faucet.sol:Faucet \
     --rpc-url https://sepolia.base.org \
     --private-key $PRIVATE_KEY \
     --constructor-args 10000000000000000 86400 \
     --verify
   ```

5. **Fund the contract**
   ```bash
   cast send CONTRACT_ADDRESS \
     --value 1ether \
     --private-key $PRIVATE_KEY \
     --rpc-url https://sepolia.base.org
   ```

6. **Save the contract address** - You'll need it for `.env`

### Option B: Using Remix IDE

1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create new file `Faucet.sol`
3. Copy contract from `contracts/Faucet.sol`
4. Compile with Solidity 0.8.20+
5. Deploy to Base Sepolia via Injected Provider
6. Constructor args:
   - `_claimAmount`: 10000000000000000 (0.01 ETH in wei)
   - `_cooldownTime`: 86400 (24 hours in seconds)

## Step 2: Environment Configuration

Create `.env.local` with production values:

```env
# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=abc123...

# Contract Address (from Step 1)
NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=0x...

# Disable mock mode
NEXT_PUBLIC_MOCK_MODE=false

# RPC Endpoints (recommended: use Alchemy or Infura)
NEXT_PUBLIC_BASE_RPC=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://base-sepolia.g.alchemy.com/v2/YOUR_KEY

# Production API
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api

# Admin Secret (change this!)
FAUCET_ADMIN_SECRET=your_super_secret_password_here

# Faucet Configuration
NEXT_PUBLIC_CLAIM_COOLDOWN_MINUTES=1440
NEXT_PUBLIC_CLAIM_AMOUNT_ETH=0.01

NODE_ENV=production
```

## Step 3: Test Locally

```bash
# Install dependencies
npm install

# Build
npm run build

# Start production server
npm start
```

Test the application:
1. Connect wallet
2. Check network detection
3. Try claiming (should work if on Base Sepolia)
4. Verify cooldown works
5. Check admin panel

## Step 4: Push to GitHub

```bash
# Initialize git (if not already)
git init

# Add files
git add .

# Commit
git commit -m "feat: initial Base ETH faucet deployment"

# Add remote
git remote add origin https://github.com/yourusername/base-faucet.git

# Push
git push -u origin main
```

## Step 5: Deploy to Vercel

### Via Vercel Dashboard

1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Set Environment Variables**
   
   Add these in Vercel dashboard under Settings > Environment Variables:

   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
   NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS
   NEXT_PUBLIC_BASE_RPC
   NEXT_PUBLIC_BASE_SEPOLIA_RPC
   NEXT_PUBLIC_MOCK_MODE=false
   NEXT_PUBLIC_CLAIM_COOLDOWN_MINUTES=1440
   NEXT_PUBLIC_CLAIM_AMOUNT_ETH=0.01
   FAUCET_ADMIN_SECRET
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Visit your deployment URL

### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
vercel env add NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS
# ... add all env vars

# Deploy to production
vercel --prod
```

## Step 6: Configure Custom Domain (Optional)

1. **In Vercel Dashboard**
   - Go to Project Settings > Domains
   - Add your domain
   - Update DNS records as shown

2. **Update Environment**
   ```env
   NEXT_PUBLIC_API_URL=https://your-domain.com/api
   ```

3. **Redeploy**
   ```bash
   vercel --prod
   ```

## Step 7: Production Checklist

### Security
- [ ] Change default admin secret
- [ ] Use environment-specific RPC endpoints
- [ ] Enable rate limiting (Vercel Edge Config or Upstash)
- [ ] Set up monitoring (Vercel Analytics)
- [ ] Configure CORS if using external API
- [ ] Review security headers in `next.config.ts`

### Smart Contract
- [ ] Verify contract on BaseScan
- [ ] Fund contract with sufficient ETH
- [ ] Test claim on testnet
- [ ] Set reasonable claim amount
- [ ] Configure cooldown period
- [ ] Add contract to monitoring

### Application
- [ ] Test on mobile devices
- [ ] Verify all animations work
- [ ] Check wallet connection flow
- [ ] Test error handling
- [ ] Verify admin panel access
- [ ] Test on different browsers
- [ ] Check accessibility
- [ ] Review console for errors

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Enable analytics (Vercel Analytics)
- [ ] Monitor contract balance
- [ ] Track claim statistics
- [ ] Set up alerts for low balance

## Step 8: Post-Deployment

### Monitor Contract Balance

```bash
# Check contract balance
cast balance CONTRACT_ADDRESS --rpc-url https://sepolia.base.org

# Top up if needed
cast send CONTRACT_ADDRESS \
  --value 10ether \
  --private-key $PRIVATE_KEY \
  --rpc-url https://sepolia.base.org
```

### Update Documentation

Update your repository README with:
- Live demo URL
- Contract address
- Supported networks
- Claim limits
- Contact information

### Announce Launch

- Share on social media
- Post in Base Discord
- Add to Base ecosystem lists
- Create demo video
- Write blog post

## Troubleshooting

### Build Failures

**Error: "Module not found"**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**Error: "Type errors"**
```bash
npm run type-check
# Fix any TypeScript errors
```

### Runtime Issues

**Wallet not connecting**
- Verify WalletConnect Project ID
- Check browser console for errors
- Test with different wallets
- Ensure HTTPS (required for WalletConnect)

**Claims not working**
- Verify contract address is correct
- Check user is on correct network
- Confirm contract has balance
- Review contract events on BaseScan

**Admin panel not accessible**
- Verify admin secret is set
- Check environment variables
- Review browser console

## Scaling Considerations

### High Traffic

1. **Implement rate limiting**
   ```typescript
   // Use Vercel Edge Config or Upstash Redis
   import { Ratelimit } from '@upstash/ratelimit'
   ```

2. **Add caching**
   - Cache statistics API responses
   - Use Vercel's edge caching
   - Implement SWR for client-side

3. **Optimize images**
   - Use Next.js Image component
   - Lazy load components
   - Implement virtual scrolling for history

### Database (Optional)

For production, consider adding a database:

```typescript
// Prisma + PostgreSQL example
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Track claims
await prisma.claim.create({
  data: {
    address,
    amount,
    txHash,
    timestamp: new Date(),
  },
})
```

## Maintenance

### Regular Tasks

**Daily**
- Monitor contract balance
- Check error logs
- Review claim statistics

**Weekly**
- Update dependencies
- Review security advisories
- Analyze usage patterns

**Monthly**
- Audit contract balance
- Review and adjust limits
- Update documentation

### Updates

```bash
# Update dependencies
npm update

# Check for security issues
npm audit

# Fix security issues
npm audit fix

# Rebuild and redeploy
npm run build
vercel --prod
```

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Review browser console errors
3. Check contract on BaseScan
4. Open GitHub issue
5. Join Base Discord for help

## Next Steps

After deployment:
- [ ] Add social verification
- [ ] Implement analytics
- [ ] Add claim leaderboard
- [ ] Support multiple networks
- [ ] Create mobile app
- [ ] Add referral system

---

**Congratulations on deploying your Base ETH Faucet! 🎉**

Need help? Check our [GitHub Issues](https://github.com/your-repo/issues)



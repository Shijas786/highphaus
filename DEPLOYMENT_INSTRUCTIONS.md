# Deployment Instructions for Farcaster Gas Faucet with NFT

## Overview
This guide will help you deploy the complete Farcaster Gas Faucet with NFT rewards system on Base Network.

## Prerequisites
- Node.js 18+ installed
- A wallet with Base ETH for deployment
- A server wallet with Base ETH for gasless transactions
- WalletConnect Project ID (get from https://cloud.walletconnect.com/)

## Smart Contract Deployment

### Step 1: Prepare Contract Parameters

You'll need the following for deployment:

1. **USDC Token Address (Base Mainnet)**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
2. **Server Wallet Address**: The address that will sign gasless transactions
3. **Initial Claim Amount**: Amount of ETH per claim in wei (e.g., `10000000000000000` for 0.01 ETH)
4. **Base URI**: IPFS or HTTP URL for NFT metadata (e.g., `https://your-domain.com/nft-metadata`)

### Step 2: Deploy Using Remix IDE

1. Open [Remix IDE](https://remix.ethereum.org/)
2. Create a new file `FarcasterGasFaucetWithNFT.sol`
3. Copy the contract code from `/contracts/FarcasterGasFaucetWithNFT.sol`
4. Install OpenZeppelin imports:
   - Go to "Plugin Manager" and activate "Flattener"
   - Or use the GitHub plugin to import OpenZeppelin contracts

5. Compile the contract:
   - Select Solidity Compiler version `0.8.20` or higher
   - Click "Compile"

6. Deploy:
   - Switch to "Deploy & Run Transactions" tab
   - Select "Injected Provider - MetaMask" as environment
   - Connect to Base Mainnet in MetaMask
   - Fill constructor parameters:
     - `_usdcToken`: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
     - `_signerWallet`: Your server wallet address
     - `_claimAmount`: `10000000000000000` (0.01 ETH)
     - `baseURI`: `https://your-domain.com/nft-metadata`
   - Click "Deploy"
   - Confirm transaction in MetaMask

7. Save the deployed contract address!

### Step 3: Fund the Contract

1. Send ETH to the contract for claims:
   ```bash
   # Send ETH directly to the contract address
   # Recommended: At least 1 ETH for initial testing
   ```

2. The contract automatically receives ETH via `receive()` function

### Step 4: Verify Contract on BaseScan

1. Go to [BaseScan](https://basescan.org/)
2. Search for your contract address
3. Click "Verify and Publish"
4. Select:
   - Compiler: `v0.8.20` or your version
   - License: MIT
   - Optimization: Yes (if enabled during compilation)
5. Paste flattened source code
6. Submit for verification

## Frontend Deployment

### Step 1: Configure Environment Variables

Create `.env.local` file:

```env
# Contract Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress

# Server Wallet (for gasless transactions)
FAUCET_PRIVATE_KEY=0xYourServerWalletPrivateKey

# RPC URLs
BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_BASE_RPC=https://mainnet.base.org

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Application URL
NEXT_PUBLIC_HOST=your-domain.com
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Build the Application

```bash
npm run build
```

### Step 4: Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

3. Add environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - **IMPORTANT**: Keep `FAUCET_PRIVATE_KEY` secret!

### Step 5: Configure Farcaster Mini-App

1. Go to [Farcaster Developer Portal](https://dev.farcaster.xyz/)
2. Create a new Frame/Mini-App
3. Set your deployment URL
4. Configure metadata in `src/app/layout.tsx` if needed

## NFT Metadata Setup

Create two JSON files for NFT metadata:

### 1. OG Contributor NFT (`og.json`)

```json
{
  "name": "HighpHaus OG Contributor",
  "description": "Exclusive NFT for supporters who contributed USDC to the HighpHaus faucet",
  "image": "ipfs://YOUR_IMAGE_CID_OR_URL",
  "attributes": [
    {
      "trait_type": "Type",
      "value": "OG Contributor"
    },
    {
      "trait_type": "Network",
      "value": "Base"
    },
    {
      "trait_type": "Rarity",
      "value": "Legendary"
    }
  ]
}
```

### 2. Claimer NFT (`claimer.json`)

```json
{
  "name": "HighpHaus Gas Claimer",
  "description": "Commemorative NFT for users who claimed gas from the HighpHaus faucet",
  "image": "ipfs://YOUR_IMAGE_CID_OR_URL",
  "attributes": [
    {
      "trait_type": "Type",
      "value": "Gas Claimer"
    },
    {
      "trait_type": "Network",
      "value": "Base"
    },
    {
      "trait_type": "Rarity",
      "value": "Common"
    }
  ]
}
```

Upload these to IPFS or host them at your `baseURI` location.

## Post-Deployment Configuration

### Update Contract Settings (Owner Only)

```javascript
// Update claim amount
await contract.setClaimAmount(newAmount);

// Update base URI for NFTs
await contract.setBaseURI("https://new-metadata-url.com");

// Update signer wallet
await contract.setSignerWallet(newSignerAddress);

// Pause/unpause contract
await contract.setPaused(true); // or false
```

### Monitor Contract

1. **Check balance**:
   ```bash
   # Monitor contract ETH balance on BaseScan
   ```

2. **Check USDC contributions**:
   ```javascript
   const usdcBalance = await usdcToken.balanceOf(contractAddress);
   ```

3. **Withdraw funds** (owner only):
   ```javascript
   // Withdraw ETH
   await contract.withdraw(amount);
   // or
   await contract.withdrawAll();

   // Withdraw USDC
   await contract.withdrawUSDC(amount);
   // or
   await contract.withdrawUSDCAll();
   ```

## Testing Checklist

Before going live, test:

- ✅ Claim gas (first time)
- ✅ Check 48-hour cooldown
- ✅ Claim gas again after cooldown
- ✅ Contribute USDC (approve + contribute)
- ✅ Mint OG NFT after contributing
- ✅ Mint Claimer NFT after claiming
- ✅ Verify NFT metadata displays correctly
- ✅ Check BaseScan links work
- ✅ Test in Farcaster Mini-App context
- ✅ Test wallet connection flow

## Cost Breakdown

### Initial Deployment
- Contract deployment: ~0.05 ETH
- Contract verification: Free
- Initial funding: Variable (recommend 1+ ETH)

### Ongoing Costs
- Gas per claim (paid by server): ~0.0001 ETH
- Gas per NFT mint (paid by server): ~0.0002 ETH
- USDC contributions: Paid by users

### Server Wallet Management
- Keep server wallet funded with at least 0.1 ETH
- Set up monitoring to alert when balance is low
- Automate top-ups if possible

## Security Considerations

1. **Never expose private keys**:
   - Keep `FAUCET_PRIVATE_KEY` in environment variables only
   - Never commit to git
   - Use Vercel/deployment platform secrets

2. **Rate limiting**:
   - Implement IP-based rate limiting in API routes
   - Monitor for abuse

3. **Smart contract**:
   - Contract is pausable by owner
   - Use pause function if issues detected
   - Consider adding admin controls for emergency situations

4. **Server wallet**:
   - Use a dedicated wallet for gasless transactions
   - Don't store large amounts in server wallet
   - Regularly rotate if possible

## Troubleshooting

### Contract deployment fails
- Ensure you have enough Base ETH in deployer wallet
- Check gas price isn't too high
- Verify all constructor parameters are correct

### Gasless claims fail
- Check server wallet has enough ETH
- Verify `FAUCET_PRIVATE_KEY` is correct
- Check RPC URL is accessible

### NFT metadata doesn't load
- Verify `baseURI` is set correctly in contract
- Check metadata JSON files are accessible
- Ensure CORS is configured if using HTTP URLs

### Users can't claim
- Check contract isn't paused
- Verify contract has sufficient balance
- Ensure user has valid Farcaster account
- Check 48-hour cooldown hasn't passed yet

## Support

For issues:
1. Check contract on BaseScan for events
2. Review server logs for API errors
3. Test contract functions directly on BaseScan
4. Verify environment variables are set correctly

## Maintenance

### Regular Tasks
- Monitor contract ETH balance
- Monitor server wallet balance
- Check for abuse/spam
- Update claim amount based on ETH price if needed
- Backup contribution data periodically

### Upgrades
To deploy a new version:
1. Deploy new contract
2. Transfer ownership and funds from old contract
3. Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in environment
4. Redeploy frontend

---

**Congratulations!** Your Farcaster Gas Faucet with NFT rewards is now live! 🎉


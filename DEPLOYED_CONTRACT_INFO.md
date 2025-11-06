# 🎉 Contract Deployed Successfully!

## ✅ Your BaseFarcasterFaucet Contract

**Contract Address:** `0x527585EE01F9a86B895b98Fb59E14d8C943cF6db`

**Network:** Base Sepolia  
**Deployed:** November 6, 2024  
**Explorer:** https://sepolia.basescan.org/address/0x527585EE01F9a86B895b98Fb59E14d8C943cF6db

---

## 📝 Step 1: Update Environment Variables

Add this to your `.env.local` file:

```env
NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=0x527585EE01F9a86B895b98Fb59E14d8C943cF6db
```

If `.env.local` doesn't exist, create it in the project root with all these variables:

```env
# Privy Authentication
NEXT_PUBLIC_PRIVY_APP_ID=cmhni9xo30171l50cunm9361e
PRIVY_APP_SECRET=3MyQ8JndHkyx7ch12b7e6kw7XUKgDbZiw9jgerjpwogQux1dJ91fGjfnw3cJ7RGkyzaPkMKWW1kJHZEpZiJ9Wdc7

# Backend Signer
SIGNER_PRIVATE_KEY=0x9d4273e786df16208472dd56b30ea353bcead4e5723099d3014adfe00aa7dca0

# Faucet Contract (JUST DEPLOYED!)
NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=0x527585EE01F9a86B895b98Fb59E14d8C943cF6db

# Environment
NEXT_PUBLIC_MOCK_MODE=false
NEXT_PUBLIC_CLAIM_AMOUNT_ETH=0.00004
```

---

## 💰 Step 2: Fund the Contract

Your contract needs ETH to distribute to users. Send some Base Sepolia ETH:

### Option A: Via MetaMask
1. Open MetaMask
2. Make sure you're on **Base Sepolia** network
3. Send **0.1 ETH** to: `0x527585EE01F9a86B895b98Fb59E14d8C943cF6db`
4. Confirm transaction

### Option B: Via Cast (Command Line)
```bash
cast send 0x527585EE01F9a86B895b98Fb59E14d8C943cF6db \
  --value 0.1ether \
  --private-key $YOUR_PRIVATE_KEY \
  --rpc-url https://sepolia.base.org
```

### Option C: Via Remix
1. In Remix, go to "Deploy & Run"
2. In "Value" field, enter: `100000000000000000` (0.1 ETH in wei)
3. Click "Transact" next to your deployed contract's address
4. Confirm in MetaMask

---

## 🔍 Step 3: Verify on BaseScan (Optional but Recommended)

1. Go to: https://sepolia.basescan.org/address/0x527585EE01F9a86B895b98Fb59E14d8C943cF6db
2. Click **"Contract"** tab → **"Verify and Publish"**
3. Fill in:
   - **Compiler Type:** Solidity (Single file)
   - **Compiler Version:** v0.8.20+commit... (select from dropdown)
   - **Open Source License Type:** MIT License
   - **Optimization:** No

4. In **"Enter the Solidity Contract Code"**, paste the entire contract from:
   `hardhat-deploy/contracts/BaseFarcasterFaucet.sol`

5. **Constructor Arguments ABI-encoded:**
   ```
   0x00000000000000000000000000000000fcb080bae665afab5e41c7e4cbfd5a610000000000000000000000000694aa1769357215de4fac081bf1f309adc325306
   ```

6. Click **"Verify and Publish"**

---

## 🧪 Step 4: Test Your Contract

### Check Contract Functions:
```bash
# Check if contract has funds
cast balance 0x527585EE01F9a86B895b98Fb59E14d8C943cF6db --rpc-url https://sepolia.base.org

# Check current ETH/USD price from oracle
cast call 0x527585EE01F9a86B895b98Fb59E14d8C943cF6db "getWeiAmount()" --rpc-url https://sepolia.base.org

# Check if a Farcaster FID has claimed (example FID: 1)
cast call 0x527585EE01F9a86B895b98Fb59E14d8C943cF6db "fidClaimed(uint256)" 1 --rpc-url https://sepolia.base.org
```

### Test Claiming (with Farcaster account):
```bash
# Must be called from an address that has a Farcaster account
cast send 0x527585EE01F9a86B895b98Fb59E14d8C943cF6db "claimFarcaster()" \
  --private-key $YOUR_PRIVATE_KEY \
  --rpc-url https://sepolia.base.org
```

---

## 🚀 Step 5: Restart Your App

```bash
# Stop current dev server (Ctrl+C)
# Then restart:
npm run dev
```

Visit http://localhost:3000 and test:
1. Connect with Privy
2. Link Farcaster account
3. Try claiming!

---

## 📊 Contract Information

| Item | Value |
|------|-------|
| **Contract Address** | `0x527585EE01F9a86B895b98Fb59E14d8C943cF6db` |
| **Network** | Base Sepolia (Chain ID: 84532) |
| **RPC URL** | `https://sepolia.base.org` |
| **Explorer** | https://sepolia.basescan.org |
| **ID Registry** | `0x00000000FcB080bAE665aFAb5e41C7E4CBfD5A61` |
| **ETH/USD Price Feed** | `0x694AA1769357215DE4FAC081bf1f309aDC325306` |
| **USD Per Claim** | $0.10 |

---

## 🎯 Contract Features

✅ **Farcaster FID Claiming** - Users with Farcaster accounts can claim  
✅ **Chainlink Price Feed** - Dynamic ETH amount based on USD value  
✅ **One Claim Per FID** - Each Farcaster ID can only claim once  
✅ **Owner Withdrawal** - You can withdraw funds as owner  
✅ **Reentrancy Protection** - Safe from reentrancy attacks  
✅ **EOA Only** - Contracts cannot claim (prevents abuse)  

---

## ⚠️ Important Notes

- **Testnet Only**: This is deployed on Base Sepolia (testnet)
- **Get Testnet ETH**: https://www.alchemy.com/faucets/base-sepolia
- **Farcaster Required**: Users must have a Farcaster account to claim
- **Price Feed**: Uses Chainlink ETH/USD oracle for dynamic pricing

---

## 🔧 Admin Functions (Owner Only)

As the contract owner, you can:

### Withdraw Funds:
```bash
cast send 0x527585EE01F9a86B895b98Fb59E14d8C943cF6db \
  "withdraw(address,uint256)" \
  <RECIPIENT_ADDRESS> \
  <AMOUNT_IN_WEI> \
  --private-key $OWNER_PRIVATE_KEY \
  --rpc-url https://sepolia.base.org
```

### Transfer Ownership:
```bash
cast send 0x527585EE01F9a86B895b98Fb59E14d8C943cF6db \
  "transferOwnership(address)" \
  <NEW_OWNER_ADDRESS> \
  --private-key $OWNER_PRIVATE_KEY \
  --rpc-url https://sepolia.base.org
```

---

## 🎉 Next Steps

1. ✅ ~~Deploy contract~~ **DONE!**
2. 📝 Update `.env.local` with contract address
3. 💰 Fund contract with 0.1 ETH
4. 🔍 Verify contract on BaseScan
5. 🧪 Test claiming functionality
6. 🚀 Deploy to mainnet (when ready!)

---

**Congratulations! Your Farcaster Faucet is live on Base Sepolia!** 🎊

**Contract:** https://sepolia.basescan.org/address/0x527585EE01F9a86B895b98Fb59E14d8C943cF6db


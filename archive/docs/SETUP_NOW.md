# 🚀 Setup Your Environment NOW

## ✅ Your Privy Credentials

**Privy App ID:** `cmhni9xo30171l50cunm9361e`  
**Privy App Secret:** `3MyQ8JndHkyx7ch12b7e6kw7XUKgDbZiw9jgerjpwogQux1dJ91fGjfnw3cJ7RGkyzaPkMKWW1kJHZEpZiJ9Wdc7`

## ✅ Generated Backend Signer

**Backend Signer Address:** `0xC3323D12a35081a45d7Ff1F7EeD6f50038CB4637`  
**Backend Signer Private Key:** `0x9d4273e786df16208472dd56b30ea353bcead4e5723099d3014adfe00aa7dca0`

⚠️ **SAVE THESE SECURELY!** You'll need the address when deploying the contract.

---

## 📝 Step 1: Create `.env.local`

Run this command:

```bash
cat > .env.local << 'EOF'
# ===================================
# PRIVY AUTHENTICATION
# ===================================
NEXT_PUBLIC_PRIVY_APP_ID=cmhni9xo30171l50cunm9361e

# ⚠️ App Secret - Server-side ONLY (not exposed to frontend)
PRIVY_APP_SECRET=3MyQ8JndHkyx7ch12b7e6kw7XUKgDbZiw9jgerjpwogQux1dJ91fGjfnw3cJ7RGkyzaPkMKWW1kJHZEpZiJ9Wdc7

# ===================================
# BACKEND SIGNER
# ===================================
SIGNER_PRIVATE_KEY=0x9d4273e786df16208472dd56b30ea353bcead4e5723099d3014adfe00aa7dca0

# ===================================
# FAUCET CONTRACT (Update after deployment)
# ===================================
NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# ===================================
# ENVIRONMENT CONFIG
# ===================================
NEXT_PUBLIC_MOCK_MODE=false
NEXT_PUBLIC_CLAIM_AMOUNT_ETH=0.00004
EOF
```

---

## 🔧 Step 2: Deploy Smart Contract

**Important:** Use the **Backend Signer Address** in the constructor!

### Using Foundry:

```bash
forge create contracts/BaseFarcasterAuthFaucet.sol:BaseFarcasterAuthFaucet \
  --rpc-url https://mainnet.base.org \
  --private-key $YOUR_DEPLOYER_PRIVATE_KEY \
  --constructor-args 0xC3323D12a35081a45d7Ff1F7EeD6f50038CB4637 \
  --verify
```

### Or on Base Sepolia (Testnet):

```bash
forge create contracts/BaseFarcasterAuthFaucet.sol:BaseFarcasterAuthFaucet \
  --rpc-url https://sepolia.base.org \
  --private-key $YOUR_DEPLOYER_PRIVATE_KEY \
  --constructor-args 0xC3323D12a35081a45d7Ff1F7EeD6f50038CB4637 \
  --verify
```

**Save the deployed contract address!**

---

## ✏️ Step 3: Update Contract Address

After deploying, update `.env.local`:

```bash
# Replace the contract address
NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

Or manually edit `.env.local` and replace:
```
NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
```
with your actual deployed address.

---

## 💰 Step 4: Fund the Contract

```bash
# Send 1 ETH to contract
cast send <YOUR_CONTRACT_ADDRESS> \
  --value 1ether \
  --private-key $YOUR_PRIVATE_KEY \
  --rpc-url https://mainnet.base.org
```

---

## 🧪 Step 5: Test Backend Attestation

```bash
npm run dev

# In another terminal:
curl -X POST http://localhost:3000/api/sign-attestation \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "baseId": "test123"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "signature": "0x...",
  "signer": "0xC3323D12a35081a45d7Ff1F7EeD6f50038CB4637"
}
```

✅ If you see this, backend signing works!

---

## 🎯 Step 6: Enable Farcaster in Privy

1. Go to [Privy Dashboard](https://dashboard.privy.io)
2. Select your app
3. Go to **Login Methods**
4. Enable **Farcaster**
5. Save settings

---

## 📋 Quick Reference

| Item | Value |
|------|-------|
| **Privy App ID** | `cmhni9xo30171l50cunm9361e` |
| **Backend Signer Address** | `0xC3323D12a35081a45d7Ff1F7EeD6f50038CB4637` |
| **Backend Signer Private Key** | `0x9d4273e786df16208472dd56b30ea353bcead4e5723099d3014adfe00aa7dca0` |

⚠️ **NEVER share or commit the private key or app secret!**

---

## ✅ Verification Checklist

- [ ] `.env.local` created with all values
- [ ] Privy App ID correct
- [ ] Backend signer private key set
- [ ] Smart contract deployed
- [ ] Contract address updated in `.env.local`
- [ ] Contract funded with ETH
- [ ] Farcaster enabled in Privy dashboard
- [ ] Backend attestation tested successfully

---

## 🚀 You're Ready!

```bash
npm run dev
```

Open http://localhost:3000 and test:
1. Connect with Privy
2. Try claiming with Farcaster (if in Mini-App)
3. Try claiming with Base App (email/wallet)

🎉 **Your Privy + Farcaster faucet is live!**


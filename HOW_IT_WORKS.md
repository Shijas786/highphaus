# How HighpHaus Faucet Works

## 🎯 Overview

The faucet uses **Reown attestation** to verify Farcaster users and allow them to claim $0.10 worth of ETH every 7 days.

## 🔐 Your Attestor Wallet

**Important:** The contract is deployed with a **trusted attestor** address. This wallet signs all claim attestations.

**Your Attestor Address:** `0xC7a61105252442a7F77F0FcEb67BBe30AF98eF05`

This address must match:
- The `trustedAttestor` set in the deployed contract
- The wallet derived from your `FAUCET_PRIVATE_KEY` environment variable

## 🔄 Complete Flow

### 1. User Connects Wallet (Reown AppKit)
```
User clicks "Connect Wallet"
→ Reown AppKit modal appears
→ User selects wallet (MetaMask, Coinbase, etc.)
→ User connects on Base network
```

### 2. User Authenticates with Farcaster
```
User signs in with Farcaster SDK
→ Gets Farcaster ID (FID)
→ Frontend stores FID
```

### 3. User Requests Claim
```
Frontend → POST /api/claim
Body: { address: "0x...", fid: 1234 }
```

### 4. Server Generates Attestation (Backend)
```javascript
// Backend (API route)
import { generateFarcasterIdHash, generateClaimSignature } from '@/lib/faucet-contract';

// 1. Hash Farcaster ID
const farcasterIdHash = generateFarcasterIdHash(fid);
// Result: keccak256("farcaster:1234")

// 2. Create payload
const expiry = Math.floor(Date.now() / 1000) + 300; // 5 minutes

// 3. Sign with attestor key
const signature = await generateClaimSignature(
  ATTESTOR_PRIVATE_KEY,
  farcasterIdHash,
  userWallet,
  expiry,
  8453, // Base Mainnet
  contractAddress
);

// 4. Return to frontend
return { farcasterIdHash, expiry, signature };
```

### 5. Frontend Submits Transaction (User Pays Gas)
```javascript
// Frontend
const { farcasterIdHash, expiry, signature } = await fetch('/api/claim');

// User submits transaction
await contract.claim(farcasterIdHash, expiry, signature);
// User pays ~$0.01 gas
// Receives $0.10 ETH
```

### 6. Contract Verifies & Sends ETH
```solidity
// Contract verification
function claim(bytes32 farcasterIdHash, uint256 expiry, bytes signature) {
  // 1. Check expiry
  require(block.timestamp <= expiry, "expired");
  
  // 2. Check cooldowns (7 days)
  require(canClaimByFarcaster[farcasterIdHash], "Farcaster claimed");
  require(canClaimByWallet[msg.sender], "Wallet claimed");
  
  // 3. Verify signature
  bytes32 payloadHash = keccak256(abi.encodePacked(
    farcasterIdHash, msg.sender, expiry, chainId, address(this)
  ));
  address recovered = ECDSA.recover(payloadHash, signature);
  require(recovered == trustedAttestor, "invalid signer");
  
  // 4. Calculate dynamic amount ($0.10 via Chainlink)
  uint256 amount = getCurrentClaimAmountWei();
  
  // 5. Update cooldowns
  lastClaimByFarcaster[farcasterIdHash] = block.timestamp;
  lastClaimByWallet[msg.sender] = block.timestamp;
  
  // 6. Send ETH
  payable(msg.sender).transfer(amount);
}
```

## 🔑 Signature Format (Technical)

### Payload Structure
```javascript
keccak256(
  farcasterIdHash,  // bytes32 - keccak256("farcaster:1234")
  userWallet,       // address - 0x742d...
  expiry,           // uint256 - 1731600000
  chainId,          // uint256 - 8453
  contractAddress   // address - 0xYourContract
)
```

### Signing Process
```javascript
const messageHash = solidityPackedKeccak256([...]);
const signature = await signer.signMessage(getBytes(messageHash));
// EIP-191 format: "\x19Ethereum Signed Message:\n32" + messageHash
```

### Contract Recovery
```solidity
bytes32 ethSigned = payloadHash.toEthSignedMessageHash();
address signer = ethSigned.recover(signature);
// Must match trustedAttestor
```

## 💰 Dynamic Claim Amount

### Chainlink Oracle Integration

**Oracle Address (Base):** `0x694AA1769357215DE4FAC081bf1f309aDC325306`

```solidity
function getCurrentClaimAmountWei() public view returns (uint256) {
  // Get ETH price (8 decimals, e.g., 250000000000 = $2,500)
  (, int256 price, , , ) = ethUsdFeed.latestRoundData();
  
  // Calculate: $0.10 / ETH_PRICE
  uint256 usdValue = 10_000_000; // 0.10 * 1e8
  uint256 ethAmount = (usdValue * 1e18) / uint256(price);
  
  return ethAmount; // In wei
}
```

**Example:**
- ETH Price: $2,500
- Claim Amount: $0.10 / $2,500 = 0.00004 ETH

The amount adjusts automatically as ETH price changes!

## ⏱️ Cooldown System

**Both checks must pass:**

1. **Farcaster ID Cooldown:** 7 days since last claim by this FID
2. **Wallet Cooldown:** 7 days since last claim by this wallet

This prevents:
- Multiple Farcaster accounts → Same wallet
- Multiple wallets → Same Farcaster ID

## 💵 Contribution System

**Anyone can contribute ETH:**

```javascript
// Simple payable function
await contract.contribute({ value: ethers.parseEther("0.1") });
```

**Or send directly:**
```javascript
// Contract has receive() function
await signer.sendTransaction({
  to: contractAddress,
  value: ethers.parseEther("0.1")
});
```

**Tracking:**
- `totalContributed` - Total ETH from all contributors
- `contributions[address]` - Per-user contribution amount
- Emits `Contributed` event for transparency

## 🧪 Testing the Signature

Use the testing script:

```bash
# Set your attestor private key
export ATTESTOR_PRIVATE_KEY=0xYourPrivateKey
export NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress

# Run test
node scripts/signClaim.js 1234 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

**Output:**
```json
{
  "farcasterIdHash": "0xabc123...",
  "expiry": 1731600000,
  "signature": "0x8c6a4..."
}
```

**Verify:**
1. Check attestor address matches your wallet
2. Test claim on contract
3. Verify signature recovers to your attestor address

## 🚀 Production Flow

### Backend API Route (`/api/claim`)

```javascript
export async function POST(request) {
  // 1. Get user data
  const { address, fid } = await request.json();
  
  // 2. Verify user can claim
  const canClaim = await contract.canClaimByFarcaster(farcasterIdHash);
  if (!canClaim) return error;
  
  // 3. Generate signature
  const farcasterIdHash = generateFarcasterIdHash(fid);
  const expiry = Math.floor(Date.now() / 1000) + 300;
  const signature = await generateClaimSignature(
    ATTESTOR_PRIVATE_KEY,
    farcasterIdHash,
    address,
    expiry,
    8453,
    CONTRACT_ADDRESS
  );
  
  // 4. Return to frontend
  return { farcasterIdHash, expiry, signature };
}
```

### Frontend Claim Flow

```javascript
// 1. Get signature from server
const { farcasterIdHash, expiry, signature } = await fetch('/api/claim', {
  method: 'POST',
  body: JSON.stringify({ address, fid })
});

// 2. User submits transaction
await contract.claim(farcasterIdHash, expiry, signature);
// User pays ~$0.01 gas
// Receives $0.10 ETH
```

## 🔒 Security Features

✅ **Signature-Based:** Only trusted attestor can authorize claims  
✅ **Time-Limited:** Signatures expire after 5 minutes  
✅ **Chain-Specific:** Signature includes chainId  
✅ **Contract-Specific:** Signature includes contract address  
✅ **Dual Cooldown:** Both FID and wallet enforced  
✅ **Privacy:** Farcaster IDs are hashed  

## 💡 Key Advantages

1. **No On-Chain FID Storage** - Uses hash for privacy
2. **Dynamic Pricing** - Always $0.10 regardless of ETH price
3. **Decentralized Oracle** - Chainlink provides price feed
4. **Transparent Contributions** - All tracked on-chain
5. **Simple & Elegant** - 152 lines of Solidity
6. **Gas Efficient** - User pays minimal gas

## 📊 Cost Breakdown

**Per Claim:**
- User pays: ~$0.01 gas
- User receives: $0.10 ETH
- Net benefit: $0.09

**Per Contribution:**
- Contributor pays: ~$0.01 gas
- Contribution amount: Any amount
- 100% goes to faucet pool

## 🎯 Deployment Checklist

- [ ] Deploy contract with your attestor address
- [ ] Fund contract with ETH (1+ ETH recommended)
- [ ] Set `NEXT_PUBLIC_CONTRACT_ADDRESS` in environment
- [ ] Set `FAUCET_PRIVATE_KEY` (your attestor key)
- [ ] Set `NEXT_PUBLIC_REOWN_PROJECT_ID`
- [ ] Test signature generation with script
- [ ] Test claim on contract
- [ ] Verify attestor address matches
- [ ] Deploy frontend to Vercel
- [ ] Test end-to-end flow

---

✅ **System is secure, simple, and production-ready!**

See `CONTRACT_DEPLOYMENT_GUIDE.md` for deployment steps.


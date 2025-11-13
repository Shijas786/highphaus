// Backend signing script for Reown attestation
// This demonstrates how the signature generation works

import { Wallet, ethers } from "ethers";

// 🔐 Replace with your signer private key (KEEP THIS SAFE)
// Your attestor address should be: 0xC7a61105252442a7F77F0FcEb67BBe30AF98eF05
const PRIVATE_KEY = process.env.ATTESTOR_PRIVATE_KEY || process.env.FAUCET_PRIVATE_KEY;

// Base chain + your faucet details
const CHAIN_ID = 8453; // Base Mainnet
const FAUCET_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0xYourDeployedFaucetAddress";

if (!PRIVATE_KEY) {
  console.error("❌ ATTESTOR_PRIVATE_KEY or FAUCET_PRIVATE_KEY not set");
  console.error("💡 Usage: ATTESTOR_PRIVATE_KEY=0xYourKey node scripts/signClaim.js [fid] [wallet]");
  process.exit(1);
}

// Create signer
const signer = new Wallet(PRIVATE_KEY);

console.log("✅ Attestor Address:", signer.address);
console.log("📝 Contract Address:", FAUCET_ADDRESS);
console.log("🔗 Chain ID:", CHAIN_ID);
console.log("");

/**
 * Sign a claim for a Farcaster user
 * @param farcasterId - Farcaster ID string (e.g., "farcaster:1234" or just "1234")
 * @param userWallet - User's wallet address
 * @param expiry - Unix timestamp when signature expires
 * @returns Object with farcasterIdHash, expiry, and signature
 */
export async function signClaim(farcasterId, userWallet, expiry) {
  // Ensure Farcaster ID is in correct format
  const farcasterIdString = farcasterId.toString().startsWith('farcaster:') 
    ? farcasterId 
    : `farcaster:${farcasterId}`;

  // Hash the Farcaster ID for privacy
  const farcasterIdHash = ethers.keccak256(ethers.toUtf8Bytes(farcasterIdString));

  console.log("📋 Farcaster ID String:", farcasterIdString);
  console.log("🔐 Farcaster ID Hash:", farcasterIdHash);

  // Encode the exact payload your contract expects
  const messageHash = ethers.solidityPackedKeccak256(
    ["bytes32", "address", "uint256", "uint256", "address"],
    [farcasterIdHash, userWallet, expiry, CHAIN_ID, FAUCET_ADDRESS]
  );

  console.log("📦 Message Hash:", messageHash);

  // Sign the message (EIP-191 format: "\x19Ethereum Signed Message:\n" + len + message)
  const signature = await signer.signMessage(ethers.getBytes(messageHash));

  console.log("✍️  Signature:", signature);
  console.log("");

  return { farcasterIdHash, expiry, signature };
}

// Example usage (for testing)
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    console.log("🧪 Testing Reown Attestation Signature");
    console.log("━".repeat(60));
    
    const testFid = process.argv[2] || "1234";
    const testWallet = process.argv[3] || "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
    const expiry = Math.floor(Date.now() / 1000) + 300; // expires in 5 minutes

    console.log("Test Parameters:");
    console.log("  Farcaster ID:", testFid);
    console.log("  Wallet:", testWallet);
    console.log("  Expiry:", expiry, "(", new Date(expiry * 1000).toISOString(), ")");
    console.log("");

    const result = await signClaim(testFid, testWallet, expiry);
    
    console.log("━".repeat(60));
    console.log("✅ Result (send these values to frontend):");
    console.log(JSON.stringify(result, null, 2));
    console.log("");
    console.log("💡 Frontend will call:");
    console.log(`contract.claim("${result.farcasterIdHash}", ${result.expiry}, "${result.signature}")`);
    console.log("");
    console.log("🔍 To verify on-chain:");
    console.log("1. User calls contract.claim() with these three values");
    console.log("2. Contract recovers signer from signature");
    console.log(`3. Must match: ${signer.address}`);
  })();
}

// Usage Examples:
//
// Basic test:
//   ATTESTOR_PRIVATE_KEY=0xYOURKEY node scripts/signClaim.js
//
// With specific FID and wallet:
//   ATTESTOR_PRIVATE_KEY=0xYOURKEY node scripts/signClaim.js 1234 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
//
// Use in your API route:
//   import { signClaim } from './signClaim.js';
//   const result = await signClaim(fid, walletAddress, expiry);
//   return result; // Send to frontend


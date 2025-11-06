# Hardhat Deploy Directory

## ⚠️ Configuration Issues

Due to conflicts between Hardhat's ESM requirements and the parent Next.js project structure, we recommend using **Remix IDE** for deployment instead.

## ✅ Recommended: Use Remix IDE

See `../DEPLOY_WITH_METAMASK.md` for simple deployment instructions using Remix + MetaMask.

## Files in This Directory

- `contracts/BaseFarcasterFaucet.sol` - The faucet smart contract
- `scripts/deploy.js` - Deployment script (for reference)
- `hardhat.config.js` - Hardhat configuration

## Contract Details

**BaseFarcasterFaucet.sol** provides:
- Farcaster FID-based claiming
- Chainlink ETH/USD price feed integration
- $0.10 equivalent in ETH per claim
- One claim per Farcaster ID
- Owner withdrawal functions

## Constructor Parameters

When deploying (via Remix or Hardhat):

```
_idRegistry: 0x00000000FcB080bAE665aFAb5e41C7E4CBfD5A61
_priceFeed: 0x694AA1769357215DE4FAC081bf1f309aDC325306
```

## Alternative: Fix Hardhat Setup

If you want to use Hardhat despite the issues:

1. Move this directory outside the Next.js project
2. Or use a Docker container for isolated environment
3. Or use Foundry instead (simpler, works better)

But honestly, **Remix IDE is the easiest solution!** 🎯


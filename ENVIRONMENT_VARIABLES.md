# 🌐 Environment Variables

Use this template when filling out `.env.local` (for the Next.js app) and the project settings on Vercel. Copy each block, fill in actual values, and restart your dev server after changes.

```bash
# Public (exposed to the client)
NEXT_PUBLIC_REOWN_PROJECT_ID=812a62e6f9c92367f945c42fbf5ffcf2
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourFaucetContract
NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=0xYourFaucetContract
NEXT_PUBLIC_BASE_RPC=https://mainnet.base.org
NEXT_PUBLIC_MOCK_MODE=false

# Server-only (API routes / attestor)
BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/your-key
FAUCET_PRIVATE_KEY=0xYourAttestorPrivateKey   # trusted attestor wallet
```

> **Tip:** On Vercel, add each key/value in **Settings → Environment Variables** (Production + Preview + Development) and redeploy so the new values take effect.


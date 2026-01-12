# Reown AppKit Setup Guide

## What is Reown AppKit?

Reown AppKit (formerly WalletConnect AppKit) is a comprehensive toolkit for connecting wallets to your dApp. It provides:
- Universal wallet support (MetaMask, Coinbase, Rainbow, etc.)
- WalletConnect protocol integration
- Beautiful, customizable UI
- Network switching
- Account management

## Installation

Already installed in this project:
```bash
npm install @reown/appkit @reown/appkit-adapter-wagmi
```

## Configuration

### Step 1: Get Your Project ID

1. Go to https://cloud.reown.com
2. Create a free account
3. Create a new project
4. Copy your **Project ID**

### Step 2: Add to Environment Variables

Add to `.env.local`:
```env
NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id_from_reown_cloud
```

### Step 3: Configuration (Already Done)

**File: `src/components/WagmiProviderWrapper.tsx`**
```typescript
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base, baseSepolia } from '@reown/appkit/networks';

// Create wagmi adapter
const wagmiAdapter = new WagmiAdapter({
  networks: [base, baseSepolia],
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID,
  ssr: true,
});

// Create AppKit modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: [base, baseSepolia],
  projectId,
  metadata: {
    name: 'HighpHaus Faucet',
    description: 'Claim free ETH on Base Network',
    url: 'https://highphaus.vercel.app',
    icons: ['https://highphaus.vercel.app/icon.png'],
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#0052FF', // Base Blue
  },
});
```

## Usage in Components

### Connect Button

**Option 1: Use AppKit Button (Automatic)**
```tsx
<appkit-button size="lg" />
```

**Option 2: Custom Button**
```tsx
import { useAppKitAccount } from '@reown/appkit/react';

function MyComponent() {
  const { address, isConnected } = useAppKitAccount();
  
  return (
    <div>
      {!isConnected ? (
        <appkit-button />
      ) : (
        <div>Connected: {address}</div>
      )}
    </div>
  );
}
```

### Check Connection Status
```tsx
import { useAccount } from 'wagmi';

const { address, isConnected } = useAccount();
```

### Network Switching
```tsx
import { useSwitchChain } from 'wagmi';

const { switchChain } = useSwitchChain();

// Switch to Base Mainnet
switchChain({ chainId: 8453 });
```

## Supported Wallets

Reown AppKit supports all major wallets:
- 🦊 MetaMask
- 💙 Coinbase Wallet
- 🌈 Rainbow Wallet
- 🔷 Trust Wallet
- 🦝 Rabby Wallet
- 📱 Mobile wallets via WalletConnect
- 🌐 Browser extension wallets
- And 300+ more wallets

## Custom Styling

The AppKit modal is already themed to match HighpHaus:
- **Accent Color:** #0052FF (Base Blue)
- **Theme:** Dark mode
- **Border Radius:** 4px (athletic/sharp)

To customize further, update `themeVariables` in `WagmiProviderWrapper.tsx`:
```typescript
themeVariables: {
  '--w3m-accent': '#0052FF',
  '--w3m-border-radius-master': '4px',
  '--w3m-font-family': 'Inter, sans-serif',
}
```

## Features

✅ **Multi-Wallet Support** - 300+ wallets
✅ **Network Switching** - Easy chain switching
✅ **Account Management** - Balance, ENS, avatars
✅ **Mobile Support** - QR code for mobile wallets
✅ **Email Login** - Optional email wallet (can be disabled)
✅ **Transaction Notifications** - Built-in toast notifications
✅ **Dark Mode** - Matches your design
✅ **SSR Support** - Works with Next.js App Router

## Benefits Over Previous Setup

| Feature | Old (Injected Only) | New (Reown AppKit) |
|---------|---------------------|-------------------|
| Wallet Support | Browser extensions only | 300+ wallets |
| Mobile Support | ❌ None | ✅ WalletConnect QR |
| UI | Custom button | ✅ Beautiful modal |
| Network Switch | Manual | ✅ Built-in |
| Account Display | Custom | ✅ Built-in |
| Bundle Size | Smaller | Slightly larger (~50KB) |

## Environment Variables

**Required:**
```env
NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id
```

**Full List:**
```env
# Reown AppKit
NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id

# Contract
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# Server Wallet
FAUCET_PRIVATE_KEY=0x...

# RPC
BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_BASE_RPC=https://mainnet.base.org
```

## Troubleshooting

### "Project ID not set" warning
- Add `NEXT_PUBLIC_REOWN_PROJECT_ID` to `.env.local`
- Restart dev server: `npm run dev`

### Wallet not connecting
- Check Project ID is valid
- Verify network configuration (Base Mainnet)
- Check browser console for errors

### Modal not appearing
- Ensure `WagmiProviderWrapper` is in your layout
- Check `createAppKit` is called before rendering
- Verify `projectId` is set

## Links

- **Reown Dashboard:** https://cloud.reown.com
- **Reown Documentation:** https://docs.reown.com/appkit/next/core/installation
- **GitHub Examples:** https://github.com/reown-com/appkit-web-examples

## Implementation in This Project

**File: `src/components/FaucetCard.tsx`**
```tsx
{!isConnected ? (
  <appkit-button size="lg" />
) : (
  <Button onClick={handleClaim}>
    Claim ETH
  </Button>
)}
```

This provides:
- Clean wallet connection UI
- Automatic wallet detection
- Network switching if needed
- Account management
- Beautiful modal interface

---

✅ **Reown AppKit is fully integrated and ready to use!**


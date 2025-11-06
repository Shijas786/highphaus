# 🎯 Farcaster Mini-App Setup Guide

## Overview
This guide will help you publish your highphaus faucet as a Farcaster Mini-App.

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ Vercel deployment live and working
- ✅ All environment variables configured
- ✅ Custom domain (optional but recommended)
- ✅ Farcaster account

---

## 🚀 Step 1: Prepare Your App

### 1.1 Verify Your Deployment

Make sure your site works:
```
https://highp-haus-40m0ns8zx-shijas-projects-45273324.vercel.app
```

Or set up a custom domain:
```
https://highphaus.vercel.app
```

### 1.2 Test All Features

- [ ] Homepage loads
- [ ] Privy Farcaster login works
- [ ] Claim functionality works
- [ ] Mobile responsive

---

## 🔧 Step 2: Register on Farcaster

### Option A: Via Warpcast Developer Portal

1. **Visit:** https://warpcast.com/~/developers
2. **Sign in** with your Farcaster account
3. **Click "Create App"** or "New Mini App"

### Option B: Via Farcaster Hub (Advanced)

For direct integration with Farcaster protocol, see: https://docs.farcaster.xyz

---

## 📝 Step 3: Fill in App Details

### Basic Information

```yaml
App Name: highphaus
Display Name: highphaus - ETH Faucet
Short Description: Get $0.10 worth of ETH instantly on Base Network
Category: DeFi / Utilities
```

### URLs

```yaml
App URL: https://your-domain.vercel.app
Homepage: https://your-domain.vercel.app
Icon URL: https://your-domain.vercel.app/icon.png
```

### Permissions Required

```yaml
✅ user:read - Read user's Farcaster profile
✅ user:wallet - Access user's connected wallet
✅ user:fid - Access user's Farcaster ID
```

---

## 🎨 Step 4: Create Required Assets

### 4.1 App Icon (Required)

Create an app icon and add to your `public/` folder:

**Requirements:**
- Size: 512x512px minimum
- Format: PNG with transparent background
- File: `public/icon.png` or `public/app-icon.png`

### 4.2 Preview Image (Recommended)

For social sharing:
- Size: 1200x630px
- Format: PNG or JPG
- File: `public/og-image.png`

**Example assets to create:**
```
/public/
  ├── icon.png (512x512 - App icon)
  ├── og-image.png (1200x630 - Social preview)
  └── nft-preview.png (Already exists)
```

---

## 🔗 Step 5: Update App Metadata

Add Farcaster-specific metadata to your app:

### Update `src/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  title: 'highphaus - Community ETH Faucet',
  description: 'Get $0.10 worth of ETH instantly on Base. One-time claim per Farcaster ID.',
  keywords: ['highphaus', 'ETH', 'Faucet', 'Base', 'Farcaster'],
  
  // Open Graph (for Warpcast)
  openGraph: {
    title: 'highphaus - Get Free ETH',
    description: 'Claim $0.10 worth of ETH on Base Network',
    type: 'website',
    url: 'https://your-domain.vercel.app',
    images: [
      {
        url: 'https://your-domain.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'highphaus Faucet',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'highphaus - Get Free ETH',
    description: 'Claim $0.10 worth of ETH on Base Network',
    images: ['https://your-domain.vercel.app/og-image.png'],
  },
  
  // Farcaster specific
  other: {
    'fc:frame': 'vNext',
    'fc:app': 'highphaus',
  },
};
```

---

## 🎯 Step 6: Submit for Review

### On Warpcast Developer Portal:

1. **Complete all required fields**
2. **Upload app icon** (512x512px)
3. **Add screenshots** (optional but recommended)
4. **Submit for review**

### Review Checklist

Before submitting, verify:
- [ ] App URL is accessible
- [ ] All permissions are justified
- [ ] Icon meets requirements
- [ ] Description is clear
- [ ] App actually works with Farcaster login
- [ ] Mobile responsive
- [ ] No broken links

---

## 📱 Step 7: Test Your Mini-App

### Test in Warpcast

1. **Open Warpcast app** on mobile
2. **Search for your app** (once approved)
3. **Launch mini-app**
4. **Test full flow:**
   - Login with Farcaster
   - Claim ETH
   - Verify transaction

### Test URLs

Before approval, you can test via direct URL:
```
warpcast://~/mini-app?url=https://your-domain.vercel.app
```

---

## 🎨 Recommended: Create App Assets

### Icon Design Tips

Your app icon should:
- Use your brand colors (#0052FF blue)
- Be simple and recognizable
- Work well at small sizes
- Have transparent background

### Quick Design with Figma/Canva:

**Free Tools:**
- Canva: https://canva.com (templates available)
- Figma: https://figma.com (design from scratch)
- Photopea: https://photopea.com (free Photoshop alternative)

**Or Use AI:**
```
Prompt: "Create a minimalist app icon for 'highphaus' - 
an Ethereum faucet. Use electric blue (#0052FF) and black. 
512x512px, clean, modern, simple geometric shapes."
```

---

## 🔗 Step 8: Configure Deep Links

### Add to `vercel.json`

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "ALLOWALL"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/fc",
      "destination": "/?ref=farcaster",
      "permanent": false
    }
  ]
}
```

---

## 📊 Step 9: Analytics & Monitoring

### Track Farcaster Users

Add to your analytics:

```typescript
// Track Farcaster referrals
if (user?.farcaster?.fid) {
  analytics.track('farcaster_user_connected', {
    fid: user.farcaster.fid,
    username: user.farcaster.username,
  });
}
```

---

## 🚀 Step 10: Launch & Promote

### Once Approved:

1. **Share on Farcaster:**
   ```
   Just launched highphaus! 🏠
   
   Get $0.10 worth of ETH instantly on Base
   One-time claim per Farcaster ID
   
   Try it now: [your mini-app link]
   ```

2. **Create a Cast with frame:**
   - Add your app URL
   - Warpcast will auto-generate preview
   - Users can launch directly

3. **Engage with users:**
   - Reply to casts
   - Share success stories
   - Build community

---

## 🔧 Troubleshooting

### Common Issues

**App won't load in Warpcast:**
- Check X-Frame-Options headers
- Verify HTTPS is working
- Test on mobile browser first

**Login not working:**
- Verify Privy Farcaster integration
- Check environment variables
- Test auth flow on desktop first

**Contract calls failing:**
- Verify contract address
- Check network (Base Sepolia vs Mainnet)
- Ensure wallet has gas

---

## 📚 Resources

- **Farcaster Docs:** https://docs.farcaster.xyz
- **Warpcast Developers:** https://warpcast.com/~/developers
- **Privy Farcaster Integration:** https://docs.privy.io/guide/react/recipes/farcaster
- **Base Network:** https://docs.base.org

---

## ✅ Quick Checklist

Before submitting to Farcaster:

- [ ] App deployed to Vercel
- [ ] Custom domain set up (optional)
- [ ] All environment variables configured
- [ ] App icon created (512x512px)
- [ ] OG image created (1200x630px)
- [ ] Metadata updated in layout.tsx
- [ ] Tested Farcaster login flow
- [ ] Tested claim functionality
- [ ] Mobile responsive verified
- [ ] HTTPS working
- [ ] No console errors

---

**Good luck with your launch!** 🚀

If you need help, tag the Farcaster developer community or reach out on Warpcast!


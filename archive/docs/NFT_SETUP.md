# 🏆 NFT Image Setup

## Your NFT Design

**"HAUS OF 1000 - LIMITED EDITION"**

Your uploaded NFT features:
- 🌀 Digital tunnel/vortex background (blue/black gradient)
- 💎 Floating ETH teardrop icons
- ✨ Glowing blue interconnected panels
- 📝 Central text: "HAUS OF 1000 - LIMITED EDITION"
- 🎨 Futuristic, cyberpunk aesthetic

## How to Add the Image

### Step 1: Save Your Image

Save your NFT design as `nft-preview.png` in the `public/` folder:

```
highp haus/
└── public/
    └── nft-preview.png  ← Your NFT image here
```

### Step 2: Image Specifications

**Recommended specs:**
- **Format**: PNG (with or without transparency)
- **Size**: 800x800px or 1000x1000px (square)
- **Aspect Ratio**: 1:1
- **File Size**: < 500KB for optimal loading
- **Color Mode**: RGB

### Step 3: File Location

The image should be at:
```
/Users/shijas/highp haus/public/nft-preview.png
```

### Step 4: Verify

After adding the image:
1. Refresh your browser (Cmd+Shift+R)
2. Scroll to the "DONATE" section
3. You should see your NFT with a blue glowing border

## Fallback

If the image is not found, a placeholder will show with:
- 💎 Diamond emoji
- Text: "HAUS OF 1000"
- Text: "- LIMITED EDITION -"
- Blue gradient background

## Alternative Image Formats

If you want to use a different format or name:

1. Edit `src/app/page.tsx`
2. Find the line: `src="/nft-preview.png"`
3. Change to your image path: `src="/your-image.jpg"`

## Image Optimization

For production, consider:
- Using Next.js Image component for auto-optimization
- Providing WebP format for better compression
- Using responsive images for different screen sizes

---

**Current Setup**: Image expected at `public/nft-preview.png` ✅


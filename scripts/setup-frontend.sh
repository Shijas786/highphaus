#!/bin/bash

# Base ETH Faucet - Setup Script
# This script sets up the development environment

set -e

echo "🌊 Base ETH Faucet Setup"
echo "========================"
echo ""

# Check Node version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18 or higher is required"
    echo "   Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Check npm version
echo "📦 Checking npm version..."
NPM_VERSION=$(npm -v | cut -d'.' -f1)
if [ "$NPM_VERSION" -lt 9 ]; then
    echo "⚠️  Warning: npm 9 or higher is recommended"
    echo "   Current version: $(npm -v)"
fi
echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📥 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Setup environment file
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ .env.local created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your configuration:"
    echo "   - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID (get from https://cloud.walletconnect.com/)"
    echo "   - NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS (deploy contract or use mock mode)"
    echo ""
else
    echo "ℹ️  .env.local already exists, skipping..."
    echo ""
fi

# Type check
echo "🔍 Running type check..."
npm run type-check
echo "✅ Type check passed"
echo ""

# Success message
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env.local with your WalletConnect Project ID"
echo "  2. Run 'npm run dev' to start the development server"
echo "  3. Open http://localhost:3000 in your browser"
echo ""
echo "For testing without a real contract:"
echo "  Set NEXT_PUBLIC_MOCK_MODE=true in .env.local"
echo ""
echo "Happy coding! 🚀"



# ⚡ Command Cheatsheet

Quick reference for common commands.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your WalletConnect Project ID

# Run development server
npm run dev
```

## 📦 Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Check types
npm run type-check

# Format code
npm run format

# Check formatting
npm run format:check
```

## 🛠️ Setup Scripts

```bash
# Run automated setup
chmod +x scripts/setup-frontend.sh
./scripts/setup-frontend.sh

# Make deploy script executable
chmod +x scripts/deploy-contract.sh
```

## 🔧 Smart Contract (Foundry)

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install dependencies
forge install OpenZeppelin/openzeppelin-contracts

# Compile contracts
forge build

# Deploy to Base Sepolia
forge create contracts/Faucet.sol:Faucet \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY \
  --constructor-args 10000000000000000 86400

# Check contract balance
cast balance CONTRACT_ADDRESS --rpc-url https://sepolia.base.org

# Fund contract
cast send CONTRACT_ADDRESS \
  --value 1ether \
  --private-key $PRIVATE_KEY \
  --rpc-url https://sepolia.base.org
```

## 📊 Utilities

```bash
# Count lines of code
find src -name "*.tsx" -o -name "*.ts" | xargs wc -l

# Find TODO comments
grep -r "TODO" src/

# Check bundle size
npm run build
# Check .next/server for bundle analysis

# Clear cache
rm -rf .next node_modules
npm install
```

## 🌐 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls
```

## 🐛 Debugging

```bash
# Check for TypeScript errors
npm run type-check

# Fix lint errors automatically
npm run lint -- --fix

# Format all files
npm run format

# Check for outdated packages
npm outdated

# Update packages
npm update

# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## 📱 Testing

```bash
# Build and test locally
npm run build
npm start

# Open in browser
open http://localhost:3000

# Test admin panel
open http://localhost:3000/admin
```

## 🔒 Environment Management

```bash
# Copy example env
cp .env.example .env.local

# Edit environment
nano .env.local
# or
code .env.local

# Check env vars (be careful with secrets!)
cat .env.local

# For Vercel - set env var
vercel env add VARIABLE_NAME
```

## 📦 Git Commands

```bash
# Initialize repo
git init

# Add all files
git add .

# Commit
git commit -m "feat: initial commit"

# Add remote
git remote add origin https://github.com/username/repo.git

# Push
git push -u origin main

# Create branch
git checkout -b feature/new-feature

# View status
git status

# View diff
git diff
```

## 🎨 Component Development

```bash
# Create new component
mkdir src/components/NewComponent
touch src/components/NewComponent.tsx

# Create new hook
touch src/hooks/use-new-hook.ts

# Create new API route
mkdir src/app/api/new-route
touch src/app/api/new-route/route.ts
```

## 📊 Performance Checks

```bash
# Analyze bundle
npm run build

# Check lighthouse score (after deploying)
npx lighthouse https://your-domain.com --view

# Check page size
curl -s https://your-domain.com | wc -c
```

## 🔥 Quick Fixes

```bash
# Node modules issue
rm -rf node_modules package-lock.json
npm install

# Next.js cache issue
rm -rf .next
npm run dev

# Port already in use
lsof -ti:3000 | xargs kill
npm run dev

# TypeScript errors
npm run type-check | grep error
```

## 🌟 Productivity Aliases

Add to your `.bashrc` or `.zshrc`:

```bash
# Base Faucet aliases
alias bd="npm run dev"
alias bb="npm run build"
alias bl="npm run lint"
alias bt="npm run type-check"
alias bf="npm run format"
alias bfr="cd '/Users/shijas/highp haus'"
```

Then reload:
```bash
source ~/.zshrc  # or ~/.bashrc
```

## 📚 Documentation

```bash
# View README
cat README.md

# View quick start
cat QUICKSTART.md

# View all markdown files
find . -name "*.md" -not -path "./node_modules/*"
```

## 🎯 One-Line Commands

```bash
# Full setup
npm install && cp .env.example .env.local && npm run dev

# Clean and rebuild
rm -rf .next node_modules && npm install && npm run build

# Lint, type-check, and build
npm run lint && npm run type-check && npm run build

# Format and commit
npm run format && git add . && git commit -m "style: format code"
```

## 🚨 Emergency Commands

```bash
# Kill all node processes
pkill -f node

# Free up port 3000
lsof -ti:3000 | xargs kill -9

# Reset git to last commit
git reset --hard HEAD

# Discard all changes
git checkout .

# Full reset (careful!)
rm -rf .next node_modules .git
npm install
git init
```

## 💡 Tips

- Use `npm run` to see all available scripts
- Add `--help` to most commands for more info
- Use `Ctrl+C` to stop the dev server
- Check `package.json` for script definitions
- Use VS Code extensions for better DX

---

**Save this file for quick reference! ⚡**



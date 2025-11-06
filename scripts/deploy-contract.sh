#!/bin/bash

# Base ETH Faucet - Smart Contract Deployment Script
# This is a template script for deploying the faucet contract

set -e

echo "🚀 Base Faucet Contract Deployment"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if foundry is installed
if ! command -v forge &> /dev/null; then
    echo -e "${RED}❌ Error: Foundry not found${NC}"
    echo "Install Foundry: curl -L https://foundry.paradigm.xyz | bash"
    exit 1
fi

echo -e "${GREEN}✅ Foundry found${NC}"
echo ""

# Configuration
CLAIM_AMOUNT="0.01" # ETH
COOLDOWN_TIME="86400" # 24 hours in seconds
NETWORK="base-sepolia" # or "base-mainnet"

echo "Configuration:"
echo "  Claim Amount: ${CLAIM_AMOUNT} ETH"
echo "  Cooldown: ${COOLDOWN_TIME} seconds (24 hours)"
echo "  Network: ${NETWORK}"
echo ""

# Convert ETH to wei
CLAIM_AMOUNT_WEI=$(echo "${CLAIM_AMOUNT} * 1000000000000000000" | bc)

echo -e "${YELLOW}⚠️  This is a template script${NC}"
echo "To deploy the contract:"
echo ""
echo "1. Install Foundry:"
echo "   curl -L https://foundry.paradigm.xyz | bash"
echo ""
echo "2. Install OpenZeppelin contracts:"
echo "   forge install OpenZeppelin/openzeppelin-contracts"
echo ""
echo "3. Set up your private key:"
echo "   export PRIVATE_KEY=your_private_key_here"
echo ""
echo "4. Get Base Sepolia RPC URL from:"
echo "   https://www.alchemy.com or https://www.infura.io"
echo ""
echo "5. Deploy:"
echo "   forge create src/Faucet.sol:Faucet \\"
echo "     --rpc-url https://sepolia.base.org \\"
echo "     --private-key \$PRIVATE_KEY \\"
echo "     --constructor-args ${CLAIM_AMOUNT_WEI} ${COOLDOWN_TIME} \\"
echo "     --verify"
echo ""
echo "6. Fund the contract:"
echo "   cast send <CONTRACT_ADDRESS> --value 1ether --private-key \$PRIVATE_KEY --rpc-url https://sepolia.base.org"
echo ""
echo "7. Update .env.local with the deployed contract address"
echo ""
echo "For mainnet deployment, use:"
echo "  - RPC: https://mainnet.base.org"
echo "  - Ensure sufficient ETH for gas and initial funding"
echo ""

# Uncomment below to actually deploy (after setting up environment)
# echo -e "${YELLOW}Press ENTER to deploy or CTRL+C to cancel${NC}"
# read

# forge create contracts/Faucet.sol:Faucet \
#   --rpc-url ${RPC_URL} \
#   --private-key ${PRIVATE_KEY} \
#   --constructor-args ${CLAIM_AMOUNT_WEI} ${COOLDOWN_TIME} \
#   --verify

# echo -e "${GREEN}✅ Contract deployed!${NC}"
# echo "Update your .env.local with the contract address"



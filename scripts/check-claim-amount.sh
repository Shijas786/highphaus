#!/bin/bash

# ETH Claim Amount Monitoring Script
# Checks if the faucet claim amount needs updating based on current ETH price

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Checking ETH Claim Amount Status"
echo "===================================="
echo ""

# Your deployment URL (change this!)
SITE_URL="${SITE_URL:-http://localhost:3000}"
API_URL="$SITE_URL/api/admin/update-claim-amount"

echo "Fetching data from: $API_URL"
echo ""

# Fetch recommendation
RESPONSE=$(curl -s "$API_URL")

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Failed to fetch data from API${NC}"
  exit 1
fi

# Parse response
ETH_PRICE=$(echo $RESPONSE | jq -r '.currentEthPrice')
RECOMMENDED_ETH=$(echo $RESPONSE | jq -r '.recommended.ethAmount')
RECOMMENDED_WEI=$(echo $RESPONSE | jq -r '.recommended.weiAmount')

# Display current status
echo "📊 Current Status:"
echo "  ETH Price: \$$ETH_PRICE"
echo "  Target Value: \$0.10 USD"
echo ""

echo "💡 Recommended Claim Amount:"
echo "  ETH: $RECOMMENDED_ETH"
echo "  Wei: $RECOMMENDED_WEI"
echo ""

# Show update command
echo "🔧 To update your contract, run:"
echo ""
echo -e "${GREEN}cast send <FAUCET_ADDRESS> \\"
echo "  \"setClaimAmount(uint256)\" \\"
echo "  $RECOMMENDED_WEI \\"
echo "  --private-key \$PRIVATE_KEY \\"
echo -e "  --rpc-url https://mainnet.base.org${NC}"
echo ""

# Or show Foundry command
echo "Or using environment variable:"
echo ""
echo -e "${GREEN}forge script scripts/UpdateClaimAmount.s.sol:UpdateClaimAmount \\"
echo "  --rpc-url \$BASE_RPC_URL \\"
echo "  --private-key \$PRIVATE_KEY \\"
echo -e "  --broadcast${NC}"
echo ""

echo "✅ Done!"


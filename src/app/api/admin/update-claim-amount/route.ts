import { NextRequest, NextResponse } from 'next/server';
import { getRecommendedClaimAmount } from '@/lib/claim-amount-calculator';

/**
 * Admin API to calculate recommended claim amount based on current ETH price
 * This helps maintain $0.10 USD value per claim
 */
export async function GET(_request: NextRequest) {
  try {
    // Fetch current ETH price
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch ETH price');
    }
    
    const data = await response.json();
    const ethPrice = data.ethereum?.usd;
    
    if (!ethPrice) {
      throw new Error('Invalid price data');
    }
    
    // Calculate recommended claim amount for $0.10 USD
    const recommendation = getRecommendedClaimAmount(0.10, ethPrice);
    
    return NextResponse.json({
      success: true,
      currentEthPrice: ethPrice,
      targetUsdValue: 0.10,
      recommended: {
        ethAmount: recommendation.ethAmount,
        weiAmount: recommendation.weiAmount.toString(),
        displayValue: `${recommendation.ethAmount} ETH ≈ $0.10 USD`,
      },
      instructions: {
        message: 'Update your faucet contract with this claim amount',
        solidityCall: `faucet.setClaimAmount(${recommendation.weiAmount.toString()})`,
        foundryCommand: `cast send ${process.env.NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS} "setClaimAmount(uint256)" ${recommendation.weiAmount.toString()} --private-key $PRIVATE_KEY`,
      },
    });
  } catch (error) {
    console.error('Failed to calculate claim amount:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate claim amount',
      },
      { status: 500 }
    );
  }
}

/**
 * Check if claim amount needs updating
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentClaimAmountWei } = body;
    
    if (!currentClaimAmountWei) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing currentClaimAmountWei',
        },
        { status: 400 }
      );
    }
    
    // Fetch current ETH price
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    );
    
    const data = await response.json();
    const ethPrice = data.ethereum?.usd || 2500;
    
    // Calculate current USD value
    const currentEthAmount = Number(currentClaimAmountWei) / 1e18;
    const currentUsdValue = currentEthAmount * ethPrice;
    const targetUsdValue = 0.10;
    
    // Check if deviation is more than 10%
    const deviation = Math.abs(currentUsdValue - targetUsdValue) / targetUsdValue;
    const needsUpdate = deviation > 0.1;
    
    const recommendation = getRecommendedClaimAmount(targetUsdValue, ethPrice);
    
    return NextResponse.json({
      success: true,
      needsUpdate,
      currentStatus: {
        claimAmountWei: currentClaimAmountWei,
        claimAmountEth: currentEthAmount.toFixed(8),
        currentUsdValue: currentUsdValue.toFixed(4),
        targetUsdValue,
        deviation: `${(deviation * 100).toFixed(2)}%`,
      },
      recommendation: needsUpdate ? {
        newClaimAmountWei: recommendation.weiAmount.toString(),
        newClaimAmountEth: recommendation.ethAmount,
        ethPrice,
      } : null,
    });
  } catch (error) {
    console.error('Failed to check claim amount:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check claim amount',
      },
      { status: 500 }
    );
  }
}


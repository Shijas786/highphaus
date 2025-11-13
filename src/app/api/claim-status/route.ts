import { NextRequest, NextResponse } from 'next/server';
import { FaucetContract, generateFarcasterIdHash } from '@/lib/faucet-contract';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
const RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fid = searchParams.get('fid');
    const address = searchParams.get('address');

    if (!fid || !address) {
      return NextResponse.json(
        { success: false, error: 'FID and address are required' },
        { status: 400 }
      );
    }

    if (!CONTRACT_ADDRESS) {
      return NextResponse.json(
        { success: false, error: 'Contract address not configured' },
        { status: 500 }
      );
    }

    const fidNumber = parseInt(fid);
    if (isNaN(fidNumber) || fidNumber <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid FID' },
        { status: 400 }
      );
    }

    // Initialize contract
    const faucetContract = new FaucetContract(CONTRACT_ADDRESS, RPC_URL);

    // Generate Farcaster ID hash
    const farcasterIdHash = generateFarcasterIdHash(fidNumber);

    // Get claim status for both Farcaster and wallet
    const [
      canClaimFarcaster,
      canClaimWallet,
      timeUntilFarcaster,
      timeUntilWallet,
      claimAmount,
    ] = await Promise.all([
      faucetContract.canClaimByFarcaster(farcasterIdHash),
      faucetContract.canClaimByWallet(address),
      faucetContract.getTimeUntilNextClaimFarcaster(farcasterIdHash),
      faucetContract.getTimeUntilNextClaimWallet(address),
      faucetContract.getCurrentClaimAmountWei(),
    ]);

    // User can only claim if BOTH conditions are met
    const canClaim = canClaimFarcaster && canClaimWallet;
    const secondsUntilClaim = Math.max(timeUntilFarcaster, timeUntilWallet);

    return NextResponse.json(
      {
        success: true,
        data: {
          canClaim,
          canClaimFarcaster,
          canClaimWallet,
          secondsUntilClaim,
          claimAmountWei: claimAmount.toString(),
          fid: fidNumber,
          farcasterIdHash,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking claim status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check claim status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

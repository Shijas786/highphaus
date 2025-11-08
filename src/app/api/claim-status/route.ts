import { NextRequest, NextResponse } from 'next/server';
import { FaucetContract } from '@/lib/faucet-contract';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
const RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fid = searchParams.get('fid');

    if (!fid) {
      return NextResponse.json(
        { success: false, error: 'FID is required' },
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

    // Get claim status
    const [canClaim, nextClaimTime, secondsUntilClaim, hasClaimed] = await Promise.all([
      faucetContract.canClaim(fidNumber),
      faucetContract.getNextClaimTime(fidNumber),
      faucetContract.getTimeUntilNextClaim(fidNumber),
      faucetContract.hasClaimed(fidNumber),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          canClaim,
          nextClaimTime,
          secondsUntilClaim,
          hasClaimed,
          fid: fidNumber,
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


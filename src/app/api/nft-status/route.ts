import { NextRequest, NextResponse } from 'next/server';
import { FaucetContract } from '@/lib/faucet-contract';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
const RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');
    const fid = searchParams.get('fid');

    if (!address || !fid) {
      return NextResponse.json(
        { success: false, error: 'Address and FID are required' },
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

    // Get NFT eligibility and minting status
    const [
      contribution,
      isEligibleForOG,
      hasOGMinted,
      hasClaimed,
      hasClaimerMinted,
    ] = await Promise.all([
      faucetContract.getContribution(address),
      faucetContract.isEligibleForOGNFT(address),
      faucetContract.hasOGNFT(address),
      faucetContract.hasClaimed(fidNumber),
      faucetContract.hasClaimerNFT(fidNumber),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          ogNFT: {
            eligible: isEligibleForOG,
            minted: hasOGMinted,
            contribution: contribution.toString(),
          },
          claimerNFT: {
            eligible: hasClaimed && !hasClaimerMinted,
            minted: hasClaimerMinted,
            hasClaimed,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking NFT status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check NFT status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


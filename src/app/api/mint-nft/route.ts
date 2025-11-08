import { NextRequest, NextResponse } from 'next/server';
import { FaucetContract } from '@/lib/faucet-contract';
import { z } from 'zod';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
const RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
const FAUCET_PRIVATE_KEY = process.env.FAUCET_PRIVATE_KEY!;

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MintNFTSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  fid: z.number().int().positive().optional(),
  nftType: z.enum(['og', 'claimer']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, fid, nftType } = MintNFTSchema.parse(body);

    if (!CONTRACT_ADDRESS || !FAUCET_PRIVATE_KEY) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Initialize contract
    const faucetContract = new FaucetContract(CONTRACT_ADDRESS, RPC_URL);

    // Verify eligibility
    if (nftType === 'og') {
      const isEligible = await faucetContract.isEligibleForOGNFT(address);
      if (!isEligible) {
        return NextResponse.json(
          { success: false, error: 'Not eligible for OG NFT' },
          { status: 400 }
        );
      }
    } else if (nftType === 'claimer') {
      if (!fid) {
        return NextResponse.json(
          { success: false, error: 'FID required for Claimer NFT' },
          { status: 400 }
        );
      }

      const hasClaimed = await faucetContract.hasClaimed(fid);
      const hasNFT = await faucetContract.hasClaimerNFT(fid);

      if (!hasClaimed) {
        return NextResponse.json(
          { success: false, error: 'Must claim gas before minting Claimer NFT' },
          { status: 400 }
        );
      }

      if (hasNFT) {
        return NextResponse.json(
          { success: false, error: 'Already minted Claimer NFT' },
          { status: 400 }
        );
      }
    }

    // Mint NFT (server pays gas)
    const contractWithSigner = faucetContract.getContractWithSigner(FAUCET_PRIVATE_KEY);
    
    let tx;
    if (nftType === 'og') {
      tx = await contractWithSigner.mintOGNFT(address);
    } else {
      tx = await contractWithSigner.mintClaimerNFT(fid, address);
    }

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    return NextResponse.json(
      {
        success: true,
        txHash: receipt.hash,
        nftType,
        message: `${nftType === 'og' ? 'OG' : 'Claimer'} NFT minted successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('NFT minting error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'NFT minting failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'Use POST to mint NFT',
    },
    { status: 200 }
  );
}


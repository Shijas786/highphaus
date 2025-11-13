import { NextRequest, NextResponse } from 'next/server';
import { FaucetContract, generateClaimSignature, generateFarcasterIdHash } from '@/lib/faucet-contract';
import { z } from 'zod';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
const RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
const ATTESTOR_PRIVATE_KEY = process.env.FAUCET_PRIVATE_KEY!;
const CHAIN_ID = 8453; // Base Mainnet

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ClaimSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  fid: z.number().int().positive(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, fid } = ClaimSchema.parse(body);

    if (!CONTRACT_ADDRESS || !ATTESTOR_PRIVATE_KEY) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Initialize contract
    const faucetContract = new FaucetContract(CONTRACT_ADDRESS, RPC_URL);

    // Generate Farcaster ID hash
    const farcasterIdHash = generateFarcasterIdHash(fid);

    // Check if can claim (both Farcaster and wallet)
    const [canClaimFarcaster, canClaimWallet] = await Promise.all([
      faucetContract.canClaimByFarcaster(farcasterIdHash),
      faucetContract.canClaimByWallet(address),
    ]);

    if (!canClaimFarcaster) {
      const timeUntil = await faucetContract.getTimeUntilNextClaimFarcaster(farcasterIdHash);
      return NextResponse.json(
        {
          success: false,
          error: 'Farcaster ID claimed recently',
          secondsUntilClaim: timeUntil,
        },
        { status: 400 }
      );
    }

    if (!canClaimWallet) {
      const timeUntil = await faucetContract.getTimeUntilNextClaimWallet(address);
      return NextResponse.json(
        {
          success: false,
          error: 'Wallet claimed recently',
          secondsUntilClaim: timeUntil,
        },
        { status: 400 }
      );
    }

    // Generate expiry (5 minutes from now)
    const expiry = Math.floor(Date.now() / 1000) + 300;

    // Generate Reown attestation signature
    const signature = await generateClaimSignature(
      ATTESTOR_PRIVATE_KEY,
      farcasterIdHash,
      address,
      expiry,
      CHAIN_ID,
      CONTRACT_ADDRESS
    );

    return NextResponse.json(
      {
        success: true,
        farcasterIdHash,
        expiry,
        signature,
        message: 'Signature generated - user will submit transaction',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Claim error:', error);
    
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
        error: 'Claim failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'Use POST to get claim signature',
    },
    { status: 200 }
  );
}

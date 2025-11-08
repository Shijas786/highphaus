import { NextRequest, NextResponse } from 'next/server';
import { FaucetContract, generateClaimSignature } from '@/lib/faucet-contract';
import { z } from 'zod';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
const RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
const FAUCET_PRIVATE_KEY = process.env.FAUCET_PRIVATE_KEY!;

const ClaimSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  fid: z.number().int().positive(),
});

// In-memory nonce tracker (use Redis/database in production)
let nonceCounter = Date.now();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, fid } = ClaimSchema.parse(body);

    if (!CONTRACT_ADDRESS || !FAUCET_PRIVATE_KEY) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Initialize contract
    const faucetContract = new FaucetContract(CONTRACT_ADDRESS, RPC_URL);

    // Check if user can claim
    const canClaim = await faucetContract.canClaim(fid);
    if (!canClaim) {
      const timeUntilClaim = await faucetContract.getTimeUntilNextClaim(fid);
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot claim yet',
          secondsUntilClaim: timeUntilClaim,
        },
        { status: 400 }
      );
    }

    // Generate unique nonce
    const nonce = nonceCounter++;

    // Generate signature for gasless claim
    const signature = await generateClaimSignature(
      FAUCET_PRIVATE_KEY,
      address,
      fid,
      nonce
    );

    // Execute gasless claim (server pays gas)
    const contractWithSigner = faucetContract.getContractWithSigner(FAUCET_PRIVATE_KEY);
    const tx = await contractWithSigner.claimGasless(fid, nonce, signature);
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();

    return NextResponse.json(
      {
        success: true,
        txHash: receipt.hash,
        message: 'Claim successful',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Claim error:', error);
    
    // Handle specific error cases
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
      message: 'Use POST to claim ETH',
    },
    { status: 200 }
  );
}

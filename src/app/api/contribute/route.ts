import { NextRequest, NextResponse } from 'next/server';
import { FaucetContract } from '@/lib/faucet-contract';
import { z } from 'zod';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
const RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ContributeSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, txHash } = ContributeSchema.parse(body);

    if (!CONTRACT_ADDRESS) {
      return NextResponse.json(
        { success: false, error: 'Contract address not configured' },
        { status: 500 }
      );
    }

    // Initialize contract to verify contribution
    const faucetContract = new FaucetContract(CONTRACT_ADDRESS, RPC_URL);
    const contribution = await faucetContract.getContribution(address);

    return NextResponse.json(
      {
        success: true,
        txHash,
        totalContribution: contribution.toString(),
        message: 'Contribution recorded',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contribute logging error:', error);
    
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
        error: 'Failed to log contribution',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Address is required' },
        { status: 400 }
      );
    }

    if (!CONTRACT_ADDRESS) {
      return NextResponse.json(
        { success: false, error: 'Contract address not configured' },
        { status: 500 }
      );
    }

    const faucetContract = new FaucetContract(CONTRACT_ADDRESS, RPC_URL);
    const contribution = await faucetContract.getContribution(address);

    return NextResponse.json(
      {
        success: true,
        address,
        totalContribution: contribution.toString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting contribution:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get contribution',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


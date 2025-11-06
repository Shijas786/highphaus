import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ClaimSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
});

// In-memory storage for demo (use database in production)
const claimLog: Array<{
  address: string;
  txHash: string;
  timestamp: number;
}> = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, txHash } = ClaimSchema.parse(body);

    // Log the claim
    claimLog.push({
      address,
      txHash,
      timestamp: Date.now(),
    });

    // Update localStorage (client-side) via response
    // In production, this would update a database
    console.log(`Claim logged: ${address} - ${txHash}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Claim logged successfully',
      },
      { status: 200 }
    );
  } catch (error) {
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
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      claims: claimLog,
      total: claimLog.length,
    },
    { status: 200 }
  );
}



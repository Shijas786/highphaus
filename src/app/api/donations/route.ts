import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const DonationSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  token: z.string(),
  amount: z.string(),
});

// In-memory storage for demo (use database in production)
const donations: Array<{
  address: string;
  txHash: string;
  token: string;
  amount: string;
  timestamp: number;
}> = [];

// Track addresses eligible for NFT (donated >= $1)
const nftEligibleAddresses = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, txHash, token, amount } = DonationSchema.parse(body);

    // Log the donation
    donations.push({
      address,
      txHash,
      token,
      amount,
      timestamp: Date.now(),
    });

    // Mark as NFT eligible (assuming donation >= $1)
    nftEligibleAddresses.add(address.toLowerCase());

    console.log(`Donation logged: ${address} - ${amount} ${token} - ${txHash}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Donation logged successfully',
        nftEligible: true,
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (address) {
    // Check if address is eligible for NFT
    const eligible = nftEligibleAddresses.has(address.toLowerCase());
    const userDonations = donations.filter(
      (d) => d.address.toLowerCase() === address.toLowerCase()
    );

    return NextResponse.json({
      eligible,
      donations: userDonations,
      total: userDonations.length,
    });
  }

  return NextResponse.json({
    donations,
    total: donations.length,
    totalNftEligible: nftEligibleAddresses.size,
  });
}

import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo (use database in production)
// Tracks wallets that have EVER claimed (one-time only)
const claimedWallets = new Set<string>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        {
          eligible: false,
          reason: 'Invalid address',
        },
        { status: 400 }
      );
    }

    const addressLower = address.toLowerCase();

    // ONE-TIME CLAIM ONLY: Check if wallet has ever claimed
    if (claimedWallets.has(addressLower)) {
      return NextResponse.json({
        eligible: false,
        reason: 'Already claimed - One claim per wallet only',
        hasClaimed: true,
      });
    }

    return NextResponse.json({
      eligible: true,
      hasClaimed: false,
    });
  } catch (error) {
    console.error('Eligibility check error:', error);
    return NextResponse.json(
      {
        eligible: false,
        reason: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body;

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid address',
        },
        { status: 400 }
      );
    }

    // Record that this wallet has claimed (ONE-TIME ONLY)
    claimedWallets.add(address.toLowerCase());

    return NextResponse.json({
      success: true,
      message: 'Claim recorded - wallet marked as claimed',
    });
  } catch (error) {
    console.error('Record claim error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

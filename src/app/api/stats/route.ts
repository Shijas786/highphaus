import { NextResponse } from 'next/server';
import { MOCK_STATS } from '@/config/constants';

// In-memory storage for demo (use database in production)
const stats = { ...MOCK_STATS };

export async function GET() {
  try {
    // In production, fetch from database
    // For now, return mock stats with some variation
    const currentStats = {
      ...stats,
      lastClaimTime: Date.now() - Math.floor(Math.random() * 1000 * 60 * 5),
      claimsPerMinute: parseFloat((Math.random() * 2).toFixed(2)),
    };

    return NextResponse.json(currentStats, { status: 200 });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch stats',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Update stats (admin only in production)
    if (body.totalClaimed !== undefined) {
      stats.totalClaimed = body.totalClaimed;
    }
    if (body.totalClaimants !== undefined) {
      stats.totalClaimants = body.totalClaimants;
    }
    if (body.contractBalance !== undefined) {
      stats.contractBalance = body.contractBalance;
    }

    return NextResponse.json(
      {
        success: true,
        stats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Stats update error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update stats',
      },
      { status: 500 }
    );
  }
}

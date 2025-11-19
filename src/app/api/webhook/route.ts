import { NextRequest, NextResponse } from 'next/server';

/**
 * Farcaster webhook endpoint
 * Receives notifications from Farcaster when users interact with your mini-app
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // eslint-disable-next-line no-console
    console.log('Farcaster webhook received:', body);

    // Handle different webhook events
    const { event, data } = body;

    switch (event) {
      case 'frame.added':
        // eslint-disable-next-line no-console
        console.log('User added frame:', data);
        break;
      case 'frame.removed':
        // eslint-disable-next-line no-console
        console.log('User removed frame:', data);
        break;
      case 'user.action':
        // eslint-disable-next-line no-console
        console.log('User action:', data);
        break;
      default:
        // eslint-disable-next-line no-console
        console.log('Unknown event:', event);
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook received',
    });
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Webhook error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Webhook processing failed',
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Farcaster webhook endpoint is active',
  });
}

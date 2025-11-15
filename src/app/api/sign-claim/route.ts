import { NextRequest, NextResponse } from 'next/server';
import { Wallet, ethers } from 'ethers';

const CHAIN_ID = 8453; // Base Mainnet by default

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const farcasterId = searchParams.get('farcasterId');
    const userWallet = searchParams.get('userWallet');
    const expiry = searchParams.get('expiry');

    if (!farcasterId || !userWallet || !expiry) {
      return NextResponse.json(
        { error: 'Missing farcasterId, userWallet, or expiry' },
        { status: 400 }
      );
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(userWallet)) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
    }

    const expiryInt = Number(expiry);
    if (!Number.isFinite(expiryInt) || expiryInt <= 0) {
      return NextResponse.json({ error: 'Invalid expiry value' }, { status: 400 });
    }

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (!contractAddress) {
      console.error('NEXT_PUBLIC_CONTRACT_ADDRESS missing');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const attestorKey = process.env.FAUCET_PRIVATE_KEY || process.env.ATTESTOR_PRIVATE_KEY;
    if (!attestorKey) {
      console.error('FAUCET_PRIVATE_KEY / ATTESTOR_PRIVATE_KEY not configured');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const signer = new Wallet(attestorKey);
    const farcasterIdHash = ethers.keccak256(
      ethers.toUtf8Bytes(
        farcasterId.startsWith('farcaster:') ? farcasterId : `farcaster:${farcasterId}`
      )
    );

    const messageHash = ethers.solidityPackedKeccak256(
      ['bytes32', 'address', 'uint256', 'uint256', 'address'],
      [farcasterIdHash, userWallet, expiryInt, CHAIN_ID, contractAddress]
    );

    const signature = await signer.signMessage(ethers.getBytes(messageHash));

    return NextResponse.json(
      { farcasterIdHash, expiry: expiryInt, signature },
      { status: 200 }
    );
  } catch (error) {
    console.error('signClaim error:', error);
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }
}


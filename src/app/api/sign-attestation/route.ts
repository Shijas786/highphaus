import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

/**
 * Backend attestation endpoint for Base App users
 * Signs a message proving that a wallet/baseId combo is verified
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet, baseId } = body;

    if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      return NextResponse.json(
        { success: false, error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    if (!baseId) {
      return NextResponse.json({ success: false, error: 'Missing baseId' }, { status: 400 });
    }

    //Get backend signer private key
    const signerPrivateKey = process.env.SIGNER_PRIVATE_KEY;

    if (!signerPrivateKey) {
      console.error('SIGNER_PRIVATE_KEY not configured');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Create signer
    const signer = new ethers.Wallet(signerPrivateKey);

    // Create message hash matching contract's logic:
    // bytes32 digest = keccak256(abi.encodePacked(wallet, "baseapp", baseId, contractAddress))
    const faucetContract = process.env.NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS;

    const digest = ethers.solidityPackedKeccak256(
      ['address', 'string', 'string', 'address'],
      [wallet, 'baseapp', baseId, faucetContract]
    );

    // Sign the digest using signMessage() which applies EIP-191 prefix automatically
    // This matches the contract's ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", digest))
    const signature = await signer.signMessage(ethers.getBytes(digest));

    return NextResponse.json({
      success: true,
      signature,
      wallet,
      baseId,
      signer: signer.address,
    });
  } catch (error: any) {
    console.error('Attestation signing error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sign attestation',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

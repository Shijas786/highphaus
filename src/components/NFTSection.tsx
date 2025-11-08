'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNFTStatus } from '@/hooks/use-nft-status';
import { useMintNFT } from '@/hooks/use-mint-nft';
import { useAccount } from 'wagmi';
import { Loader2, Award, Trophy, CheckCircle2, Lock } from 'lucide-react';
import { formatUSDC } from '@/lib/faucet-contract';

export function NFTSection() {
  const { isConnected } = useAccount();
  const { data: nftStatus, isLoading: statusLoading, refetch } = useNFTStatus();
  const { mintOGNFT, mintClaimerNFT, isLoading: mintLoading, txHash } = useMintNFT();

  const handleMintOG = async () => {
    await mintOGNFT();
    // Refresh NFT status after minting
    setTimeout(() => refetch(), 2000);
  };

  const handleMintClaimer = async () => {
    await mintClaimerNFT();
    // Refresh NFT status after minting
    setTimeout(() => refetch(), 2000);
  };

  if (!isConnected) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-400">Connect your wallet to view NFT eligibility</p>
      </Card>
    );
  }

  if (statusLoading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-baseBlue" />
        <p className="text-gray-400">Loading NFT status...</p>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* OG Contributor NFT Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          className="relative overflow-hidden h-full"
          style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            border: '3px solid #FFD700',
          }}
        >
          <div className="relative z-10 p-8 space-y-6">
            {/* Icon */}
            <div className="flex items-center justify-between">
              <div
                className="inline-flex items-center justify-center w-16 h-16"
                style={{ background: '#000000' }}
              >
                <Trophy className="w-8 h-8" style={{ color: '#FFD700' }} />
              </div>
              {nftStatus?.ogNFT.minted && (
                <div className="flex items-center gap-2 px-4 py-2" style={{ background: '#000000' }}>
                  <CheckCircle2 className="w-4 h-4" style={{ color: '#00FF00' }} />
                  <span className="text-xs font-black uppercase" style={{ color: '#FFFFFF' }}>
                    Minted
                  </span>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <h3 className="text-3xl font-black uppercase mb-2" style={{ color: '#000000' }}>
                OG Contributor
              </h3>
              <p className="text-sm font-bold" style={{ color: '#000000CC' }}>
                Exclusive NFT for supporters who contribute USDC
              </p>
            </div>

            {/* Status */}
            <div
              className="p-4"
              style={{
                background: '#00000020',
                border: '2px solid #000000',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase" style={{ color: '#000000' }}>
                  Your Contribution
                </span>
                <span className="text-lg font-black" style={{ color: '#000000' }}>
                  {nftStatus?.ogNFT.contribution
                    ? `${parseFloat(formatUSDC(BigInt(nftStatus.ogNFT.contribution))).toFixed(2)} USDC`
                    : '0 USDC'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {nftStatus?.ogNFT.eligible ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" style={{ color: '#00FF00' }} />
                    <span className="text-xs font-bold" style={{ color: '#000000' }}>
                      Eligible to mint
                    </span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" style={{ color: '#FF0000' }} />
                    <span className="text-xs font-bold" style={{ color: '#000000' }}>
                      Contribute ≥1 USDC to unlock
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Mint button */}
            {nftStatus?.ogNFT.minted ? (
              <div className="text-center p-6" style={{ background: '#00000020' }}>
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: '#00FF00' }} />
                <p className="text-sm font-black uppercase" style={{ color: '#000000' }}>
                  OG NFT Already Minted
                </p>
              </div>
            ) : (
              <Button
                onClick={handleMintOG}
                disabled={!nftStatus?.ogNFT.eligible || mintLoading}
                className="w-full py-6 font-black text-xl uppercase"
                style={{
                  background: '#000000',
                  color: '#FFD700',
                }}
              >
                {mintLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Minting...</span>
                  </>
                ) : (
                  <>
                    <Trophy className="w-5 h-5" />
                    <span>Mint OG NFT (Gasless)</span>
                  </>
                )}
              </Button>
            )}

            {/* Transaction link */}
            {txHash && (
              <motion.a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xs font-bold uppercase hover:underline"
                style={{ color: '#000000' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                View Transaction →
              </motion.a>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Claimer NFT Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card
          className="relative overflow-hidden h-full"
          style={{
            background: 'linear-gradient(135deg, #0052FF 0%, #00D4FF 100%)',
            border: '3px solid #0052FF',
          }}
        >
          <div className="relative z-10 p-8 space-y-6">
            {/* Icon */}
            <div className="flex items-center justify-between">
              <div
                className="inline-flex items-center justify-center w-16 h-16"
                style={{ background: '#FFFFFF' }}
              >
                <Award className="w-8 h-8" style={{ color: '#0052FF' }} />
              </div>
              {nftStatus?.claimerNFT.minted && (
                <div className="flex items-center gap-2 px-4 py-2" style={{ background: '#FFFFFF' }}>
                  <CheckCircle2 className="w-4 h-4" style={{ color: '#00FF00' }} />
                  <span className="text-xs font-black uppercase" style={{ color: '#000000' }}>
                    Minted
                  </span>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <h3 className="text-3xl font-black uppercase mb-2" style={{ color: '#FFFFFF' }}>
                Gas Claimer
              </h3>
              <p className="text-sm font-bold" style={{ color: '#FFFFFFCC' }}>
                Commemorative NFT for users who claim gas
              </p>
            </div>

            {/* Status */}
            <div
              className="p-4"
              style={{
                background: '#FFFFFF20',
                border: '2px solid #FFFFFF',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase" style={{ color: '#FFFFFF' }}>
                  Claim Status
                </span>
                <span className="text-lg font-black" style={{ color: '#FFFFFF' }}>
                  {nftStatus?.claimerNFT.hasClaimed ? 'Claimed ✓' : 'Not Claimed'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {nftStatus?.claimerNFT.eligible ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" style={{ color: '#00FF00' }} />
                    <span className="text-xs font-bold" style={{ color: '#FFFFFF' }}>
                      Eligible to mint
                    </span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" style={{ color: '#FFFF00' }} />
                    <span className="text-xs font-bold" style={{ color: '#FFFFFF' }}>
                      Claim gas to unlock
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Mint button */}
            {nftStatus?.claimerNFT.minted ? (
              <div className="text-center p-6" style={{ background: '#FFFFFF20' }}>
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: '#00FF00' }} />
                <p className="text-sm font-black uppercase" style={{ color: '#FFFFFF' }}>
                  Claimer NFT Already Minted
                </p>
              </div>
            ) : (
              <Button
                onClick={handleMintClaimer}
                disabled={!nftStatus?.claimerNFT.eligible || mintLoading}
                className="w-full py-6 font-black text-xl uppercase"
                style={{
                  background: '#FFFFFF',
                  color: '#0052FF',
                }}
              >
                {mintLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Minting...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-5 h-5" />
                    <span>Mint Claimer NFT (Gasless)</span>
                  </>
                )}
              </Button>
            )}

            {/* Transaction link */}
            {txHash && (
              <motion.a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xs font-bold uppercase hover:underline"
                style={{ color: '#FFFFFF' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                View Transaction →
              </motion.a>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}


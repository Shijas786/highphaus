'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { formatAddress } from '@/lib/utils';
import { Droplet, Loader2, CheckCircle2, Clock } from 'lucide-react';
import { useEthPrice } from '@/hooks/use-eth-price';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';
import { CLAIM_AMOUNT_USD } from '@/config/constants';
import { useFarcaster } from './FarcasterProvider';
import { useGaslessClaim } from '@/hooks/use-gasless-claim';
import { useClaimStatus } from '@/hooks/use-claim-status';
import { useAccount } from 'wagmi';

interface FaucetCardProps {
  onClaimSuccess?: () => void;
}

export function FaucetCard({ onClaimSuccess }: FaucetCardProps = {}) {
  const { data: ethPrice } = useEthPrice();
  const { user: farcasterUser, isMiniapp } = useFarcaster();
  const { data: claimStatus, refetch: refetchStatus } = useClaimStatus();

  // Wagmi hooks
  const { address, isConnected } = useAccount();

  // Gasless claim hook
  const { claim, isLoading, txHash, isConfirmed } = useGaslessClaim();

  const [showConfetti, setShowConfetti] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Update countdown timer
  useEffect(() => {
    if (!claimStatus?.secondsUntilClaim) return;

    const updateCountdown = () => {
      const seconds = claimStatus.secondsUntilClaim;
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      setCountdown({ hours, minutes, seconds: secs });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [claimStatus?.secondsUntilClaim]);

  useEffect(() => {
    if (isConfirmed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      refetchStatus();
      // Notify parent about successful claim
      if (onClaimSuccess) {
        setTimeout(() => onClaimSuccess(), 3000); // Show notification after 3 seconds
      }
    }
  }, [isConfirmed, refetchStatus, onClaimSuccess]);

  const handleClaim = async () => {
    // If not connected, the button will be replaced with AppKit connect button
    if (!isConnected) return;
    
    await claim();
  };

  // Calculate ETH amount from USD
  const claimAmountEth =
    ethPrice && ethPrice > 0 ? (CLAIM_AMOUNT_USD / ethPrice).toFixed(6) : '0.0000';

  const getStatusContent = () => {
    // If in Mini-App with Farcaster user
    if (isMiniapp && farcasterUser) {
      if (!isConnected) {
        return {
          message: `Connect wallet to claim (Farcaster #${farcasterUser.fid})`,
          canClaim: false,
          showCountdown: false,
        };
      }
    }

    if (!isConnected) {
      return {
        message: 'Connect wallet to claim',
        canClaim: false,
        showCountdown: false,
      };
    }

    if (isLoading) {
      return {
        message: 'Processing claim...',
        canClaim: false,
        showCountdown: false,
      };
    }

    if (isConfirmed) {
      return {
        message: 'Claim successful! 🎉',
        canClaim: false,
        showCountdown: false,
      };
    }

    if (claimStatus && !claimStatus.canClaim) {
      return {
        message: 'Cooldown Period',
        canClaim: false,
        showCountdown: true,
      };
    }

    return {
      message: 'Ready to Claim!',
      canClaim: true,
      showCountdown: false,
    };
  };

  const status = getStatusContent();

  return (
    <div className="relative w-full max-w-md mx-auto">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      <motion.div
        className="relative overflow-hidden rounded-3xl border border-baseBlue/30 bg-darkBg/70 backdrop-blur-2xl shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        {/* Animated Glow */}
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-baseBlue to-baseCyan opacity-20 blur-xl"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 p-8 space-y-6">
          {/* Animated Droplet */}
          <motion.div
            className="relative w-32 h-32 mx-auto"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Water Fill Container */}
            <div className="relative w-full h-full rounded-full border-4 border-baseBlue/50 overflow-hidden">
              {/* Fill Animation */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-baseBlue to-baseCyan"
                initial={{ height: '0%' }}
                animate={{ height: '50%' }}
                transition={{ type: 'spring', stiffness: 50 }}
              >
                {/* Wave Effect */}
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, transparent 20%, rgba(255,255,255,0.3) 20%, rgba(255,255,255,0.3) 80%, transparent 80%)',
                    backgroundSize: '50px 50px',
                  }}
                />
              </motion.div>

              {/* Droplet Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Droplet className="w-16 h-16 text-white/90 drop-shadow-lg" />
              </div>
            </div>

            {/* Glow */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-baseBlue to-baseCyan blur-2xl -z-10"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Info Section */}
          <div className="text-center space-y-4">
            {isConnected && address && (
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Your Address</p>
                <p className="text-lg font-mono font-semibold text-white">
                  {formatAddress(address as `0x${string}`, 6)}
                </p>
                {farcasterUser && (
                  <p className="text-xs text-green-400 flex items-center justify-center gap-1">
                    <span>🟣</span>
                    <span>Farcaster #{farcasterUser.fid}</span>
                  </p>
                )}
              </div>
            )}

            {/* Status Message */}
            <AnimatePresence mode="wait">
              <motion.div
                key={status.message}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-center gap-2 text-sm"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isConfirmed && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                {status.showCountdown && <Clock className="w-4 h-4 text-orange-500" />}
                <span className={isConfirmed ? 'text-green-400' : status.canClaim ? 'text-green-400' : 'text-orange-400'}>
                  {status.message}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Countdown Timer */}
            {status.showCountdown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-lg"
                style={{ background: '#FF660020', border: '2px solid #FF6600' }}
              >
                <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-black" style={{ color: '#FF6600' }}>
                      {String(countdown.hours).padStart(2, '0')}
                    </div>
                    <div className="text-xs font-bold uppercase opacity-60" style={{ color: '#FFFFFF' }}>
                      Hours
                    </div>
                  </div>
                  <div className="text-3xl font-black" style={{ color: '#FF6600' }}>:</div>
                  <div className="text-center">
                    <div className="text-3xl font-black" style={{ color: '#FF6600' }}>
                      {String(countdown.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-xs font-bold uppercase opacity-60" style={{ color: '#FFFFFF' }}>
                      Minutes
                    </div>
                  </div>
                  <div className="text-3xl font-black" style={{ color: '#FF6600' }}>:</div>
                  <div className="text-center">
                    <div className="text-3xl font-black" style={{ color: '#FF6600' }}>
                      {String(countdown.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-xs font-bold uppercase opacity-60" style={{ color: '#FFFFFF' }}>
                      Seconds
                    </div>
                  </div>
                </div>
                <p className="text-xs text-center mt-3 font-bold uppercase" style={{ color: '#FFFFFF', opacity: 0.7 }}>
                  Next claim available in
                </p>
              </motion.div>
            )}
          </div>

          {/* Claim Amount Display */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-400">Claim Amount</p>
            <p className="text-2xl font-bold text-white">${CLAIM_AMOUNT_USD.toFixed(2)} USD</p>
            {ethPrice && ethPrice > 0 && (
              <p className="text-sm text-gray-400">≈ {claimAmountEth} ETH</p>
            )}
            {farcasterUser && (
              <p className="text-xs text-purple-400 flex items-center justify-center gap-1">
                <span>🟣</span>
                <span>Claiming with Farcaster</span>
              </p>
            )}
          </div>

          {/* Connect/Claim Button */}
          {!isConnected ? (
            <div className="w-full">
              <appkit-button size="lg" />
            </div>
          ) : (
            <Button
              variant="glow"
              size="xl"
              className="w-full"
              onClick={handleClaim}
              disabled={!status.canClaim}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Droplet className="w-5 h-5" />
                  <span>Claim $${CLAIM_AMOUNT_USD.toFixed(2)} ETH</span>
                </>
              )}
            </Button>
          )}

          {/* Transaction Link */}
          {txHash && (
            <motion.a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-sm text-baseCyan hover:underline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              View transaction →
            </motion.a>
          )}

          {/* NFT Claim Prompt after successful claim */}
          {isConfirmed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2 }}
              className="mt-6 p-6 text-center"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                border: '3px solid #FFD700',
                borderRadius: '12px',
              }}
            >
              <p className="text-lg font-black uppercase mb-2" style={{ color: '#000000' }}>
                🎁 FREE NFT UNLOCKED!
              </p>
              <p className="text-sm font-bold" style={{ color: '#000000', opacity: 0.8 }}>
                Go to the NFTs tab to claim your exclusive reward
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

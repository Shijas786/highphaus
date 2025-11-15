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

export function FaucetCard() {
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
    }
  }, [isConfirmed, refetchStatus]);

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
          {/* Animated Energy Core */}
          <motion.div
            className="relative w-40 h-40 mx-auto flex items-center justify-center"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          >
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-baseBlue/40"
              animate={{ rotate: [-360, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-4 rounded-full border-4 border-baseCyan/40 blur-sm"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-8 rounded-full blur-3xl"
              style={{
                background: 'conic-gradient(from 90deg, #00d4ff, #0052ff, #00d4ff)',
                opacity: 0.4,
              }}
              animate={{ scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div
              className="relative w-16 h-16 bg-black/80 rounded-lg flex items-center justify-center text-white font-black tracking-wider uppercase text-xs shadow-[0_0_25px_rgba(0,212,255,0.4)]"
            >
              FUEL
            </div>
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
                  <span>Claim ${CLAIM_AMOUNT_USD.toFixed(2)} ETH</span>
                </>
              )}
            </Button>
          )}

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

        </div>
      </motion.div>
    </div>
  );
}

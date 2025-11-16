'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { formatAddress } from '@/lib/utils';
import { Droplet, Loader2, CheckCircle2, Clock } from 'lucide-react';
import { useEthPrice } from '@/hooks/use-eth-price';
import Confetti from 'react-confetti';
import { useEffect, useState, useMemo } from 'react';
import { CLAIM_AMOUNT_USD } from '@/config/constants';
import { useFarcaster } from './FarcasterProvider';
import { useGaslessClaim } from '@/hooks/use-gasless-claim';
import { useClaimStatus } from '@/hooks/use-claim-status';
import { useAccount } from 'wagmi';

// Safe Confetti wrapper to avoid conditional hook rendering
function SafeConfetti({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <Confetti
      width={typeof window !== 'undefined' ? window.innerWidth : 300}
      height={typeof window !== 'undefined' ? window.innerHeight : 300}
      recycle={false}
      numberOfPieces={500}
      gravity={0.3}
    />
  );
}

export function FaucetCard() {
  // ALL HOOKS → TOP ONLY, ALWAYS RUN
  const [mounted, setMounted] = useState(false);
  const { data: ethPrice } = useEthPrice();
  const { user: farcasterUser, isMiniapp } = useFarcaster();
  const { address, isConnected } = useAccount();
  const { data: claimStatus, refetch: refetchStatus } = useClaimStatus();
  const { claim, isLoading, txHash, isConfirmed } = useGaslessClaim();
  const [showConfetti, setShowConfetti] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Warpcast mobile detection - critical for preventing crashes
  const isWarpcastMobile =
    typeof window !== 'undefined' && /Warpcast/i.test(navigator.userAgent);

  // ALL EFFECTS → TOP ONLY
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!claimStatus?.secondsUntilClaim) return;

    const seconds = claimStatus.secondsUntilClaim;

    setCountdown({
      hours: Math.floor(seconds / 3600),
      minutes: Math.floor((seconds % 3600) / 60),
      seconds: seconds % 60,
    });

    const interval = setInterval(() => {
      const s = claimStatus.secondsUntilClaim;
      setCountdown({
        hours: Math.floor(s / 3600),
        minutes: Math.floor((s % 3600) / 60),
        seconds: s % 60,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [claimStatus?.secondsUntilClaim]);

  useEffect(() => {
    if (isConfirmed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      refetchStatus();
    }
  }, [isConfirmed, refetchStatus]);

  // ALL useMemo HOOKS → MUST BE BEFORE EARLY RETURN
  // Use useMemo for status to avoid conditional hook violations
  const status = useMemo(() => {
    if (!isConnected) {
      return {
        message: farcasterUser
          ? `Connect wallet to claim (Farcaster #${farcasterUser.fid})`
          : 'Connect wallet to claim',
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
  }, [isConnected, isLoading, isConfirmed, claimStatus, farcasterUser]);

  // Safe motion flag - disable animations on mini-app and Warpcast mobile
  const safeMotion = !isMiniapp && !isWarpcastMobile;

  // Memoize motion props to avoid conditional prop rendering
  const containerMotionProps = useMemo(() => {
    return safeMotion
      ? {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { type: 'spring' as const, stiffness: 100 },
        }
      : { animate: undefined as any, transition: undefined as any };
  }, [safeMotion]);

  const glowMotionProps = useMemo(() => {
    return safeMotion
      ? {
          animate: { opacity: [0.2, 0.4, 0.2] },
          transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
        }
      : { animate: undefined as any, transition: undefined as any };
  }, [safeMotion]);

  const energyCoreMotionProps = useMemo(() => {
    return safeMotion
      ? {
          animate: { rotate: [0, 360] },
          transition: { duration: 16, repeat: Infinity, ease: 'linear' as const },
        }
      : { animate: undefined as any, transition: undefined as any };
  }, [safeMotion]);

  const innerRingMotionProps = useMemo(() => {
    return safeMotion
      ? {
          animate: { rotate: [-360, 0] },
          transition: { duration: 18, repeat: Infinity, ease: 'linear' as const },
        }
      : { animate: undefined as any, transition: undefined as any };
  }, [safeMotion]);

  const middleRingMotionProps = useMemo(() => {
    return safeMotion
      ? {
          animate: { rotate: [0, 360] },
          transition: { duration: 10, repeat: Infinity, ease: 'linear' as const },
        }
      : { animate: undefined as any, transition: undefined as any };
  }, [safeMotion]);

  const glowCoreMotionProps = useMemo(() => {
    return safeMotion
      ? {
          animate: { scale: [0.9, 1.1, 0.9] },
          transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const },
        }
      : { animate: undefined as any, transition: undefined as any };
  }, [safeMotion]);

  // Calculate ETH amount from USD
  const claimAmountEth =
    ethPrice && ethPrice > 0 ? (CLAIM_AMOUNT_USD / ethPrice).toFixed(6) : '0.0000';

  const handleClaim = async () => {
    // If not connected, the button will be replaced with AppKit connect button
    if (!isConnected) return;
    
    await claim();
  };

  // EARLY RETURN AFTER ALL HOOKS (including useMemo)
  // Minimal loading state - avoid blocking render on Warpcast mobile
  if (!mounted) {
    return (
      <div 
        className="w-full min-h-[400px] flex items-center justify-center"
        style={{ background: '#FFFFFF', color: '#000000' }}
      >
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" style={{ color: '#0052FF' }} />
          <p className="text-sm font-medium" style={{ color: '#666666' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // NOW YOUR NORMAL JSX STARTS BELOW THIS
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Safe Confetti wrapper - disabled on mini-app and Warpcast mobile */}
      <SafeConfetti show={mounted && !isMiniapp && !isWarpcastMobile && showConfetti} />

      <motion.div
        className={`relative overflow-hidden rounded-3xl border border-baseBlue/30 bg-darkBg/70 shadow-2xl ${
          safeMotion ? 'backdrop-blur-2xl' : ''
        }`}
        {...containerMotionProps}
      >
        {/* Animated Glow - disabled in mini-app and Warpcast mobile to avoid GPU crash */}
        {safeMotion && (
          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-baseBlue to-baseCyan opacity-20 blur-xl"
            {...glowMotionProps}
          />
        )}

        <div className="relative z-10 p-8 space-y-6">
          {/* Animated Energy Core - disable heavy animations in mini-app and Warpcast mobile */}
          <motion.div
            className="relative w-40 h-40 mx-auto flex items-center justify-center"
            {...(safeMotion ? energyCoreMotionProps : {})}
          >
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-baseBlue/40"
              {...(safeMotion ? innerRingMotionProps : {})}
            />
            <motion.div
              className="absolute inset-4 rounded-full border-4 border-baseCyan/40 blur-sm"
              {...(safeMotion ? middleRingMotionProps : {})}
            />
            {/* CRITICAL: Disable conic-gradient in mini-app and Warpcast mobile to avoid GPU crash */}
            {safeMotion && (
              <motion.div
                className="absolute inset-8 rounded-full blur-3xl"
                style={{
                  background: 'conic-gradient(from 90deg, #00d4ff, #0052ff, #00d4ff)',
                  opacity: 0.4,
                }}
                {...glowCoreMotionProps}
              />
            )}
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
              {/* Only show appkit-button when mounted (SSR compatibility) */}
              {mounted && <appkit-button size="lg" />}
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

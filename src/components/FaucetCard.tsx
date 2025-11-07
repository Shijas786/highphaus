'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { usePrivyClaim } from '@/hooks/use-privy-claim';
import { useEligibility } from '@/hooks/use-eligibility';
import { formatAddress, formatCooldown } from '@/lib/utils';
import { Droplet, Loader2, CheckCircle2 } from 'lucide-react';
import { useEthPrice } from '@/hooks/use-eth-price';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';
import { CLAIM_AMOUNT_USD } from '@/config/constants';
import { useFarcaster } from './FarcasterProvider';

export function FaucetCard() {
  const { data: ethPrice } = useEthPrice();
  const {
    data: eligibility,
    isLoading: checkingEligibility,
    refetch: checkEligibility,
  } = useEligibility();
  const { user: farcasterUser, isMiniapp, isLoading: farcasterLoading } = useFarcaster();

  // Use existing Privy claim hook
  const { claim, isLoading, txHash, ready, authenticated, user, walletAddress, login } =
    usePrivyClaim();

  const address = walletAddress;
  const isConnected = authenticated && !!address;

  const [showConfetti, setShowConfetti] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fillPercent] = useState(50); // Static fill animation
  const [hasAttemptedAutoLogin, setHasAttemptedAutoLogin] = useState(false);

  useEffect(() => {
    if (txHash) {
      setIsSuccess(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      checkEligibility();
    }
  }, [txHash, checkEligibility]);

  // Log Farcaster Mini-App detection
  useEffect(() => {
    if (isMiniapp && farcasterUser && !farcasterLoading) {
      console.log('🟣 Farcaster Mini-App detected', {
        fid: farcasterUser.fid,
        username: farcasterUser.username,
        note: 'User already authenticated via Farcaster context',
      });
    }
  }, [isMiniapp, farcasterUser, farcasterLoading]);

  const handleClaim = async () => {
    if (!authenticated) {
      login();
      return;
    }
    await claim();
  };

  // Calculate ETH amount from USD
  const claimAmountEth =
    ethPrice && ethPrice > 0 ? (CLAIM_AMOUNT_USD / ethPrice).toFixed(6) : '0.0000';

  const getStatusContent = () => {
    if (!ready) {
      return {
        message: 'Loading...',
        canClaim: false,
      };
    }

    // If in Mini-App with Farcaster user but not authenticated
    if (isMiniapp && farcasterUser && !authenticated) {
      return {
        message: 'Connect wallet to claim (Farcaster detected)',
        canClaim: false,
      };
    }

    if (!authenticated) {
      return {
        message: 'Login with Farcaster or Wallet to claim',
        canClaim: false,
      };
    }

    if (!isConnected || !address) {
      return {
        message: 'Connect your wallet to claim ETH',
        canClaim: false,
      };
    }

    if (checkingEligibility) {
      return {
        message: 'Checking eligibility...',
        canClaim: false,
      };
    }

    if (isLoading) {
      return {
        message: 'Processing claim...',
        canClaim: false,
      };
    }

    if (isSuccess) {
      return {
        message: 'Claim successful! 🎉',
        canClaim: false,
      };
    }

    if (eligibility && !eligibility.eligible) {
      const cooldownText = eligibility.cooldownRemaining
        ? `Come back in ${formatCooldown(eligibility.cooldownRemaining)}`
        : eligibility.reason || 'Not eligible';
      return {
        message: cooldownText,
        canClaim: false,
      };
    }

    return {
      message: `Claim $${CLAIM_AMOUNT_USD.toFixed(2)} worth of ETH`,
      canClaim: true,
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
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div className="relative z-10 p-8 space-y-6">
          {/* Animated Droplet */}
          <motion.div
            className="relative w-32 h-32 mx-auto"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Water Fill Container */}
            <div className="relative w-full h-full rounded-full border-4 border-baseBlue/50 overflow-hidden">
              {/* Fill Animation */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-baseBlue to-baseCyan"
                initial={{ height: '0%' }}
                animate={{ height: `${fillPercent}%` }}
                transition={{ type: 'spring', stiffness: 50 }}
              >
                {/* Wave Effect */}
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
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
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
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
                {user?.farcaster?.fid && (
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <span>🟣</span>
                    <span>Farcaster ID: {user.farcaster.fid}</span>
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
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                <span className={isSuccess ? 'text-green-400' : 'text-gray-300'}>
                  {status.message}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Claim Amount Display */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-400">Claim Amount</p>
            <p className="text-2xl font-bold text-white">${CLAIM_AMOUNT_USD.toFixed(2)} USD</p>
            {ethPrice && ethPrice > 0 && (
              <p className="text-sm text-gray-400">≈ {claimAmountEth} ETH</p>
            )}
            <p className="text-xs text-green-400 flex items-center justify-center gap-1">
              <span>⚡</span>
              <span>Gasless - No fees required</span>
            </p>
            {user?.farcaster?.fid && (
              <p className="text-xs text-purple-400 flex items-center justify-center gap-1">
                <span>🟣</span>
                <span>Claiming with Farcaster</span>
              </p>
            )}
          </div>

          {/* Login/Claim Button */}
          {!authenticated ? (
            <Button variant="glow" size="xl" className="w-full" onClick={login}>
              <Droplet className="w-5 h-5" />
              <span>{isMiniapp ? 'Login with Farcaster' : 'Login to Claim'}</span>
            </Button>
          ) : (
            <Button
              variant="glow"
              size="xl"
              className="w-full"
              onClick={handleClaim}
              disabled={!status.canClaim || isLoading}
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
        </div>
      </motion.div>
    </div>
  );
}

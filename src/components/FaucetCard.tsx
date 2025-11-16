'use client';

import { Button } from '@/components/ui/button';
import { formatAddress } from '@/lib/utils';
import { Droplet, Loader2, CheckCircle2, Clock } from 'lucide-react';
import { useEthPrice } from '@/hooks/use-eth-price';
import Confetti from 'react-confetti';
import { useEffect, useMemo, useState } from 'react';
import { CLAIM_AMOUNT_USD } from '@/config/constants';
import { useFarcaster } from './FarcasterProvider';
import { useGaslessClaim } from '@/hooks/use-gasless-claim';
import { useClaimStatus } from '@/hooks/use-claim-status';
import { useAccount } from 'wagmi';

type Countdown = { hours: number; minutes: number; seconds: number };

function SafeConfetti({ show }: { show: boolean }) {
  if (!show) return null;
  if (typeof window === 'undefined') return null;
  return (
    <Confetti
      width={window.innerWidth}
      height={window.innerHeight}
      recycle={false}
      numberOfPieces={200}
      gravity={0.25}
    />
  );
}

export function FaucetCard(): JSX.Element {
  // -------------------------
  // Hooks — ALWAYS at top
  // -------------------------
  const [mounted, setMounted] = useState(false);
  const { data: ethPrice } = useEthPrice();
  const { user: farcasterUser, isMiniapp } = useFarcaster();
  const { address, isConnected } = useAccount();
  const { data: claimStatus, refetch: refetchStatus } = useClaimStatus();
  const { claim, isLoading, txHash, isConfirmed } = useGaslessClaim();
  const [showConfetti, setShowConfetti] = useState(false);
  const [countdown, setCountdown] = useState<Countdown>({ hours: 0, minutes: 0, seconds: 0 });

  // Detect Warpcast-like user agent safely (only on client)
  const [isWarpcastMobile, setIsWarpcastMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsWarpcastMobile(/Warpcast/i.test(navigator.userAgent));
  }, []);

  // -------------------------
  // Effects
  // -------------------------
  useEffect(() => {
    // Set mounted quickly for mini-apps to avoid blank screen
    if (typeof window === 'undefined') return;
    if (isWarpcastMobile || isMiniapp) {
      setMounted(true);
      return;
    }
    // small RAF to avoid layout jank in desktop browsers
    requestAnimationFrame(() => setMounted(true));
  }, [isWarpcastMobile, isMiniapp]);

  useEffect(() => {
    if (!claimStatus?.secondsUntilClaim) return;
    const update = () => {
      const s = claimStatus.secondsUntilClaim;
      setCountdown({
        hours: Math.floor(s / 3600),
        minutes: Math.floor((s % 3600) / 60),
        seconds: s % 60,
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [claimStatus?.secondsUntilClaim]);

  useEffect(() => {
    if (!isConfirmed) return;
    setShowConfetti(true);
    const t = setTimeout(() => setShowConfetti(false), 5000);
    refetchStatus();
    return () => clearTimeout(t);
  }, [isConfirmed, refetchStatus]);

  // -------------------------
  // Derived state (useMemo)
  // -------------------------
  const status = useMemo(() => {
    if (!isConnected) {
      return {
        message: farcasterUser ? `Connect wallet to claim (Farcaster #${farcasterUser.fid})` : 'Connect wallet to claim',
        canClaim: false,
        showCountdown: false,
      };
    }

    if (isLoading) {
      return { message: 'Processing claim...', canClaim: false, showCountdown: false };
    }

    if (isConfirmed) {
      return { message: 'Claim successful! 🎉', canClaim: false, showCountdown: false };
    }

    if (claimStatus && !claimStatus.canClaim) {
      return { message: 'Cooldown Period', canClaim: false, showCountdown: true };
    }

    return { message: 'Ready to Claim!', canClaim: true, showCountdown: false };
  }, [isConnected, isLoading, isConfirmed, claimStatus, farcasterUser]);

  // -------------------------
  // Helpers
  // -------------------------
  const claimAmountEth = useMemo(() => {
    if (!ethPrice || ethPrice <= 0) return '0.0000';
    return (CLAIM_AMOUNT_USD / ethPrice).toFixed(6);
  }, [ethPrice]);

  const handleClaim = async () => {
    if (!isConnected) return;
    try {
      await claim();
    } catch (err) {
      // Failure handled by hook, but log for dev
      // eslint-disable-next-line no-console
      console.error('claim error', err);
    }
  };

  // -------------------------
  // Early return after all hooks/effects/memos
  // -------------------------
  if (!mounted) {
    return (
      <div className="w-full min-h-[360px] flex items-center justify-center bg-white text-black">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <div className="text-sm font-medium text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  // -------------------------
  // JSX — miniapp-safe layout
  // -------------------------
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Confetti only in normal browsers (not mini-app / warpcast) */}
      <SafeConfetti show={showConfetti && !isMiniapp && !isWarpcastMobile} />

      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
        <div className="p-6 space-y-6">
          {/* Icon / core */}
          <div className="mx-auto w-28 h-28 rounded-lg bg-black/85 flex items-center justify-center text-white font-extrabold tracking-wider">
            FUEL
          </div>

          {/* Info */}
          <div className="text-center space-y-3">
            {isConnected && address ? (
              <div>
                <p className="text-xs text-gray-500">Your Address</p>
                <p className="text-lg font-mono font-semibold text-gray-900">
                  {formatAddress(address as `0x${string}`, 6)}
                </p>
                {farcasterUser && (
                  <p className="text-xs text-emerald-600 mt-1">🟣 Farcaster #{farcasterUser.fid}</p>
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600">Farcaster Faucet</p>
              </div>
            )}

            {/* Status */}
            <div className="flex items-center justify-center gap-2 text-sm">
              {isLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-600" />}
              {isConfirmed && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {status.showCountdown && <Clock className="w-4 h-4 text-orange-500" />}
              <span className={isConfirmed ? 'text-emerald-600' : status.canClaim ? 'text-emerald-600' : 'text-orange-500'}>
                {status.message}
              </span>
            </div>

            {/* Countdown */}
            {status.showCountdown && (
              <div className="mt-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-extrabold" style={{ color: '#FF6600' }}>{String(countdown.hours).padStart(2, '0')}</div>
                    <div className="text-xs text-gray-500">Hours</div>
                  </div>
                  <div className="text-2xl font-extrabold" style={{ color: '#FF6600' }}>:</div>
                  <div className="text-center">
                    <div className="text-2xl font-extrabold" style={{ color: '#FF6600' }}>{String(countdown.minutes).padStart(2, '0')}</div>
                    <div className="text-xs text-gray-500">Minutes</div>
                  </div>
                  <div className="text-2xl font-extrabold" style={{ color: '#FF6600' }}>:</div>
                  <div className="text-center">
                    <div className="text-2xl font-extrabold" style={{ color: '#FF6600' }}>{String(countdown.seconds).padStart(2, '0')}</div>
                    <div className="text-xs text-gray-500">Seconds</div>
                  </div>
                </div>
                <div className="text-xs text-center text-gray-600 mt-2">Next claim available in</div>
              </div>
            )}
          </div>

          {/* Claim amount */}
          <div className="text-center space-y-1">
            <p className="text-xs text-gray-500">Claim Amount</p>
            <p className="text-2xl font-bold text-gray-900">${CLAIM_AMOUNT_USD.toFixed(2)} USD</p>
            {ethPrice && ethPrice > 0 && <p className="text-xs text-gray-500">≈ {claimAmountEth} ETH</p>}
            {farcasterUser && <p className="text-xs text-purple-600 mt-1">Claiming with Farcaster</p>}
          </div>

          {/* Button area */}
          <div>
            {!isConnected ? (
              <div className="w-full">
                {/* AppKit / Reown connect button should be placed in app shell; show nothing heavy here */}
                <div className="w-full rounded-md border border-gray-200 p-3 text-center text-sm text-gray-700">Connect wallet to claim</div>
              </div>
            ) : (
               <Button variant="glow" size="lg" className="w-full" onClick={handleClaim} disabled={!status.canClaim || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Droplet className="w-5 h-5 mr-2" />
                    Claim ${CLAIM_AMOUNT_USD.toFixed(2)}
                  </>
                )}
              </Button>
            )}
          </div>

          {/* tx link */}
          {txHash && (
            <div className="text-center">
              <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-600">
                View transaction →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

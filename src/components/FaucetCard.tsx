'use client';

import { Button } from '@/components/ui/button';
import { formatAddress } from '@/lib/utils';
import { Droplet, Loader2, CheckCircle2, Clock } from 'lucide-react';
import { useEthPrice } from '@/hooks/use-eth-price';
import { useEffect, useState, useMemo } from 'react';
import { CLAIM_AMOUNT_USD } from '@/config/constants';
import { useFarcaster } from './FarcasterProvider';
import { useGaslessClaim } from '@/hooks/use-gasless-claim';
import { useClaimStatus } from '@/hooks/use-claim-status';
import { useAccount } from 'wagmi';

export function FaucetCard() {
  // -------------------------
  // Hooks (always at top)
  // -------------------------
  const [mounted, setMounted] = useState(false);
  const { data: ethPrice } = useEthPrice();
  const { user: farcasterUser } = useFarcaster();
  const { address, isConnected } = useAccount();
  const { data: claimStatus, refetch: refetchStatus } = useClaimStatus();
  const { claim, isLoading, txHash, isConfirmed } = useGaslessClaim();

  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // -------------------------
  // Effects
  // -------------------------
  useEffect(() => {
    setMounted(true);
  }, []);

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
    refetchStatus();
  }, [isConfirmed, refetchStatus]);

  // -------------------------
  // Derived State
  // -------------------------
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
      return { message: 'Processing claim...', canClaim: false, showCountdown: false };
    }

    if (isConfirmed) {
      return { message: 'Claim successful!', canClaim: false, showCountdown: false };
    }

    if (claimStatus && !claimStatus.canClaim) {
      return { message: 'Cooldown Period', canClaim: false, showCountdown: true };
    }

    return { message: 'Ready to Claim!', canClaim: true, showCountdown: false };
  }, [isConnected, isLoading, isConfirmed, claimStatus, farcasterUser]);

  const claimAmountEth =
    ethPrice && ethPrice > 0 ? (CLAIM_AMOUNT_USD / ethPrice).toFixed(6) : '0.0000';

  // -------------------------
  // Early return (safe)
  // -------------------------
  if (!mounted) {
    return (
      <div className="w-full min-h-[300px] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
      </div>
    );
  }

  // -------------------------
  // UI (NO motion, NO window, NO confetti)
  // -------------------------
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="rounded-2xl border border-gray-300 bg-white shadow-md p-6 space-y-6">
        <div className="w-24 h-24 bg-black/80 mx-auto rounded-lg flex items-center justify-center text-white font-bold">
          FUEL
        </div>

        <div className="text-center space-y-4">
          {isConnected && address && (
            <>
              <p className="text-xs text-gray-500">Your Address</p>
              <p className="text-lg font-mono font-semibold">{formatAddress(address as `0x${string}`, 6)}</p>
              {farcasterUser && (
                <p className="text-xs text-purple-600">🟣 Farcaster #{farcasterUser.fid}</p>
              )}
            </>
          )}

          <div className="flex justify-center items-center gap-2 text-sm">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isConfirmed && <CheckCircle2 className="w-4 h-4 text-green-600" />}
            {status.showCountdown && <Clock className="w-4 h-4 text-orange-500" />}
            <span className={status.canClaim ? 'text-green-600' : 'text-orange-500'}>
              {status.message}
            </span>
          </div>

          {status.showCountdown && (
            <div className="p-3 rounded-md border border-orange-300 bg-orange-50">
              <div className="text-xl font-bold text-orange-600">
                {String(countdown.hours).padStart(2, '0')}:
                {String(countdown.minutes).padStart(2, '0')}:
                {String(countdown.seconds).padStart(2, '0')}
              </div>
              <p className="text-xs text-gray-600 mt-1">Next claim available in</p>
            </div>
          )}
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm text-gray-500">Claim Amount</p>
          <p className="text-2xl font-bold">${CLAIM_AMOUNT_USD.toFixed(2)}</p>
          {ethPrice && <p className="text-xs text-gray-500">≈ {claimAmountEth} ETH</p>}
        </div>

        {!isConnected ? (
          <div className="w-full text-center text-sm text-gray-600 border p-3 rounded-md">
            Connect wallet to claim
          </div>
        ) : (
          <Button
            className="w-full"
            variant="glow"
            disabled={!status.canClaim || isLoading}
            onClick={async () => await claim()}
          >
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

        {txHash && (
          <div className="text-center text-sm">
            <a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Transaction →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

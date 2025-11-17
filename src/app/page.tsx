'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import { useState, useEffect } from 'react';
import { FaucetCard } from '@/components/FaucetCard';
import { ContributionCard } from '@/components/ContributionCard';
import { useStats } from '@/hooks/use-stats';
import { useEthPrice } from '@/hooks/use-eth-price';
import { CLAIM_AMOUNT_USD } from '@/config/constants';

export default function Home() {
  // ---- ALL HOOKS ON TOP, NO CONDITIONS ----
  const { data: stats } = useStats();
  const { data: ethPrice } = useEthPrice();
  const [activeTab, setActiveTab] = useState('claim');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ---- EARLY RETURN AFTER ALL HOOKS ----
  if (!mounted) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-black">
        Loading...
      </div>
    );
  }

  // ---- SAFE VALUES ----
  const safeStats = stats || {
    totalClaimed: '0',
    totalClaimants: 0,
    contractBalance: '0',
  };

  const safeEthPrice = ethPrice || 2500;
  const claimAmountEth =
    safeEthPrice > 0 ? (CLAIM_AMOUNT_USD / safeEthPrice).toFixed(6) : '0.0000';

  // ---- REAL JSX BELOW ----
  return (
    <div style={{ background: '#FFFFFF', color: '#000000' }}>
      <div className="px-6 py-10">
        <h1 className="text-3xl font-black">highphaus ETH Faucet</h1>
        <p className="opacity-70 mb-4">Free $0.10 ETH every 7 days</p>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            className={activeTab === 'claim' ? 'font-bold text-blue-600' : ''}
            onClick={() => setActiveTab('claim')}
          >
            Claim
          </button>

          <button
            className={activeTab === 'support' ? 'font-bold text-blue-600' : ''}
            onClick={() => setActiveTab('support')}
          >
            Support
          </button>
        </div>

        {/* Content */}
        {activeTab === 'claim' && <FaucetCard />}
        {activeTab === 'support' && <ContributionCard />}
      </div>
    </div>
  );
}

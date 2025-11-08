'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { FaucetCard } from '@/components/FaucetCard';
import { ContributionCard } from '@/components/ContributionCard';
import { NFTSection } from '@/components/NFTSection';
import { useStats } from '@/hooks/use-stats';
import { useEthPrice } from '@/hooks/use-eth-price';
import { CLAIM_AMOUNT_USD } from '@/config/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Droplet, Heart, Award } from 'lucide-react';

export default function Home() {
  const { isConnected } = useAccount();
  const { data: stats } = useStats();
  const { data: ethPrice } = useEthPrice();
  const [activeTab, setActiveTab] = useState('claim');

  // Calculate ETH amount from USD
  const claimAmountEth =
    ethPrice && ethPrice > 0 ? (CLAIM_AMOUNT_USD / ethPrice).toFixed(6) : '0.0000';

  return (
    <div className="min-h-screen" style={{ background: '#FFFFFF' }}>
      {/* Athletic Header */}
      <header className="relative overflow-hidden" style={{ background: '#000000' }}>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              'repeating-linear-gradient(-45deg, transparent, transparent 20px, #0052FF 20px, #0052FF 40px)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 flex items-center justify-center font-black text-3xl relative overflow-hidden"
                style={{
                  background: '#0052FF',
                  clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
                  color: '#FFFFFF',
                }}
              >
                <div
                  className="absolute top-0 right-0 w-8 h-8 opacity-20"
                  style={{
                    background: '#FFFFFF',
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
                  }}
                />
                <span className="relative z-10">H</span>
              </div>
              <div>
                <div
                  className="text-3xl font-black uppercase tracking-tight"
                  style={{ color: '#FFFFFF' }}
                >
                  highphaus
                </div>
                <div
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: '#0052FF' }}
                >
                  COMMUNITY FAUCET
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stripe */}
        <div className="h-2 flex">
          <div className="flex-1" style={{ background: '#0052FF' }} />
          <div className="w-32" style={{ background: '#00D4FF' }} />
          <div className="w-16" style={{ background: '#0052FF' }} />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Diagonal Stripes Background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background:
              'repeating-linear-gradient(45deg, #000000 0px, #000000 20px, transparent 20px, transparent 40px)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block mb-6">
            <div
              className="px-8 py-3 font-black text-xs uppercase tracking-widest"
              style={{
                background: '#000000',
                color: '#FFFFFF',
                clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)',
              }}
            >
              FREE GAS FOR BUILDERS
            </div>
          </div>

          <h1
            className="text-7xl md:text-9xl font-black uppercase mb-6 leading-none"
            style={{
              color: '#000000',
              letterSpacing: '-0.05em',
            }}
          >
            GET
            <br />
            <span style={{ color: '#0052FF' }}>$0.03</span>
            <br />
            <span className="text-5xl md:text-6xl">IN ETH</span>
          </h1>

          <p className="text-xl md:text-2xl font-bold mb-4" style={{ color: '#1a1a1a' }}>
            ≈ {claimAmountEth} ETH (at ${ethPrice?.toLocaleString()}/ETH)
          </p>

          <p className="text-lg mb-12" style={{ color: '#666666' }}>
            48-hour recurring claims • Farcaster verified • Gasless ⚡
          </p>

          {/* ETH Price Display */}
          <div
            className="inline-block px-6 py-3 font-bold uppercase text-sm"
            style={{
              background: '#F5F5F5',
              color: '#0052FF',
            }}
          >
            ETH PRICE: ${ethPrice ? ethPrice.toLocaleString() : '2,500'}
          </div>
        </div>
      </section>

      {/* Stats Section - Athletic Grid */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
          {/* Stat 1 */}
          <div
            className="relative p-12 lg:p-16 group hover:scale-105 transition-transform"
            style={{
              background: '#000000',
              clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)',
            }}
          >
            <div className="absolute top-0 left-0 w-2 h-full" style={{ background: '#0052FF' }} />
            <div
              className="text-xs uppercase font-black tracking-widest mb-4"
              style={{ color: '#888888' }}
            >
              DISTRIBUTED
            </div>
            <div className="text-5xl lg:text-7xl font-black mb-2" style={{ color: '#FFFFFF' }}>
              ${stats ? (parseFloat(stats.totalClaimed) * (ethPrice || 2500)).toFixed(0) : '0'}
            </div>
            <div className="text-sm font-black uppercase" style={{ color: '#0052FF' }}>
              USD VALUE
            </div>
          </div>

          {/* Stat 2 */}
          <div
            className="relative p-12 lg:p-16 group hover:scale-105 transition-transform"
            style={{ background: '#0052FF' }}
          >
            <div
              className="absolute top-0 right-0 w-16 h-16 opacity-20"
              style={{
                background: '#FFFFFF',
                clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
              }}
            />
            <div
              className="text-xs uppercase font-black tracking-widest mb-4"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              COMMUNITY
            </div>
            <div className="text-5xl lg:text-7xl font-black mb-2" style={{ color: '#FFFFFF' }}>
              {stats ? stats.totalClaimants.toLocaleString() : '0'}
            </div>
            <div className="text-sm font-black uppercase" style={{ color: '#000000' }}>
              USERS
            </div>
          </div>

          {/* Stat 3 */}
          <div
            className="relative p-12 lg:p-16 group hover:scale-105 transition-transform"
            style={{ background: '#000000' }}
          >
            <div
              className="absolute bottom-0 right-0 w-24 h-24 opacity-10"
              style={{
                background: '#0052FF',
                borderRadius: '50%',
                transform: 'translate(30%, 30%)',
              }}
            />
            <div
              className="text-xs uppercase font-black tracking-widest mb-4"
              style={{ color: '#888888' }}
            >
              NFTs MINTED
            </div>
            <div className="text-5xl lg:text-7xl font-black mb-2" style={{ color: '#FFFFFF' }}>
              {stats ? stats.totalClaimants : '0'}
            </div>
            <div className="text-sm font-black uppercase" style={{ color: '#0052FF' }}>
              TOTAL
            </div>
          </div>

          {/* Stat 4 */}
          <div
            className="relative p-12 lg:p-16 group hover:scale-105 transition-transform"
            style={{
              background: 'linear-gradient(135deg, #0052FF 0%, #00D4FF 100%)',
              clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0% 100%)',
            }}
          >
            <div
              className="absolute top-0 right-0 text-9xl font-black opacity-5"
              style={{ color: '#FFFFFF' }}
            >
              Ξ
            </div>
            <div
              className="text-xs uppercase font-black tracking-widest mb-4 relative z-10"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              HAUS BALANCE
            </div>
            <div
              className="text-5xl lg:text-7xl font-black mb-2 relative z-10"
              style={{ color: '#FFFFFF' }}
            >
              {stats ? stats.contractBalance : '0'}
            </div>
            <div
              className="text-sm font-black uppercase relative z-10"
              style={{ color: '#000000' }}
            >
              ETH
            </div>
          </div>
        </div>

        {/* Athletic Stripe */}
        <div className="flex gap-0">
          <div className="h-2 flex-1" style={{ background: '#000000' }} />
          <div className="h-2 w-32" style={{ background: '#0052FF' }} />
          <div className="h-2 w-20" style={{ background: '#000000' }} />
        </div>
      </section>

      {/* Tabbed Interface Section */}
      <section className="py-20" style={{ background: '#F5F5F5' }}>
        <div className="max-w-6xl mx-auto px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Custom Athletic Tabs */}
            <TabsList
              className="grid w-full grid-cols-3 mb-12 p-0 h-auto gap-2"
              style={{ background: 'transparent' }}
            >
              <TabsTrigger
                value="claim"
                className="relative py-8 font-black text-lg uppercase tracking-wide transition-all data-[state=active]:scale-105"
                style={{
                  background: activeTab === 'claim' ? '#0052FF' : '#000000',
                  color: '#FFFFFF',
                  border: '3px solid #0052FF',
                  clipPath: 'polygon(3% 0%, 100% 0%, 97% 100%, 0% 100%)',
                }}
              >
                {activeTab === 'claim' && (
                  <div
                    className="absolute bottom-0 left-0 w-full h-2"
                    style={{ background: '#00D4FF' }}
                  />
                )}
                <div className="flex items-center justify-center gap-3">
                  <Droplet className="w-6 h-6" />
                  <span>CLAIM GAS</span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="support"
                className="relative py-8 font-black text-lg uppercase tracking-wide transition-all data-[state=active]:scale-105"
                style={{
                  background: activeTab === 'support' ? '#0052FF' : '#000000',
                  color: '#FFFFFF',
                  border: '3px solid #0052FF',
                }}
              >
                {activeTab === 'support' && (
                  <div
                    className="absolute bottom-0 left-0 w-full h-2"
                    style={{ background: '#00D4FF' }}
                  />
                )}
                <div className="flex items-center justify-center gap-3">
                  <Heart className="w-6 h-6" />
                  <span>SUPPORT</span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="nfts"
                className="relative py-8 font-black text-lg uppercase tracking-wide transition-all data-[state=active]:scale-105"
                style={{
                  background: activeTab === 'nfts' ? '#0052FF' : '#000000',
                  color: '#FFFFFF',
                  border: '3px solid #0052FF',
                  clipPath: 'polygon(0% 0%, 97% 0%, 100% 100%, 3% 100%)',
                }}
              >
                {activeTab === 'nfts' && (
                  <div
                    className="absolute bottom-0 left-0 w-full h-2"
                    style={{ background: '#00D4FF' }}
                  />
                )}
                <div className="flex items-center justify-center gap-3">
                  <Award className="w-6 h-6" />
                  <span>NFTs</span>
                </div>
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <TabsContent value="claim" className="mt-0">
              <div className="text-center mb-8">
                <h2 className="text-5xl font-black uppercase mb-4" style={{ color: '#000000' }}>
                  FREE <span style={{ color: '#0052FF' }}>CLAIM</span>
                </h2>
                <p className="text-xl font-bold" style={{ color: '#666666' }}>
                  Everyone gets $0.03 worth of ETH • 48hr cooldown • Gasless ⚡
                </p>
              </div>
              <div className="max-w-4xl mx-auto">
                <FaucetCard />
              </div>
            </TabsContent>

            <TabsContent value="support" className="mt-0">
              <div className="text-center mb-8">
                <h2 className="text-5xl font-black uppercase mb-4" style={{ color: '#000000' }}>
                  SUPPORT <span style={{ color: '#0052FF' }}>BUILDERS</span>
                </h2>
                <p className="text-xl font-bold" style={{ color: '#666666' }}>
                  Contribute USDC to help fund fellow builders • Get OG NFT
                </p>
              </div>
              <div className="max-w-4xl mx-auto">
                <ContributionCard />
              </div>
            </TabsContent>

            <TabsContent value="nfts" className="mt-0">
              <div className="text-center mb-8">
                <h2 className="text-5xl font-black uppercase mb-4" style={{ color: '#000000' }}>
                  EXCLUSIVE <span style={{ color: '#0052FF' }}>NFTs</span>
                </h2>
                <p className="text-xl font-bold" style={{ color: '#666666' }}>
                  Mint commemorative NFTs • Gasless minting • Limited supply
                </p>
              </div>
              <div className="max-w-6xl mx-auto">
                <NFTSection />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 overflow-hidden" style={{ background: '#000000' }}>
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background:
              'repeating-linear-gradient(45deg, #0052FF 0px, #0052FF 2px, transparent 2px, transparent 40px)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="text-6xl font-black uppercase mb-4" style={{ color: '#FFFFFF' }}>
            highphaus
          </div>
          <div
            className="text-sm font-bold uppercase tracking-widest mb-8"
            style={{ color: '#0052FF' }}
          >
            FREE ETH FOR BUILDERS • 48-HOUR COOLDOWN • BASE NETWORK
          </div>

          <div className="flex justify-center gap-2 mb-6">
            <div className="w-20 h-1" style={{ background: '#0052FF' }} />
            <div className="w-12 h-1" style={{ background: '#00D4FF' }} />
            <div className="w-8 h-1" style={{ background: '#0052FF' }} />
          </div>

          <a
            href="https://x.com/cryptowolf07"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-wider transition-colors inline-block"
            style={{ color: '#666666' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#0052FF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#666666')}
          >
            BUILT BY <span style={{ color: '#0052FF' }}>@CRYPTOWOLF07</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

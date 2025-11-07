'use client';

import { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { FaucetCard } from '@/components/FaucetCard';
import { useStats } from '@/hooks/use-stats';
import { useEthPrice } from '@/hooks/use-eth-price';
import { useDonate } from '@/hooks/use-donate';
import { BASE_TOKENS } from '@/config/tokens';
import { CLAIM_AMOUNT_USD } from '@/config/constants';

export default function Home() {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { data: stats } = useStats();
  const { data: ethPrice } = useEthPrice();
  const { donate, isLoading: isDonating } = useDonate();
  const [depositAmount, setDepositAmount] = useState('');

  const isConnected = authenticated && wallets.length > 0;

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

            {/* Wallet section removed - login handled in FaucetCard */}
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
              FREE FOR ALL BUILDERS
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
            <span style={{ color: '#0052FF' }}>$0.10</span>
            <br />
            <span className="text-5xl md:text-6xl">IN ETH</span>
          </h1>

          <p className="text-xl md:text-2xl font-bold mb-4" style={{ color: '#1a1a1a' }}>
            ≈ {claimAmountEth} ETH (at ${ethPrice?.toLocaleString()}/ETH)
          </p>

          <p className="text-lg mb-12" style={{ color: '#666666' }}>
            One-time claim per wallet • No strings attached • Instant delivery
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
              OG NFTs
            </div>
            <div className="text-5xl lg:text-7xl font-black mb-2" style={{ color: '#FFFFFF' }}>
              {stats ? Math.max(0, 1000 - stats.totalClaimants) : '1000'}
            </div>
            <div className="text-sm font-black uppercase" style={{ color: '#0052FF' }}>
              / 1000
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

      {/* Main Action Section - CLAIM */}
      <section className="py-20" style={{ background: '#F5F5F5' }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-5xl font-black uppercase mb-4" style={{ color: '#000000' }}>
              FREE <span style={{ color: '#0052FF' }}>CLAIM</span>
            </h2>
            <p className="text-xl font-bold" style={{ color: '#666666' }}>
              Everyone gets $0.10 worth of ETH • One-time only • Gasless ⚡
            </p>
          </div>

          {/* Farcaster Gasless Claim Card */}
          <FaucetCard />
        </div>
      </section>

      {/* Support Builders Section with NFT */}
      <section className="relative py-20 overflow-hidden" style={{ background: '#000000' }}>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              'repeating-linear-gradient(-45deg, transparent, transparent 20px, #0052FF 20px, #0052FF 40px)',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6">
          {/* NFT Preview */}
          <div className="mb-12 text-center">
            <div className="inline-block mb-6">
              <div
                className="px-6 py-2 font-black text-xs uppercase tracking-widest"
                style={{
                  background: '#0052FF',
                  color: '#FFFFFF',
                }}
              >
                FUEL THE COMMUNITY
              </div>
            </div>

            <h2 className="text-5xl font-black uppercase mb-6" style={{ color: '#FFFFFF' }}>
              HIGHPHAUS
              <br />
              <span style={{ color: '#0052FF' }}>OG NFT</span>
            </h2>

            {/* NFT Image */}
            <div
              className="max-w-md mx-auto mb-8 relative overflow-hidden"
              style={{
                border: '4px solid #0052FF',
                boxShadow: '0 0 40px rgba(0, 82, 255, 0.5)',
              }}
            >
              <img
                src="/nft-preview.png"
                alt="HAUS OF 1000 - Limited Edition NFT"
                className="w-full h-full object-cover"
                style={{ display: 'block' }}
              />
            </div>

            <p className="text-xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
              First 1000 builders receive this exclusive NFT
            </p>
            <p className="text-lg" style={{ color: '#CCCCCC' }}>
              Minimum $1 contribution to help fund fellow builders
            </p>
          </div>

          {isConnected && (
            <div>
              {/* Support Amount Selection - USDC ONLY */}
              <div className="mb-8">
                <h3
                  className="text-2xl font-black uppercase mb-6 text-center"
                  style={{ color: '#FFFFFF' }}
                >
                  SUPPORT BUILDERS IN USDC
                </h3>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {['10', '50', '100'].map((amount, idx) => (
                    <button
                      key={amount}
                      onClick={() => setDepositAmount(amount)}
                      className="relative py-12 font-black text-3xl transition-all overflow-hidden"
                      style={{
                        background: depositAmount === amount ? '#0052FF' : '#1a1a1a',
                        color: '#FFFFFF',
                        border: '3px solid #0052FF',
                        clipPath:
                          idx === 1
                            ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                            : 'polygon(3% 0%, 100% 0%, 97% 100%, 0% 100%)',
                      }}
                    >
                      {depositAmount === amount && (
                        <div
                          className="absolute bottom-0 left-0 w-full h-2"
                          style={{ background: '#00D4FF' }}
                        />
                      )}
                      <div>${amount}</div>
                      <div className="text-xs font-bold uppercase opacity-60 mt-2">
                        = {amount} USDC
                      </div>
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="1"
                  step="1"
                  className="w-full px-6 py-4 font-black text-2xl text-center uppercase"
                  placeholder="CUSTOM AMOUNT (MIN $1 USDC)"
                  style={{
                    background: '#1a1a1a',
                    color: '#FFFFFF',
                    border: '3px solid #0052FF',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#00D4FF')}
                  onBlur={(e) => (e.target.style.borderColor = '#0052FF')}
                />

                {depositAmount && (
                  <div className="mt-4 text-center">
                    <div className="text-lg font-bold" style={{ color: '#FFFFFF' }}>
                      💰 You will fund: {depositAmount} USDC
                    </div>
                    <div className="text-sm opacity-60" style={{ color: '#FFFFFF' }}>
                      (Helps {Math.floor(parseFloat(depositAmount) / 0.1)} builders claim)
                    </div>
                  </div>
                )}
              </div>

              {/* Benefits List */}
              <div
                className="mb-8 p-8 relative overflow-hidden"
                style={{
                  background: '#1a1a1a',
                  border: '2px solid #0052FF',
                }}
              >
                <div
                  className="absolute top-0 right-0 w-2 h-full"
                  style={{ background: '#0052FF' }}
                />
                <div className="text-lg font-black uppercase mb-6" style={{ color: '#FFFFFF' }}>
                  BUILDER BENEFITS
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl" style={{ color: '#0052FF' }}>
                      ✓
                    </span>
                    <span className="font-bold uppercase text-sm" style={{ color: '#FFFFFF' }}>
                      RECEIVE LIMITED EDITION HIGHPHAUS OG NFT
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl" style={{ color: '#0052FF' }}>
                      ✓
                    </span>
                    <span className="font-bold uppercase text-sm" style={{ color: '#FFFFFF' }}>
                      SUPPORT FELLOW BUILDERS & DEVELOPERS
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl" style={{ color: '#0052FF' }}>
                      ✓
                    </span>
                    <span className="font-bold uppercase text-sm" style={{ color: '#FFFFFF' }}>
                      HELP GROW THE BASE ECOSYSTEM
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl" style={{ color: '#0052FF' }}>
                      ✓
                    </span>
                    <span className="font-bold uppercase text-sm" style={{ color: '#FFFFFF' }}>
                      JOIN EXCLUSIVE OG COMMUNITY (1 OF 1000)
                    </span>
                  </div>
                </div>
              </div>

              {/* Support Button */}
              <button
                onClick={async () => {
                  if (!depositAmount) return;

                  const usdcAmount = parseFloat(depositAmount).toFixed(2);
                  await donate(BASE_TOKENS.USDC, usdcAmount);
                }}
                disabled={!depositAmount || parseFloat(depositAmount) < 1 || isDonating}
                className="w-full py-10 font-black text-3xl uppercase tracking-wide transition-all disabled:opacity-50 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #0052FF 0%, #00D4FF 100%)',
                  color: '#FFFFFF',
                  clipPath: 'polygon(1% 0%, 100% 0%, 99% 100%, 0% 100%)',
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.background = '#000000';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #0052FF 0%, #00D4FF 100%)';
                }}
              >
                <span className="relative z-10">
                  {isDonating ? 'PROCESSING...' : `FUND ${depositAmount || '0'} USDC → GET OG NFT`}
                </span>
              </button>

              <p
                className="text-center text-xs font-bold uppercase mt-4"
                style={{ color: '#888888' }}
              >
                Claiming is always free • Support builders in USDC • Receive exclusive OG NFT
              </p>
            </div>
          )}
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
            FREE ETH FOR BUILDERS • ONE CLAIM PER WALLET • BASE NETWORK
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

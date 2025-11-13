'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useContribute } from '@/hooks/use-contribute';
import { useAccount } from 'wagmi';
import { Loader2, Heart, Zap } from 'lucide-react';

export function ContributionCard() {
  const { isConnected } = useAccount();
  const { contribute, isLoading, txHash } = useContribute();
  const [amount, setAmount] = useState('');

  const handleContribute = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    const hash = await contribute(amount);
    if (hash) {
      setAmount(''); // Reset after contribution
    }
  };

  const quickAmounts = ['0.01', '0.05', '0.1'];

  if (!isConnected) {
    return (
      <Card className="p-8 text-center" style={{ background: '#1a1a1a', border: '3px solid #0052FF' }}>
        <p className="text-gray-400 font-bold uppercase text-sm">
          Connect your wallet to support builders
        </p>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden" style={{ background: '#1a1a1a', border: '3px solid #0052FF' }}>
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: 'repeating-linear-gradient(-45deg, transparent, transparent 20px, #0052FF 20px, #0052FF 40px)',
          }}
        />

        <div className="relative z-10 p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4" style={{ background: '#0052FF' }}>
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-black uppercase mb-2" style={{ color: '#FFFFFF' }}>
              Support Builders
            </h3>
            <p className="text-sm" style={{ color: '#CCCCCC' }}>
              Contribute ETH to help fund fellow builders on Base
            </p>
          </div>

          {/* Quick amount buttons */}
          <div className="grid grid-cols-3 gap-4">
            {quickAmounts.map((quickAmount, idx) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount)}
                className="relative py-8 font-black text-2xl transition-all"
                style={{
                  background: amount === quickAmount ? '#0052FF' : '#000000',
                  color: '#FFFFFF',
                  border: '2px solid #0052FF',
                  clipPath:
                    idx === 1
                      ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                      : 'polygon(3% 0%, 100% 0%, 97% 100%, 0% 100%)',
                }}
              >
                {amount === quickAmount && (
                  <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: '#00D4FF' }} />
                )}
                <div>{quickAmount}</div>
                <div className="text-xs font-bold uppercase opacity-60 mt-1">ETH</div>
              </button>
            ))}
          </div>

          {/* Custom amount input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase" style={{ color: '#888888' }}>
              Custom Amount (ETH)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.001"
              step="0.001"
              placeholder="Enter ETH amount"
              className="w-full px-6 py-4 font-black text-xl text-center uppercase"
              style={{
                background: '#000000',
                color: '#FFFFFF',
                border: '2px solid #0052FF',
              }}
            />
          </div>

          {/* Benefits */}
          <div
            className="p-6"
            style={{
              background: '#000000',
              border: '2px solid #0052FF',
            }}
          >
            <div className="text-sm font-black uppercase mb-4" style={{ color: '#FFFFFF' }}>
              Builder Impact
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xl" style={{ color: '#0052FF' }}>✓</span>
                <span className="text-xs font-bold uppercase" style={{ color: '#CCCCCC' }}>
                  Help New Builders Get Started
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl" style={{ color: '#0052FF' }}>✓</span>
                <span className="text-xs font-bold uppercase" style={{ color: '#CCCCCC' }}>
                  Support Base Ecosystem Growth
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl" style={{ color: '#0052FF' }}>✓</span>
                <span className="text-xs font-bold uppercase" style={{ color: '#CCCCCC' }}>
                  100% Goes to Gas Claims
                </span>
              </div>
            </div>
          </div>

          {/* Contribution amount display */}
          {amount && parseFloat(amount) > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-4"
              style={{ background: '#0052FF20', border: '1px solid #0052FF' }}
            >
              <div className="text-sm font-bold" style={{ color: '#FFFFFF' }}>
                <Zap className="w-4 h-4 inline mr-2" />
                You will contribute: {amount} ETH
              </div>
              <div className="text-xs opacity-60 mt-1" style={{ color: '#FFFFFF' }}>
                (Helps {Math.floor(parseFloat(amount) / 0.0001)} builders claim $0.10 gas)
              </div>
            </motion.div>
          )}

          {/* Contribute button */}
          <Button
            onClick={handleContribute}
            disabled={!amount || parseFloat(amount) <= 0 || isLoading}
            className="w-full py-8 font-black text-2xl uppercase"
            style={{
              background: 'linear-gradient(135deg, #0052FF 0%, #00D4FF 100%)',
              color: '#FFFFFF',
              clipPath: 'polygon(1% 0%, 100% 0%, 99% 100%, 0% 100%)',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Heart className="w-5 h-5" />
                <span>Contribute {amount || '0'} ETH</span>
              </>
            )}
          </Button>

          {/* Transaction link */}
          {txHash && (
            <motion.a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-xs font-bold uppercase hover:underline"
              style={{ color: '#00D4FF' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              View Transaction →
            </motion.a>
          )}

          <p className="text-center text-xs font-bold uppercase" style={{ color: '#888888' }}>
            Every ETH helps new builders • 100% transparent • On-chain tracking
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

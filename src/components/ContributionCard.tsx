'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useContribute } from '@/hooks/use-contribute';
import { useAccount } from 'wagmi';
import { Loader2, DollarSign, Heart } from 'lucide-react';

export function ContributionCard() {
  const { isConnected } = useAccount();
  const { contribute, isLoading } = useContribute();
  const [amount, setAmount] = useState('');

  const handleContribute = async () => {
    if (!amount || parseFloat(amount) < 1) return;
    await contribute(amount);
    setAmount(''); // Reset after contribution
  };

  const quickAmounts = ['10', '50', '100'];

  if (!isConnected) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-400">Connect your wallet to contribute</p>
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
              Contribute USDC to help fund fellow builders and receive OG NFT
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
                <div>${quickAmount}</div>
                <div className="text-xs font-bold uppercase opacity-60 mt-1">USDC</div>
              </button>
            ))}
          </div>

          {/* Custom amount input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase" style={{ color: '#888888' }}>
              Custom Amount (Min $1 USDC)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="1"
              placeholder="Enter USDC amount"
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
              Builder Benefits
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xl" style={{ color: '#0052FF' }}>✓</span>
                <span className="text-xs font-bold uppercase" style={{ color: '#CCCCCC' }}>
                  Receive Limited Edition OG NFT
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl" style={{ color: '#0052FF' }}>✓</span>
                <span className="text-xs font-bold uppercase" style={{ color: '#CCCCCC' }}>
                  Support Fellow Builders
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl" style={{ color: '#0052FF' }}>✓</span>
                <span className="text-xs font-bold uppercase" style={{ color: '#CCCCCC' }}>
                  Help Grow Base Ecosystem
                </span>
              </div>
            </div>
          </div>

          {/* Contribution amount display */}
          {amount && parseFloat(amount) >= 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-4"
              style={{ background: '#0052FF20', border: '1px solid #0052FF' }}
            >
              <div className="text-sm font-bold" style={{ color: '#FFFFFF' }}>
                💰 You will contribute: {amount} USDC
              </div>
              <div className="text-xs opacity-60 mt-1" style={{ color: '#FFFFFF' }}>
                (Helps {Math.floor(parseFloat(amount) / 0.03)} builders claim gas)
              </div>
            </motion.div>
          )}

          {/* Contribute button */}
          <Button
            onClick={handleContribute}
            disabled={!amount || parseFloat(amount) < 1 || isLoading}
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
                <DollarSign className="w-5 h-5" />
                <span>Contribute {amount || '0'} USDC</span>
              </>
            )}
          </Button>

          <p className="text-center text-xs font-bold uppercase" style={{ color: '#888888' }}>
            Gasless for claimers • Support in USDC • Get exclusive OG NFT
          </p>
        </div>
      </Card>
    </motion.div>
  );
}


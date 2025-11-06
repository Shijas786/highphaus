'use client';

import { motion } from 'framer-motion';
import { formatAddress, formatRelativeTime, formatEth } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';
import { MOCK_CLAIM_HISTORY } from '@/config/constants';

export function ClaimHistory() {
  const history = MOCK_CLAIM_HISTORY;

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="rounded-2xl border border-baseBlue/20 bg-darkBg/50 backdrop-blur-xl p-6">
        <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-baseBlue to-baseCyan bg-clip-text text-transparent">
          Recent Claims
        </h3>

        <div className="space-y-3">
          {history.map((item, i) => (
            <motion.div
              key={`${item.address}-${item.timestamp}`}
              className="flex items-center justify-between p-4 rounded-lg bg-glass border border-baseBlue/10 hover:border-baseBlue/30 transition-all"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.01, x: 5 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-baseBlue to-baseCyan flex items-center justify-center font-mono text-sm">
                  {item.address.slice(2, 4)}
                </div>
                <div>
                  <p className="font-mono text-sm text-white">{formatAddress(item.address)}</p>
                  <p className="text-xs text-gray-400">{formatRelativeTime(item.timestamp)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-sm font-semibold text-baseCyan">
                  +{formatEth(item.amount)} ETH
                </p>
                {item.txHash && (
                  <a
                    href={`https://basescan.org/tx/${item.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-baseBlue transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}



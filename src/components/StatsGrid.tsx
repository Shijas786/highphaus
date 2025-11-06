'use client';

import { motion } from 'framer-motion';
import { useStats } from '@/hooks/use-stats';
import { formatEth, formatNumber, formatRelativeTime } from '@/lib/utils';
import { TrendingUp, Users, Clock, Droplet } from 'lucide-react';

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      type: 'spring',
      stiffness: 100,
    },
  }),
};

export function StatsGrid() {
  const { data: stats, isLoading } = useStats();

  const statsData = [
    {
      label: 'Total Claimed',
      value: stats ? `${formatEth(stats.totalClaimed)} ETH` : '...',
      icon: Droplet,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Total Claimants',
      value: stats ? formatNumber(stats.totalClaimants) : '...',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Claims/Minute',
      value: stats ? stats.claimsPerMinute.toFixed(2) : '...',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Last Claim',
      value: stats ? formatRelativeTime(stats.lastClaimTime) : '...',
      icon: Clock,
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl mx-auto">
      {statsData.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            custom={i}
            variants={statVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05, y: -5 }}
            className="relative group"
          >
            <div className="relative overflow-hidden rounded-xl border border-baseBlue/20 bg-darkBg/50 backdrop-blur-xl p-6">
              {/* Glow Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Icon */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-20`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <motion.div
                  className="w-2 h-2 rounded-full bg-green-500"
                  animate={{
                    opacity: isLoading ? [0.5, 1, 0.5] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: isLoading ? Infinity : 0,
                  }}
                />
              </div>

              {/* Content */}
              <div className="space-y-1">
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {stat.value}
                </p>
              </div>

              {/* Bottom Glow */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-50`}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}



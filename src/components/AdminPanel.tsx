'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield, RefreshCw, DollarSign, Users } from 'lucide-react';
import { toast } from 'sonner';

export function AdminPanel() {
  const [secret, setSecret] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contractBalance, setContractBalance] = useState('100.0');
  const [topUpAmount, setTopUpAmount] = useState('');

  const handleAuth = () => {
    // In production, verify against FAUCET_ADMIN_SECRET via API
    if (secret === 'admin') {
      setIsAuthenticated(true);
      toast.success('Authenticated successfully');
    } else {
      toast.error('Invalid secret');
    }
  };

  const handleTopUp = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    toast.loading('Processing top-up...', { id: 'topup' });

    // Simulate top-up
    setTimeout(() => {
      const newBalance = (parseFloat(contractBalance) + parseFloat(topUpAmount)).toFixed(4);
      setContractBalance(newBalance);
      setTopUpAmount('');
      toast.success('Contract topped up successfully', { id: 'topup' });
    }, 1500);
  };

  const handleRefreshStats = () => {
    toast.success('Stats refreshed');
  };

  if (!isAuthenticated) {
    return (
      <motion.div
        className="max-w-md mx-auto p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-baseBlue" />
              Admin Panel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin secret"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
            />
            <Button onClick={handleAuth} className="w-full">
              Authenticate
            </Button>
            <p className="text-xs text-gray-400 text-center">
              Dev mode: use &quot;admin&quot; as secret
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto p-8 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-baseBlue to-baseCyan bg-clip-text text-transparent">
          Admin Dashboard
        </h2>
        <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contract Balance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Contract Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-baseCyan mb-4">{contractBalance} ETH</p>
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Top-up amount (ETH)"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                step="0.01"
              />
              <Button onClick={handleTopUp} className="w-full">
                Top Up Contract
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full" onClick={handleRefreshStats}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Statistics
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => toast.info('Feature coming soon')}
            >
              <Users className="w-4 h-4 mr-2" />
              View Claim Logs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-400">Total Claims</p>
              <p className="text-2xl font-bold">1,245</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Distributed</p>
              <p className="text-2xl font-bold">12.45 ETH</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Users</p>
              <p className="text-2xl font-bold">892</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Avg per Claim</p>
              <p className="text-2xl font-bold">0.01 ETH</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

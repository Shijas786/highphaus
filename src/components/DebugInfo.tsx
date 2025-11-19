'use client';

import { useAccount, useConnect } from 'wagmi';
import { useFarcaster } from './FarcasterProvider';
import { useEffect, useState } from 'react';

export function DebugInfo() {
    const { isConnected, status: accountStatus } = useAccount();
    const { connectors, error } = useConnect();
    const { isMiniapp, user } = useFarcaster();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 text-white p-4 text-xs font-mono z-50 max-h-[50vh] overflow-y-auto border-t border-gray-700">
            <h3 className="font-bold text-yellow-400 mb-2">Debug Info</h3>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <span className="text-gray-400">Miniapp:</span>{' '}
                    <span className={isMiniapp ? 'text-green-400' : 'text-red-400'}>{String(isMiniapp)}</span>
                </div>
                <div>
                    <span className="text-gray-400">Connected:</span>{' '}
                    <span className={isConnected ? 'text-green-400' : 'text-red-400'}>{String(isConnected)}</span>
                </div>
                <div>
                    <span className="text-gray-400">User:</span>{' '}
                    <span className="text-blue-400">{user ? user.username : 'None'}</span>
                </div>
                <div>
                    <span className="text-gray-400">Account Status:</span>{' '}
                    <span className="text-purple-400">{accountStatus}</span>
                </div>
            </div>

            <div className="mt-2">
                <div className="text-gray-400 mb-1">Connectors ({connectors.length}):</div>
                <div className="flex flex-wrap gap-1">
                    {connectors.map(c => (
                        <span key={c.uid} className="bg-gray-800 px-1 rounded border border-gray-600">
                            {c.id} ({c.name})
                        </span>
                    ))}
                </div>
            </div>

            {error && (
                <div className="mt-2 text-red-400 border border-red-900 bg-red-900/20 p-1 rounded">
                    Last Error: {error.message}
                </div>
            )}
        </div>
    );
}

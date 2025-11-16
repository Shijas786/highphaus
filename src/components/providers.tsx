'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { WagmiProviderWrapper } from './WagmiProviderWrapper';
import { FarcasterProvider } from './FarcasterProvider';
import { ErrorBoundary } from './ErrorBoundary';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5000,
            // Don't throw errors - just return undefined
            throwOnError: false,
          },
        },
      })
  );

  // Ensure we're on client side
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // If not mounted, render children directly (for SSR)
  if (!mounted) {
    return <>{children}</>;
  }

  try {
    return (
      <ErrorBoundary>
        <WagmiProviderWrapper>
          <QueryClientProvider client={queryClient}>
            <FarcasterProvider>
              {children}
              <Toaster
                position="top-right"
                theme="dark"
                toastOptions={{
                  style: {
                    background: 'rgba(10, 10, 15, 0.9)',
                    border: '1px solid rgba(0, 82, 255, 0.3)',
                    color: '#fff',
                  },
                }}
              />
            </FarcasterProvider>
          </QueryClientProvider>
        </WagmiProviderWrapper>
      </ErrorBoundary>
    );
  } catch (error) {
    // If providers fail, still render children
    console.error('Provider initialization error:', error);
    return <>{children}</>;
  }
}

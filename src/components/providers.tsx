'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { Toaster } from 'sonner';
import PrivyProviderWrapper from './PrivyProviderWrapper';
import { FarcasterProvider } from './FarcasterProvider';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <FarcasterProvider>
        <PrivyProviderWrapper>
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
        </PrivyProviderWrapper>
      </FarcasterProvider>
    </QueryClientProvider>
  );
}



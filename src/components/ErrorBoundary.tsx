'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              padding: '20px',
              textAlign: 'center',
              background: '#ffffff',
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#000' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#666', marginBottom: '16px' }}>
              {this.state.error?.message || 'An error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                background: '#0052FF',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Reload Page
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

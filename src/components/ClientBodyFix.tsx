'use client';

import { useEffect } from 'react';

/**
 * Fix for iOS Safari webview hydration crash in Farcaster
 * Sets body background after hydration to prevent black screen
 */
export default function ClientBodyFix() {
  useEffect(() => {
    // Ensure body background is set after hydration (critical for Farcaster webview)
    if (typeof window !== 'undefined') {
      document.documentElement.style.backgroundColor = '#FFFFFF';
      document.documentElement.style.color = '#000000';
      document.body.style.backgroundColor = '#FFFFFF';
      document.body.style.color = '#000000';
      
      // Also set on html element
      const html = document.documentElement;
      html.style.setProperty('background-color', '#FFFFFF', 'important');
      html.style.setProperty('color', '#000000', 'important');
    }
  }, []);

  return null;
}


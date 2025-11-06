'use client';

import { AdminPanel } from '@/components/AdminPanel';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export default function AdminPage() {
  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <div className="relative z-10 container mx-auto px-4 py-20">
        <AdminPanel />
      </div>
    </div>
  );
}



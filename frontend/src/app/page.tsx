'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/components/providers/WalletProvider';
import { WelcomeSection } from '@/components/game/WelcomeSection';

export default function HomePage() {
  const { isConnected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    // Redirect connected users to dashboard
    if (isConnected) {
      router.push('/dashboard');
    }
  }, [isConnected, router]);

  // Show welcome section for non-connected users
  return <WelcomeSection />;
}

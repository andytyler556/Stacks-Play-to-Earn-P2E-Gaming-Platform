'use client';

import React from 'react';
import { useWallet } from '@/components/providers/WalletProvider';
import { WelcomeSection } from '@/components/game/WelcomeSection';
import { PlayerOverview } from '@/components/game/PlayerOverview';
import { ResourceInventory } from '@/components/game/ResourceInventory';
import { QuickActions } from '@/components/game/QuickActions';
import { ActivityFeed } from '@/components/game/ActivityFeed';
import { AnnouncementBanner } from '@/components/game/AnnouncementBanner';

export default function DashboardPage() {
  const { isConnected } = useWallet();

  if (!isConnected) {
    return <WelcomeSection />;
  }

  return (
    <div className="min-h-screen bg-digital-oasis">
      {/* Announcement Banner */}
      <AnnouncementBanner />
      
      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Player Overview & Resources */}
          <div className="lg:col-span-8 space-y-6">
            {/* Player Overview */}
            <PlayerOverview />
            
            {/* Resource Inventory */}
            <ResourceInventory />
            
            {/* Activity Feed */}
            <ActivityFeed />
          </div>

          {/* Right Column - Quick Actions */}
          <div className="lg:col-span-4">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}

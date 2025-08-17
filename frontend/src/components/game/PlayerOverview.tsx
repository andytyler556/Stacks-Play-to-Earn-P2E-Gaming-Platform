'use client';

import React from 'react';
import { 
  User, 
  MapPin, 
  Package, 
  Trophy, 
  TrendingUp,
  Coins,
  Star,
  Calendar
} from 'lucide-react';
import { useWallet } from '@/components/providers/WalletProvider';
import { MOCK_PLAYER_PROFILE } from '@/lib/game-data';
import { shortenAddress } from '@/lib/stacks';

export function PlayerOverview() {
  const { address, stxBalance, tokenBalance } = useWallet();
  const profile = MOCK_PLAYER_PROFILE;

  const experienceToNextLevel = 15000;
  const experienceProgress = (profile.experience / experienceToNextLevel) * 100;

  return (
    <div className="bg-white rounded-xl shadow-game border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">{profile.username}</h2>
              <p className="text-green-100">{shortenAddress(address!)}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Star className="w-4 h-4 text-yellow-300" />
                <span className="text-sm">Level {profile.level}</span>
              </div>
            </div>
          </div>
          <div className="text-right text-white">
            <div className="text-sm text-green-100">Member since</div>
            <div className="font-semibold">
              {profile.joinedAt.toLocaleDateString()}
            </div>
          </div>
        </div>
        
        {/* Experience Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-green-100 mb-1">
            <span>Experience</span>
            <span>{profile.experience.toLocaleString()} / {experienceToNextLevel.toLocaleString()}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${experienceProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Wallet Balance */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <Coins className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stxBalance.toFixed(2)}</div>
            <div className="text-sm text-gray-600">STX Balance</div>
          </div>

          {/* Platform Tokens */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{tokenBalance.toFixed(0)}</div>
            <div className="text-sm text-gray-600">P2E Tokens</div>
          </div>

          {/* Lands Owned */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <MapPin className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{profile.stats.landsOwned}</div>
            <div className="text-sm text-gray-600">Land Plots</div>
          </div>

          {/* Blueprints */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <Package className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{profile.stats.blueprintsOwned}</div>
            <div className="text-sm text-gray-600">Blueprints</div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
              Building Stats
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Buildings Built</span>
                <span className="font-medium">{profile.stats.buildingsConstructed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Resources Harvested</span>
                <span className="font-medium">{profile.stats.resourcesHarvested.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tokens Earned</span>
                <span className="font-medium">{profile.stats.tokensEarned.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
              Community
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Events Joined</span>
                <span className="font-medium">{profile.stats.eventsParticipated}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Marketplace Sales</span>
                <span className="font-medium">{profile.stats.marketplaceSales}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Achievements</span>
                <span className="font-medium">{profile.achievements.length}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <Star className="w-4 h-4 mr-2 text-purple-500" />
              Recent Achievements
            </h4>
            <div className="space-y-2">
              {profile.achievements.slice(0, 2).map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-2 text-sm">
                  <span className="text-lg">{achievement.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">{achievement.title}</div>
                    <div className="text-gray-500 text-xs">{achievement.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

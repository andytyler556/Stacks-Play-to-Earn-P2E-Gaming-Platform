'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Trophy,
  Plus,
  Zap,
  Gift,
  Clock,
  Star,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Package,
  Crown,
  Building,
  Coins
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { generateMockCommunityEvents } from '@/lib/game-data';

export function QuickActions() {
  const mockEvents = generateMockCommunityEvents(3);
  const activeEvents = mockEvents.filter(event => event.status === 'active');

  const quickActionItems = [
    {
      title: 'Manage Land',
      description: 'View and manage your land plots',
      icon: <MapPin className="w-5 h-5" />,
      href: '/land',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      title: 'Browse Blueprints',
      description: 'Explore building blueprints',
      icon: <Package className="w-5 h-5" />,
      href: '/blueprints',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      title: 'Visit Marketplace',
      description: 'Trade NFTs and assets',
      icon: <ShoppingBag className="w-5 h-5" />,
      href: '/marketplace',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      title: 'Join Events',
      description: 'Participate in competitions',
      icon: <Trophy className="w-5 h-5" />,
      href: '/events',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    },
    {
      title: 'Upgrade Premium',
      description: 'Unlock exclusive features',
      icon: <Crown className="w-5 h-5" />,
      href: '/premium',
      color: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-game border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-blue-500" />
          Quick Actions
        </h3>
        <div className="space-y-3">
          {quickActionItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <div className={`${item.color} ${item.hoverColor} text-white rounded-lg p-4 transition-all duration-200 cursor-pointer group`}>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    <p className="text-xs text-white/80">{item.description}</p>
                  </div>
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Active Events */}
      <div className="bg-white rounded-xl shadow-game border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Active Events
          </h3>
          <Link href="/events">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>

        {activeEvents.length > 0 ? (
          <div className="space-y-4">
            {activeEvents.slice(0, 2).map((event) => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {event.description}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{event.participants}/{event.maxParticipants}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Coins className="w-3 h-3" />
                    <span>{event.entryFee} STX entry</span>
                  </div>
                </div>
                <Link href="/events">
                  <Button variant="outline" size="sm" fullWidth>
                    Join Event
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No active events</p>
            <p className="text-xs">Check back later for new challenges!</p>
          </div>
        )}
      </div>

      {/* Daily Progress */}
      <div className="bg-white rounded-xl shadow-game border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            Daily Progress
          </h3>
          <Button variant="ghost" size="sm" leftIcon={<Gift />}>
            Claim
          </Button>
        </div>

        <div className="space-y-4">
          {/* Daily Quest */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900 flex items-center">
                <Star className="w-4 h-4 mr-1" />
                Daily Quest
              </span>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">2/3 completed</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: '66%' }}></div>
            </div>
            <p className="text-xs text-blue-800">Complete 1 more building to claim 50 tokens!</p>
          </div>

          {/* Resource Generation */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-900 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                Production Today
              </span>
              <Zap className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-xs text-green-800 space-y-1">
              <div className="flex justify-between">
                <span>Resources generated:</span>
                <span className="font-medium">247 units</span>
              </div>
              <div className="flex justify-between">
                <span>Tokens earned:</span>
                <span className="font-medium">+32 P2E</span>
              </div>
              <div className="flex justify-between">
                <span>Current rate:</span>
                <span className="font-medium text-green-600">12/hour</span>
              </div>
            </div>
          </div>

          {/* Login Streak */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-yellow-900 flex items-center">
                <Star className="w-4 h-4 mr-1" />
                Login Streak
              </span>
              <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                7 days
              </div>
            </div>
            <div className="text-xs text-yellow-800 space-y-1">
              <div className="flex justify-between">
                <span>Next milestone:</span>
                <span className="font-medium">10 days</span>
              </div>
              <div className="flex justify-between">
                <span>Reward:</span>
                <span className="font-medium text-yellow-600">Rare Blueprint</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

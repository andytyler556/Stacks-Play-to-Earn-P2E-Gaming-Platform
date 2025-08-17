'use client';

import React, { useState } from 'react';
import { 
  Activity, 
  MapPin, 
  Package, 
  Coins, 
  Trophy, 
  ShoppingBag,
  Building,
  Users,
  ExternalLink,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ActivityItem {
  id: string;
  type: 'land_purchase' | 'building_constructed' | 'resource_harvested' | 'marketplace_sale' | 'event_joined' | 'achievement_unlocked';
  title: string;
  description: string;
  timestamp: Date;
  value?: number;
  currency?: 'STX' | 'TOKENS';
  txHash?: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'building_constructed',
    title: 'Farm Completed',
    description: 'Successfully built a Level 1 Farm on Grassland Plot #7',
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    value: 15,
    currency: 'TOKENS'
  },
  {
    id: '2',
    type: 'resource_harvested',
    title: 'Resources Collected',
    description: 'Harvested 45 Food and 12 Wood from your farms',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    id: '3',
    type: 'marketplace_sale',
    title: 'Blueprint Sold',
    description: 'Rare Mine Blueprint sold to ST1ABC...DEF',
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    value: 25,
    currency: 'STX',
    txHash: '0x1234567890abcdef'
  },
  {
    id: '4',
    type: 'achievement_unlocked',
    title: 'Achievement Unlocked',
    description: 'Earned "Master Builder" for constructing 10 buildings',
    timestamp: new Date(Date.now() - 10800000), // 3 hours ago
  },
  {
    id: '5',
    type: 'land_purchase',
    title: 'Land Acquired',
    description: 'Purchased Mountain Plot #15 with rare metal deposits',
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    value: 50,
    currency: 'STX',
    txHash: '0xabcdef1234567890'
  },
  {
    id: '6',
    type: 'event_joined',
    title: 'Event Participation',
    description: 'Joined "Summer Building Contest" community event',
    timestamp: new Date(Date.now() - 172800000), // 2 days ago
    value: 5,
    currency: 'STX'
  }
];

export function ActivityFeed() {
  const [filter, setFilter] = useState<string>('all');
  const [showAll, setShowAll] = useState(false);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'land_purchase':
        return <MapPin className="w-4 h-4 text-green-500" />;
      case 'building_constructed':
        return <Building className="w-4 h-4 text-blue-500" />;
      case 'resource_harvested':
        return <Package className="w-4 h-4 text-yellow-500" />;
      case 'marketplace_sale':
        return <ShoppingBag className="w-4 h-4 text-purple-500" />;
      case 'event_joined':
        return <Users className="w-4 h-4 text-orange-500" />;
      case 'achievement_unlocked':
        return <Trophy className="w-4 h-4 text-yellow-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'land_purchase':
        return 'border-green-200 bg-green-50';
      case 'building_constructed':
        return 'border-blue-200 bg-blue-50';
      case 'resource_harvested':
        return 'border-yellow-200 bg-yellow-50';
      case 'marketplace_sale':
        return 'border-purple-200 bg-purple-50';
      case 'event_joined':
        return 'border-orange-200 bg-orange-50';
      case 'achievement_unlocked':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const filteredActivities = filter === 'all' 
    ? mockActivities 
    : mockActivities.filter(activity => activity.type === filter);

  const displayedActivities = showAll 
    ? filteredActivities 
    : filteredActivities.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-game border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 text-purple-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <p className="text-sm text-gray-600">Your latest actions and achievements</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Filter />}
          >
            Filter
          </Button>
        </div>
      </div>

      {/* Activity List */}
      <div className="p-6">
        <div className="space-y-4">
          {displayedActivities.map((activity) => (
            <div 
              key={activity.id}
              className={`p-4 rounded-lg border ${getActivityColor(activity.type)} transition-all hover:shadow-sm`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {activity.title}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.description}
                  </p>
                  
                  {/* Value and Transaction Info */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-4">
                      {activity.value && (
                        <div className="flex items-center space-x-1">
                          <Coins className="w-3 h-3 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-900">
                            {activity.value} {activity.currency}
                          </span>
                        </div>
                      )}
                      {activity.txHash && (
                        <button className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800">
                          <ExternalLink className="w-3 h-3" />
                          <span>View Transaction</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {filteredActivities.length > 5 && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Less' : `Show All ${filteredActivities.length} Activities`}
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Recent Activity</h4>
            <p className="text-gray-600">Start playing to see your activities here!</p>
          </div>
        )}
      </div>
    </div>
  );
}

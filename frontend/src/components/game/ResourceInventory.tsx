'use client';

import React, { useState } from 'react';
import { 
  Package, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Minus,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MOCK_PLAYER_INVENTORY, RESOURCE_CONFIG } from '@/lib/game-data';

export function ResourceInventory() {
  const [showChart, setShowChart] = useState(false);
  const resources = MOCK_PLAYER_INVENTORY.resources;

  // Mock resource changes (in a real app, this would come from the blockchain)
  const resourceChanges = {
    wood: +12,
    stone: +8,
    metal: -5,
    energy: +15,
    water: +20,
    food: -3,
    tokens: +45
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-3 h-3 text-red-500" />;
    return null;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-game border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Package className="w-6 h-6 text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Resource Inventory</h3>
              <p className="text-sm text-gray-600">Current resources and production rates</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChart(!showChart)}
              leftIcon={<BarChart3 />}
            >
              {showChart ? 'Hide Chart' : 'Show Chart'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw />}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {Object.entries(resources).map(([resourceType, amount]) => {
            const config = RESOURCE_CONFIG[resourceType as keyof typeof RESOURCE_CONFIG];
            const change = resourceChanges[resourceType as keyof typeof resourceChanges];
            
            return (
              <div 
                key={resourceType}
                className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors cursor-pointer"
              >
                {/* Resource Icon */}
                <div className="text-2xl mb-2">{config.icon}</div>
                
                {/* Resource Name */}
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {config.name}
                </div>
                
                {/* Amount */}
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {amount.toLocaleString()}
                </div>
                
                {/* Change Indicator */}
                {change !== 0 && (
                  <div className={`flex items-center justify-center space-x-1 text-xs ${getChangeColor(change)}`}>
                    {getChangeIcon(change)}
                    <span>{change > 0 ? '+' : ''}{change}</span>
                  </div>
                )}
                
                {/* Storage Bar */}
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="h-1 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((amount / 1000) * 100, 100)}%`,
                        backgroundColor: config.color 
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {Math.min(amount, 1000)}/1000
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Production Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
            Production Summary (Last Hour)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-green-600 font-semibold">+55</div>
              <div className="text-gray-600">Total Gained</div>
            </div>
            <div className="text-center">
              <div className="text-red-600 font-semibold">-8</div>
              <div className="text-gray-600">Total Used</div>
            </div>
            <div className="text-center">
              <div className="text-blue-600 font-semibold">+47</div>
              <div className="text-gray-600">Net Change</div>
            </div>
            <div className="text-center">
              <div className="text-purple-600 font-semibold">12</div>
              <div className="text-gray-600">Active Buildings</div>
            </div>
          </div>
        </div>

        {/* Resource Chart Placeholder */}
        {showChart && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-4">Resource Production Chart</h4>
            <div className="h-64 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>Chart.js integration placeholder</p>
                <p className="text-sm">Real-time resource production visualization</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" leftIcon={<Plus />}>
            Collect All
          </Button>
          <Button variant="outline" size="sm" leftIcon={<Package />}>
            Manage Storage
          </Button>
          <Button variant="outline" size="sm" leftIcon={<TrendingUp />}>
            Boost Production
          </Button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { 
  MapPin, 
  Building, 
  TrendingUp, 
  Clock,
  Star,
  Zap,
  Eye,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LandPlot, TERRAIN_CONFIG } from '@/lib/game-data';

interface LandPlotCardProps {
  land: LandPlot;
  viewMode: 'grid' | 'list';
  onSelect: () => void;
  isSelected: boolean;
}

export function LandPlotCard({ land, viewMode, onSelect, isSelected }: LandPlotCardProps) {
  const terrainConfig = TERRAIN_CONFIG[land.terrain];
  const timeSinceHarvest = Date.now() - land.lastHarvested.getTime();
  const hoursAgo = Math.floor(timeSinceHarvest / (1000 * 60 * 60));
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'uncommon': return 'text-green-600 bg-green-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProductivityColor = (productivity: number) => {
    if (productivity >= 80) return 'text-green-600';
    if (productivity >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (viewMode === 'list') {
    return (
      <div 
        className={`bg-white rounded-lg shadow-game border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
          isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={onSelect}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            {/* Left Section - Basic Info */}
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl"
                  style={{ backgroundColor: terrainConfig.color }}
                >
                  {terrainConfig.icon}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Land Plot #{land.tokenId}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>({land.x}, {land.y})</span>
                  <span>•</span>
                  <span className="capitalize">{land.terrain}</span>
                  <span>•</span>
                  <span>{land.size} units</span>
                </div>
              </div>
            </div>

            {/* Middle Section - Stats */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-sm text-gray-600">Buildings</div>
                <div className="text-lg font-semibold text-gray-900">{land.buildings.length}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Productivity</div>
                <div className={`text-lg font-semibold ${getProductivityColor(land.productivity)}`}>
                  {land.productivity}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Last Harvest</div>
                <div className="text-lg font-semibold text-gray-900">{hoursAgo}h ago</div>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getRarityColor(land.rarity)}`}>
                {land.rarity}
              </span>
              <Button variant="outline" size="sm" leftIcon={<Eye />}>
                View
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div 
      className={`bg-white rounded-lg shadow-game border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      {/* Header with terrain visualization */}
      <div 
        className="h-24 rounded-t-lg relative overflow-hidden"
        style={{ backgroundColor: terrainConfig.color }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize bg-white/90 ${getRarityColor(land.rarity).split(' ')[0]}`}>
            {land.rarity}
          </span>
        </div>
        <div className="absolute bottom-2 right-2 text-white text-2xl">
          {terrainConfig.icon}
        </div>
        <div className="absolute bottom-2 left-2 text-white">
          <div className="text-sm font-medium">Plot #{land.tokenId}</div>
          <div className="text-xs opacity-90">({land.x}, {land.y})</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Terrain and Size */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 capitalize">{land.terrain}</h3>
            <p className="text-sm text-gray-600">{land.size} units</p>
          </div>
          <div className="text-right">
            <div className={`text-sm font-medium ${getProductivityColor(land.productivity)}`}>
              {land.productivity}%
            </div>
            <div className="text-xs text-gray-500">productivity</div>
          </div>
        </div>

        {/* Buildings and Resources */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="text-center p-2 bg-gray-50 rounded">
            <Building className="w-4 h-4 mx-auto mb-1 text-blue-500" />
            <div className="text-sm font-medium text-gray-900">{land.buildings.length}</div>
            <div className="text-xs text-gray-600">Buildings</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <Zap className="w-4 h-4 mx-auto mb-1 text-yellow-500" />
            <div className="text-sm font-medium text-gray-900">{land.resources.length}</div>
            <div className="text-xs text-gray-600">Resources</div>
          </div>
        </div>

        {/* Last Harvest */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Last harvest: {hoursAgo}h ago</span>
          </div>
          {land.productivity > 80 && (
            <div className="flex items-center space-x-1 text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span>High yield</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" fullWidth leftIcon={<Eye />}>
            View Details
          </Button>
          <Button variant="outline" size="sm" leftIcon={<Settings />}>
            <span className="sr-only">Manage</span>
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { 
  Package, 
  Clock, 
  Star,
  Zap,
  Eye,
  Play,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Blueprint, BUILDING_CONFIG, RESOURCE_CONFIG } from '@/lib/game-data';

interface BlueprintCardProps {
  blueprint: Blueprint;
  viewMode: 'grid' | 'list';
  onSelect: () => void;
  isSelected: boolean;
}

export function BlueprintCard({ blueprint, viewMode, onSelect, isSelected }: BlueprintCardProps) {
  const buildingConfig = BUILDING_CONFIG[blueprint.buildingType];
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100 border-gray-300';
      case 'uncommon': return 'text-green-600 bg-green-100 border-green-300';
      case 'rare': return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'epic': return 'text-purple-600 bg-purple-100 border-purple-300';
      case 'legendary': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'shadow-lg shadow-yellow-200';
      case 'epic': return 'shadow-lg shadow-purple-200';
      case 'rare': return 'shadow-lg shadow-blue-200';
      default: return '';
    }
  };

  if (viewMode === 'list') {
    return (
      <div 
        className={`bg-white rounded-lg shadow-game border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
          isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
        } ${getRarityGlow(blueprint.rarity)}`}
        onClick={onSelect}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            {/* Left Section - Basic Info */}
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
                  {buildingConfig.icon}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {blueprint.buildingType} Blueprint
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Package className="w-4 h-4" />
                  <span>#{blueprint.tokenId}</span>
                  <span>•</span>
                  <span>Max Level {blueprint.maxLevel}</span>
                  <span>•</span>
                  <Clock className="w-4 h-4" />
                  <span>{blueprint.constructionTime}m build</span>
                </div>
              </div>
            </div>

            {/* Middle Section - Resources */}
            <div className="hidden md:flex items-center space-x-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Requires</div>
                <div className="flex items-center space-x-2">
                  {blueprint.resourceConsumption.slice(0, 3).map((cost, index) => {
                    const resourceConfig = RESOURCE_CONFIG[cost.type];
                    return (
                      <div key={index} className="flex items-center space-x-1 text-xs">
                        <span>{resourceConfig.icon}</span>
                        <span>{cost.amount}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Produces</div>
                <div className="flex items-center space-x-2">
                  {blueprint.output.slice(0, 3).map((output, index) => {
                    const resourceConfig = RESOURCE_CONFIG[output.type];
                    return (
                      <div key={index} className="flex items-center space-x-1 text-xs">
                        <span>{resourceConfig.icon}</span>
                        <span>{output.amount}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getRarityColor(blueprint.rarity)}`}>
                {blueprint.rarity}
              </span>
              <Button variant="primary" size="sm" leftIcon={<Play />}>
                Use Blueprint
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
      } ${getRarityGlow(blueprint.rarity)}`}
      onClick={onSelect}
    >
      {/* Header with building type visualization */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-500 h-24 rounded-t-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize border bg-white/90 ${getRarityColor(blueprint.rarity).split(' ')[0]}`}>
            {blueprint.rarity}
          </span>
        </div>
        <div className="absolute bottom-2 right-2 text-white text-3xl">
          {buildingConfig.icon}
        </div>
        <div className="absolute bottom-2 left-2 text-white">
          <div className="text-sm font-medium">#{blueprint.tokenId}</div>
          <div className="text-xs opacity-90 capitalize">{blueprint.buildingType}</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Description */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 capitalize mb-1">
            {blueprint.buildingType} Blueprint
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {blueprint.description}
          </p>
        </div>

        {/* Construction Info */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="text-center p-2 bg-gray-50 rounded">
            <Clock className="w-4 h-4 mx-auto mb-1 text-blue-500" />
            <div className="text-sm font-medium text-gray-900">{blueprint.constructionTime}m</div>
            <div className="text-xs text-gray-600">Build Time</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <TrendingUp className="w-4 h-4 mx-auto mb-1 text-green-500" />
            <div className="text-sm font-medium text-gray-900">Level {blueprint.maxLevel}</div>
            <div className="text-xs text-gray-600">Max Level</div>
          </div>
        </div>

        {/* Resource Requirements */}
        <div className="mb-3">
          <div className="text-xs text-gray-600 mb-2 flex items-center">
            <Package className="w-3 h-3 mr-1" />
            Required Resources
          </div>
          <div className="flex items-center space-x-2">
            {blueprint.resourceConsumption.map((cost, index) => {
              const resourceConfig = RESOURCE_CONFIG[cost.type];
              return (
                <div key={index} className="flex items-center space-x-1 bg-gray-100 rounded px-2 py-1">
                  <span className="text-sm">{resourceConfig.icon}</span>
                  <span className="text-xs font-medium">{cost.amount}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Output */}
        <div className="mb-4">
          <div className="text-xs text-gray-600 mb-2 flex items-center">
            <Zap className="w-3 h-3 mr-1" />
            Produces
          </div>
          <div className="flex items-center space-x-2">
            {blueprint.output.map((output, index) => {
              const resourceConfig = RESOURCE_CONFIG[output.type];
              return (
                <div key={index} className="flex items-center space-x-1 bg-green-100 rounded px-2 py-1">
                  <span className="text-sm">{resourceConfig.icon}</span>
                  <span className="text-xs font-medium">{output.amount}</span>
                  <span className="text-xs text-gray-500">/{output.interval}m</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button variant="primary" size="sm" fullWidth leftIcon={<Play />}>
            Use Blueprint
          </Button>
          <Button variant="outline" size="sm" leftIcon={<Eye />}>
            <span className="sr-only">View Details</span>
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

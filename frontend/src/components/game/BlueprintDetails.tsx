'use client';

import React from 'react';
import { 
  Package, 
  X, 
  Clock, 
  Star,
  Zap,
  Play,
  TrendingUp,
  MapPin,
  Building,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MOCK_PLAYER_INVENTORY, BUILDING_CONFIG, RESOURCE_CONFIG } from '@/lib/game-data';

interface BlueprintDetailsProps {
  blueprintId: string;
  onClose: () => void;
}

export function BlueprintDetails({ blueprintId, onClose }: BlueprintDetailsProps) {
  const blueprint = MOCK_PLAYER_INVENTORY.blueprints.find(b => b.id === blueprintId);
  
  if (!blueprint) {
    return (
      <div className="bg-white rounded-lg shadow-game border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-2" />
          <p>Blueprint not found</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="bg-white rounded-lg shadow-game border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-4 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{buildingConfig.icon}</div>
          <div>
            <h3 className="text-lg font-semibold capitalize">
              {blueprint.buildingType} Blueprint
            </h3>
            <p className="text-blue-100 text-sm">#{blueprint.tokenId}</p>
          </div>
        </div>
        <div className="mt-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize border bg-white/90 ${getRarityColor(blueprint.rarity).split(' ')[0]}`}>
            {blueprint.rarity}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Description */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <Info className="w-4 h-4 mr-2 text-blue-500" />
            Description
          </h4>
          <p className="text-sm text-gray-600">{blueprint.description}</p>
        </div>

        {/* Construction Details */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <Clock className="w-4 h-4 mr-2 text-orange-500" />
            Construction
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-50 rounded p-2">
              <div className="text-gray-600">Build Time</div>
              <div className="font-medium">{blueprint.constructionTime} minutes</div>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <div className="text-gray-600">Max Level</div>
              <div className="font-medium">Level {blueprint.maxLevel}</div>
            </div>
          </div>
        </div>

        {/* Resource Requirements */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <Package className="w-4 h-4 mr-2 text-purple-500" />
            Required Resources
          </h4>
          <div className="space-y-2">
            {blueprint.resourceConsumption.map((cost, index) => {
              const resourceConfig = RESOURCE_CONFIG[cost.type];
              return (
                <div key={index} className="flex items-center justify-between bg-gray-50 rounded p-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{resourceConfig.icon}</span>
                    <span className="text-sm font-medium capitalize">{resourceConfig.name}</span>
                  </div>
                  <span className="text-sm font-bold">{cost.amount}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Production Output */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <Zap className="w-4 h-4 mr-2 text-green-500" />
            Production Output
          </h4>
          <div className="space-y-2">
            {blueprint.output.map((output, index) => {
              const resourceConfig = RESOURCE_CONFIG[output.type];
              return (
                <div key={index} className="flex items-center justify-between bg-green-50 rounded p-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{resourceConfig.icon}</span>
                    <span className="text-sm font-medium capitalize">{resourceConfig.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{output.amount}</div>
                    <div className="text-xs text-gray-500">per {output.interval}m</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Efficiency Stats */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
            Efficiency
          </h4>
          <div className="bg-blue-50 rounded p-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-gray-600">Resource Efficiency</div>
                <div className="font-medium text-blue-600">High</div>
              </div>
              <div>
                <div className="text-gray-600">Production Rate</div>
                <div className="font-medium text-blue-600">
                  {blueprint.output.reduce((sum, output) => sum + output.amount, 0)}/hour
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compatible Terrains */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-green-500" />
            Best Terrain Types
          </h4>
          <div className="flex flex-wrap gap-1">
            {Object.entries(BUILDING_CONFIG).map(([type, config]) => {
              if (type === blueprint.buildingType) {
                // This is a simplified example - in a real app, you'd have terrain compatibility data
                const compatibleTerrains = ['grassland', 'forest', 'mountain'];
                return compatibleTerrains.map((terrain) => (
                  <span key={terrain} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full capitalize">
                    {terrain}
                  </span>
                ));
              }
              return null;
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button variant="primary" fullWidth leftIcon={<Play />}>
            Use Blueprint on Land
          </Button>
          <Button variant="outline" fullWidth leftIcon={<Building />}>
            View Compatible Lands
          </Button>
        </div>

        {/* Usage Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
          <h5 className="font-medium text-yellow-800 mb-1">💡 Usage Tips</h5>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• Place on compatible terrain for maximum efficiency</li>
            <li>• Ensure you have all required resources before building</li>
            <li>• Consider proximity to other buildings for synergy bonuses</li>
            <li>• Higher level buildings produce more resources</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

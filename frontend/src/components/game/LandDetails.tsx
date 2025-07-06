'use client';

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Mountain,
  Zap,
  Users,
  Building,
  Star,
  TrendingUp,
  Clock,
  Coins
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LandPlot } from '@/components/providers/GameProvider';
import { BuildingConstructor } from './BuildingConstructor';

interface LandDetailsProps {
  land: LandPlot;
  onClose: () => void;
}

const TERRAIN_INFO = {
  plains: {
    icon: '🌾',
    description: 'Fertile grasslands perfect for residential development',
    baseResource: 100,
    maxBuildings: 10,
  },
  forest: {
    icon: '🌲',
    description: 'Dense woodlands providing natural resources',
    baseResource: 150,
    maxBuildings: 8,
  },
  mountain: {
    icon: '⛰️',
    description: 'Rocky highlands rich in minerals',
    baseResource: 200,
    maxBuildings: 6,
  },
  desert: {
    icon: '🏜️',
    description: 'Arid lands with unique building opportunities',
    baseResource: 80,
    maxBuildings: 12,
  },
  coastal: {
    icon: '🏖️',
    description: 'Scenic waterfront property with trade bonuses',
    baseResource: 120,
    maxBuildings: 9,
  },
  volcanic: {
    icon: '🌋',
    description: 'Rare volcanic soil with exceptional resource generation',
    baseResource: 300,
    maxBuildings: 4,
  },
};

const RARITY_INFO = {
  common: { color: 'text-gray-600', bgColor: 'bg-gray-100', multiplier: '1x' },
  uncommon: { color: 'text-green-600', bgColor: 'bg-green-100', multiplier: '1.2x' },
  rare: { color: 'text-blue-600', bgColor: 'bg-blue-100', multiplier: '1.5x' },
  epic: { color: 'text-purple-600', bgColor: 'bg-purple-100', multiplier: '2x' },
  legendary: { color: 'text-yellow-600', bgColor: 'bg-yellow-100', multiplier: '3x' },
};

export function LandDetails({ land, onClose }: LandDetailsProps) {
  const [showConstructor, setShowConstructor] = useState(false);
  const terrainInfo = TERRAIN_INFO[land.terrain as keyof typeof TERRAIN_INFO];
  const rarityInfo = RARITY_INFO[land.rarity as keyof typeof RARITY_INFO];
  const buildingCount = land.buildings?.length || 0;
  const maxBuildings = terrainInfo?.maxBuildings || 10;

  const handleConstruct = (blueprintId: number) => {
    console.log('Constructing building with blueprint:', blueprintId, 'on land:', land.id);
    // Here you would integrate with the smart contract
    setShowConstructor(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
                {terrainInfo?.icon || '🏞️'}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  Land Plot ({land.x}, {land.y})
                </h2>
                <p className="text-primary-100">
                  {land.terrain.charAt(0).toUpperCase() + land.terrain.slice(1)} Terrain
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Location</span>
              </div>
              <div className="text-lg font-semibold">({land.x}, {land.y})</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Mountain className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Size</span>
              </div>
              <div className="text-lg font-semibold">{land.size} units</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Rarity</span>
              </div>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${rarityInfo.color} ${rarityInfo.bgColor}`}>
                {land.rarity.charAt(0).toUpperCase() + land.rarity.slice(1)}
              </div>
            </div>
          </div>

          {/* Terrain Description */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Terrain Information</h3>
            <p className="text-blue-800 text-sm mb-3">{terrainInfo?.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-600">Base Resource Rate:</span>
                <span className="ml-2 font-medium">{terrainInfo?.baseResource}/hour</span>
              </div>
              <div>
                <span className="text-blue-600">Max Buildings:</span>
                <span className="ml-2 font-medium">{terrainInfo?.maxBuildings}</span>
              </div>
            </div>
          </div>

          {/* Resource Generation */}
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Resource Generation</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-green-600">Current Rate</div>
                <div className="text-xl font-bold text-green-900">
                  {Math.round((terrainInfo?.baseResource || 0) * (land.resourceMultiplier / 100))} /hour
                </div>
              </div>
              <div>
                <div className="text-sm text-green-600">Multiplier</div>
                <div className="text-xl font-bold text-green-900">
                  {(land.resourceMultiplier / 100).toFixed(1)}x
                </div>
              </div>
            </div>
          </div>

          {/* Buildings */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Buildings</h3>
              </div>
              <span className="text-sm text-gray-600">
                {buildingCount} / {maxBuildings}
              </span>
            </div>

            {buildingCount > 0 ? (
              <div className="space-y-3">
                {land.buildings.map((building, index) => (
                  <div key={building.id} className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {building.type.charAt(0).toUpperCase() + building.type.slice(1)} Building
                        </div>
                        <div className="text-sm text-gray-600">
                          {building.rarity.charAt(0).toUpperCase() + building.rarity.slice(1)} Quality
                        </div>
                      </div>
                      <div className="text-right">
                        {building.isBuilt ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Built
                          </span>
                        ) : (
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{building.buildProgress}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Building className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No buildings constructed yet</p>
                <p className="text-sm">Start building to generate more resources!</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => setShowConstructor(true)}
              disabled={buildingCount >= maxBuildings}
            >
              <Building className="w-4 h-4 mr-2" />
              {buildingCount >= maxBuildings ? 'Land Full' : 'Place Building'}
            </Button>
            <Button variant="outline" className="flex-1">
              <Coins className="w-4 h-4 mr-2" />
              List for Sale
            </Button>
            <Button variant="outline" className="flex-1">
              <Users className="w-4 h-4 mr-2" />
              Share Land
            </Button>
          </div>
        </div>
      </div>

      {/* Building Constructor Modal */}
      {showConstructor && (
        <BuildingConstructor
          landId={land.id}
          landTerrain={land.terrain}
          landRarity={land.rarity}
          onClose={() => setShowConstructor(false)}
          onConstruct={handleConstruct}
        />
      )}
    </div>
  );
}

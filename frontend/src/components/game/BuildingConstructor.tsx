'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Hammer, 
  Clock, 
  Zap, 
  Package,
  AlertCircle,
  CheckCircle,
  Building,
  Coins,
  Timer
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Blueprint {
  id: number;
  name: string;
  type: 'residential' | 'commercial' | 'industrial' | 'decorative';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  cost: {
    wood: number;
    stone: number;
    metal: number;
    energy: number;
  };
  production: {
    wood: number;
    stone: number;
    metal: number;
    energy: number;
    tokens: number;
  };
  buildTime: number; // in hours
}

interface PlayerResources {
  wood: number;
  stone: number;
  metal: number;
  energy: number;
}

interface BuildingConstructorProps {
  landId: number;
  landTerrain: string;
  landRarity: string;
  onClose: () => void;
  onConstruct: (blueprintId: number) => void;
}

// Mock data - in real app this would come from blockchain/API
const MOCK_BLUEPRINTS: Blueprint[] = [
  {
    id: 1,
    name: "Cozy Cottage",
    type: "residential",
    rarity: "common",
    cost: { wood: 50, stone: 30, metal: 10, energy: 20 },
    production: { wood: 0, stone: 0, metal: 0, energy: 5, tokens: 10 },
    buildTime: 24
  },
  {
    id: 2,
    name: "Trading Post",
    type: "commercial",
    rarity: "uncommon",
    cost: { wood: 80, stone: 60, metal: 40, energy: 30 },
    production: { wood: 2, stone: 1, metal: 1, energy: 0, tokens: 25 },
    buildTime: 36
  },
  {
    id: 3,
    name: "Mining Facility",
    type: "industrial",
    rarity: "rare",
    cost: { wood: 120, stone: 150, metal: 100, energy: 80 },
    production: { wood: 5, stone: 8, metal: 12, energy: 0, tokens: 15 },
    buildTime: 48
  },
  {
    id: 4,
    name: "Crystal Garden",
    type: "decorative",
    rarity: "epic",
    cost: { wood: 40, stone: 80, metal: 60, energy: 100 },
    production: { wood: 1, stone: 1, metal: 0, energy: 2, tokens: 5 },
    buildTime: 12
  }
];

const MOCK_PLAYER_RESOURCES: PlayerResources = {
  wood: 150,
  stone: 120,
  metal: 80,
  energy: 200
};

const RARITY_COLORS = {
  common: 'text-gray-600 bg-gray-100',
  uncommon: 'text-green-600 bg-green-100',
  rare: 'text-blue-600 bg-blue-100',
  epic: 'text-purple-600 bg-purple-100',
  legendary: 'text-yellow-600 bg-yellow-100'
};

const TYPE_ICONS = {
  residential: '🏠',
  commercial: '🏪',
  industrial: '🏭',
  decorative: '🌸'
};

export function BuildingConstructor({ 
  landId, 
  landTerrain, 
  landRarity, 
  onClose, 
  onConstruct 
}: BuildingConstructorProps) {
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [playerResources, setPlayerResources] = useState<PlayerResources>(MOCK_PLAYER_RESOURCES);
  const [isConstructing, setIsConstructing] = useState(false);

  const canAfford = (blueprint: Blueprint): boolean => {
    return (
      playerResources.wood >= blueprint.cost.wood &&
      playerResources.stone >= blueprint.cost.stone &&
      playerResources.metal >= blueprint.cost.metal &&
      playerResources.energy >= blueprint.cost.energy
    );
  };

  const calculateTerrainBonus = (baseProduction: number): number => {
    const terrainMultipliers = {
      plains: 1.0,
      forest: 1.2,
      mountain: 1.5,
      desert: 0.8,
      coastal: 1.1,
      volcanic: 2.0
    };
    
    const rarityMultipliers = {
      common: 1.0,
      uncommon: 1.25,
      rare: 1.5,
      epic: 2.0,
      legendary: 3.0
    };

    const terrainBonus = terrainMultipliers[landTerrain as keyof typeof terrainMultipliers] || 1.0;
    const rarityBonus = rarityMultipliers[landRarity as keyof typeof rarityMultipliers] || 1.0;
    
    return Math.round(baseProduction * terrainBonus * rarityBonus);
  };

  const handleConstruct = async () => {
    if (!selectedBlueprint || !canAfford(selectedBlueprint)) return;

    setIsConstructing(true);
    
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Deduct resources
      setPlayerResources(prev => ({
        wood: prev.wood - selectedBlueprint.cost.wood,
        stone: prev.stone - selectedBlueprint.cost.stone,
        metal: prev.metal - selectedBlueprint.cost.metal,
        energy: prev.energy - selectedBlueprint.cost.energy
      }));

      onConstruct(selectedBlueprint.id);
      onClose();
    } catch (error) {
      console.error('Construction failed:', error);
    } finally {
      setIsConstructing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Hammer className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Building Constructor</h2>
                <p className="text-orange-100">
                  Choose a blueprint to build on your {landTerrain} land
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

        <div className="flex h-[calc(90vh-120px)]">
          {/* Blueprint Selection */}
          <div className="flex-1 p-6 overflow-y-auto border-r border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Available Blueprints</h3>
            
            <div className="space-y-4">
              {MOCK_BLUEPRINTS.map((blueprint) => {
                const affordable = canAfford(blueprint);
                const isSelected = selectedBlueprint?.id === blueprint.id;
                
                return (
                  <div
                    key={blueprint.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : affordable 
                          ? 'border-gray-200 hover:border-gray-300' 
                          : 'border-gray-100 bg-gray-50 opacity-60'
                    }`}
                    onClick={() => affordable && setSelectedBlueprint(blueprint)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {TYPE_ICONS[blueprint.type]}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{blueprint.name}</h4>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${RARITY_COLORS[blueprint.rarity]}`}>
                              {blueprint.rarity}
                            </span>
                            <span className="text-sm text-gray-600 capitalize">
                              {blueprint.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      {!affordable && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>

                    {/* Resource Costs */}
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {Object.entries(blueprint.cost).map(([resource, amount]) => (
                        <div key={resource} className="text-center">
                          <div className="text-xs text-gray-600 capitalize">{resource}</div>
                          <div className={`text-sm font-medium ${
                            playerResources[resource as keyof PlayerResources] >= amount 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {amount}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Build Time */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Build time: {blueprint.buildTime}h</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Construction Details */}
          <div className="w-96 p-6 bg-gray-50">
            {selectedBlueprint ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Construction Details</h3>
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-3xl">{TYPE_ICONS[selectedBlueprint.type]}</div>
                      <div>
                        <h4 className="font-semibold">{selectedBlueprint.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${RARITY_COLORS[selectedBlueprint.rarity]}`}>
                          {selectedBlueprint.rarity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resource Requirements */}
                <div>
                  <h4 className="font-medium mb-3">Resource Requirements</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedBlueprint.cost).map(([resource, amount]) => {
                      const available = playerResources[resource as keyof PlayerResources];
                      const sufficient = available >= amount;
                      
                      return (
                        <div key={resource} className="flex items-center justify-between bg-white rounded-lg p-3">
                          <span className="capitalize font-medium">{resource}</span>
                          <div className="flex items-center space-x-2">
                            <span className={sufficient ? 'text-green-600' : 'text-red-600'}>
                              {amount}
                            </span>
                            <span className="text-gray-400">/</span>
                            <span className="text-gray-600">{available}</span>
                            {sufficient ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Production Preview */}
                <div>
                  <h4 className="font-medium mb-3">Daily Production (with terrain bonus)</h4>
                  <div className="bg-white rounded-lg p-4 space-y-2">
                    {Object.entries(selectedBlueprint.production).map(([resource, amount]) => {
                      const bonusAmount = calculateTerrainBonus(amount);
                      
                      return (
                        <div key={resource} className="flex items-center justify-between">
                          <span className="capitalize text-sm">{resource}</span>
                          <div className="flex items-center space-x-2">
                            {amount > 0 && (
                              <>
                                <span className="text-gray-400 text-sm line-through">{amount}</span>
                                <span className="text-green-600 font-medium">{bonusAmount}</span>
                              </>
                            )}
                            {amount === 0 && (
                              <span className="text-gray-400">0</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Construction Button */}
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleConstruct}
                  disabled={!canAfford(selectedBlueprint) || isConstructing}
                >
                  {isConstructing ? (
                    <>
                      <Timer className="w-4 h-4 mr-2 animate-spin" />
                      Constructing...
                    </>
                  ) : (
                    <>
                      <Building className="w-4 h-4 mr-2" />
                      Start Construction
                    </>
                  )}
                </Button>

                {!canAfford(selectedBlueprint) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-red-700">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Insufficient Resources</span>
                    </div>
                    <p className="text-red-600 text-sm mt-1">
                      You need more resources to construct this building.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Blueprint
                </h3>
                <p className="text-gray-600">
                  Choose a blueprint from the left to see construction details and start building.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Player Resources Footer */}
        <div className="bg-gray-100 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Your Resources:</span>
            <div className="flex items-center space-x-6">
              {Object.entries(playerResources).map(([resource, amount]) => (
                <div key={resource} className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 capitalize">{resource}:</span>
                  <span className="font-medium">{amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

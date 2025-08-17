'use client';

import React, { useState } from 'react';
import { 
  Filter, 
  Star, 
  MapPin,
  Package,
  Building,
  Zap,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MarketplaceFiltersProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
}

export function MarketplaceFilters({ 
  priceRange, 
  onPriceRangeChange 
}: MarketplaceFiltersProps) {
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const rarities = [
    { id: 'common', name: 'Common', color: 'text-gray-600' },
    { id: 'uncommon', name: 'Uncommon', color: 'text-green-600' },
    { id: 'rare', name: 'Rare', color: 'text-blue-600' },
    { id: 'epic', name: 'Epic', color: 'text-purple-600' },
    { id: 'legendary', name: 'Legendary', color: 'text-yellow-600' }
  ];

  const types = [
    { id: 'land', name: 'Land Plots', icon: <MapPin className="w-4 h-4" />, color: 'text-green-500' },
    { id: 'blueprint', name: 'Blueprints', icon: <Package className="w-4 h-4" />, color: 'text-blue-500' },
    { id: 'building', name: 'Buildings', icon: <Building className="w-4 h-4" />, color: 'text-purple-500' },
    { id: 'resource', name: 'Resources', icon: <Zap className="w-4 h-4" />, color: 'text-yellow-500' }
  ];

  const handleRarityToggle = (rarity: string) => {
    setSelectedRarities(prev => 
      prev.includes(rarity) 
        ? prev.filter(r => r !== rarity)
        : [...prev, rarity]
    );
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearAllFilters = () => {
    setSelectedRarities([]);
    setSelectedTypes([]);
    setShowFeaturedOnly(false);
    onPriceRangeChange([0, 1000]);
  };

  const hasActiveFilters = selectedRarities.length > 0 || 
                          selectedTypes.length > 0 || 
                          showFeaturedOnly || 
                          priceRange[0] > 0 || 
                          priceRange[1] < 1000;

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="bg-white rounded-lg shadow-game border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Filter className="w-5 h-5 mr-2 text-purple-500" />
            Filters
          </h3>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              leftIcon={<RotateCcw />}
              className="text-gray-600 hover:text-gray-900"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Featured Items */}
        <div className="mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showFeaturedOnly}
              onChange={(e) => setShowFeaturedOnly(e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Featured Only</span>
          </label>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range (STX)
          </label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => onPriceRangeChange([parseInt(e.target.value) || 0, priceRange[1]])}
                className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Min"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value) || 1000])}
                className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Max"
              />
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Item Types */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Item Types
          </label>
          <div className="space-y-2">
            {types.map((type) => (
              <label key={type.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type.id)}
                  onChange={() => handleTypeToggle(type.id)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div className={`${type.color}`}>
                  {type.icon}
                </div>
                <span className="text-sm text-gray-700">{type.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rarity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Rarity
          </label>
          <div className="space-y-2">
            {rarities.map((rarity) => (
              <label key={rarity.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedRarities.includes(rarity.id)}
                  onChange={() => handleRarityToggle(rarity.id)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className={`text-sm font-medium ${rarity.color}`}>
                  {rarity.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="bg-white rounded-lg shadow-game border border-gray-200 p-4">
        <h4 className="font-medium text-gray-900 mb-3">Quick Filters</h4>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            fullWidth
            onClick={() => {
              setSelectedRarities(['legendary', 'epic']);
              setSelectedTypes([]);
            }}
          >
            High Value Items
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            fullWidth
            onClick={() => {
              setSelectedTypes(['land']);
              setSelectedRarities([]);
            }}
          >
            Land Plots Only
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            fullWidth
            onClick={() => {
              onPriceRangeChange([0, 50]);
              setSelectedRarities([]);
              setSelectedTypes([]);
            }}
          >
            Budget Friendly
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            fullWidth
            onClick={() => {
              setShowFeaturedOnly(true);
              setSelectedRarities([]);
              setSelectedTypes([]);
            }}
          >
            Featured Items
          </Button>
        </div>
      </div>

      {/* Market Insights */}
      <div className="bg-white rounded-lg shadow-game border border-gray-200 p-4">
        <h4 className="font-medium text-gray-900 mb-3">Market Insights</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Trending:</span>
            <span className="font-medium text-green-600">Land Plots ↗</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Hot Category:</span>
            <span className="font-medium text-blue-600">Blueprints</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Avg. Price:</span>
            <span className="font-medium">127 STX</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">24h Volume:</span>
            <span className="font-medium">2,450 STX</span>
          </div>
        </div>
      </div>
    </div>
  );
}

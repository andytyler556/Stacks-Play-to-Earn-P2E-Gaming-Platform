'use client';

import React, { useState } from 'react';
import { 
  Package, 
  Grid3X3, 
  List, 
  Filter,
  Search,
  Plus,
  Star,
  Clock,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BlueprintGallery } from '@/components/game/BlueprintGallery';
import { BlueprintCard } from '@/components/game/BlueprintCard';
import { BlueprintDetails } from '@/components/game/BlueprintDetails';
import { BlueprintFilter } from '@/components/game/BlueprintFilter';
import { MOCK_PLAYER_INVENTORY } from '@/lib/game-data';

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'farm' | 'mine' | 'factory' | 'house' | 'tower' | 'portal';
type SortOption = 'newest' | 'oldest' | 'rarity' | 'type';

export default function BlueprintsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlueprint, setSelectedBlueprint] = useState<string | null>(null);

  const blueprints = MOCK_PLAYER_INVENTORY.blueprints;
  
  const filteredBlueprints = blueprints
    .filter(blueprint => {
      const matchesFilter = filter === 'all' || blueprint.buildingType === filter;
      const matchesSearch = searchTerm === '' || 
        blueprint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blueprint.buildingType.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.tokenId - a.tokenId;
        case 'oldest':
          return a.tokenId - b.tokenId;
        case 'rarity':
          const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
          return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        case 'type':
          return a.buildingType.localeCompare(b.buildingType);
        default:
          return 0;
      }
    });

  const rarityCount = blueprints.reduce((acc, blueprint) => {
    acc[blueprint.rarity] = (acc[blueprint.rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-digital-oasis">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Package className="w-8 h-8 mr-3 text-blue-500" />
                Blueprint Collection
              </h1>
              <p className="text-gray-600 mt-1">Manage your building blueprints and construction plans</p>
            </div>
            <div className="flex space-x-2">
              <Button leftIcon={<ShoppingBag />} variant="outline">
                Browse Marketplace
              </Button>
              <Button leftIcon={<Plus />} className="bg-blue-500 hover:bg-blue-600">
                Acquire Blueprint
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-game p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Blueprints</p>
                <p className="text-2xl font-bold text-gray-900">{blueprints.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-game p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Legendary</p>
                <p className="text-2xl font-bold text-yellow-600">{rarityCount.legendary || 0}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-game p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Epic</p>
                <p className="text-2xl font-bold text-purple-600">{rarityCount.epic || 0}</p>
              </div>
              <Star className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-game p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rare</p>
                <p className="text-2xl font-bold text-blue-600">{rarityCount.rare || 0}</p>
              </div>
              <Star className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-game p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ready to Use</p>
                <p className="text-2xl font-bold text-green-600">{blueprints.length}</p>
              </div>
              <Zap className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-game border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search blueprints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="farm">Farm</option>
                <option value="mine">Mine</option>
                <option value="factory">Factory</option>
                <option value="house">House</option>
                <option value="tower">Tower</option>
                <option value="portal">Portal</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="rarity">By Rarity</option>
                <option value="type">By Type</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                leftIcon={<Grid3X3 />}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                leftIcon={<List />}
              >
                List
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <BlueprintGallery
              blueprints={filteredBlueprints}
              viewMode={viewMode}
              onSelectBlueprint={setSelectedBlueprint}
              selectedBlueprintId={selectedBlueprint}
            />

            {filteredBlueprints.length === 0 && (
              <div className="bg-white rounded-lg shadow-game border border-gray-200 p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Blueprints Found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Start building by acquiring your first blueprint!'
                  }
                </p>
                <div className="flex justify-center space-x-2">
                  <Button leftIcon={<ShoppingBag />} variant="outline">
                    Browse Marketplace
                  </Button>
                  <Button leftIcon={<Plus />} className="bg-blue-500 hover:bg-blue-600">
                    Acquire Blueprint
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {selectedBlueprint ? (
              <BlueprintDetails 
                blueprintId={selectedBlueprint} 
                onClose={() => setSelectedBlueprint(null)}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-game border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-blue-500" />
                  Blueprint Details
                </h3>
                <p className="text-gray-600 text-sm">
                  Select a blueprint to view detailed information, resource requirements, and building options.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

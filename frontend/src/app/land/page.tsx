'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Grid3X3, 
  List, 
  Filter,
  Search,
  Plus,
  Building,
  TrendingUp,
  Eye,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LandGrid } from '@/components/game/LandGrid';
import { LandPlotCard } from '@/components/game/LandPlotCard';
import { LandDetails } from '@/components/game/LandDetails';
import { MapNavigation } from '@/components/game/MapNavigation';
import { MOCK_PLAYER_INVENTORY } from '@/lib/game-data';

type ViewMode = 'grid' | 'list' | 'map';
type FilterType = 'all' | 'grassland' | 'forest' | 'mountain' | 'desert' | 'water' | 'volcanic';

export default function LandPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLand, setSelectedLand] = useState<string | null>(null);

  const landPlots = MOCK_PLAYER_INVENTORY.landPlots;
  
  const filteredLands = landPlots.filter(land => {
    const matchesFilter = filter === 'all' || land.terrain === filter;
    const matchesSearch = searchTerm === '' || 
      land.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      land.terrain.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalValue = landPlots.reduce((sum, land) => sum + (land.size * 10), 0);
  const totalProduction = landPlots.reduce((sum, land) => sum + land.productivity, 0);

  return (
    <div className="min-h-screen bg-digital-oasis">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <MapPin className="w-8 h-8 mr-3 text-green-500" />
                Land Management
              </h1>
              <p className="text-gray-600 mt-1">Manage your virtual land plots and buildings</p>
            </div>
            <Button leftIcon={<Plus />} className="bg-green-500 hover:bg-green-600">
              Acquire Land
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-game p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Plots</p>
                <p className="text-2xl font-bold text-gray-900">{landPlots.length}</p>
              </div>
              <MapPin className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-game p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Buildings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {landPlots.reduce((sum, land) => sum + land.buildings.length, 0)}
                </p>
              </div>
              <Building className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-game p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Estimated Value</p>
                <p className="text-2xl font-bold text-gray-900">{totalValue} STX</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-game p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Productivity</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(totalProduction / landPlots.length)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-game border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search and Filter */}
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search land plots..."
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
                <option value="all">All Terrains</option>
                <option value="grassland">Grassland</option>
                <option value="forest">Forest</option>
                <option value="mountain">Mountain</option>
                <option value="desert">Desert</option>
                <option value="water">Water</option>
                <option value="volcanic">Volcanic</option>
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
              <Button
                variant={viewMode === 'map' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                leftIcon={<MapPin />}
              >
                Map
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {viewMode === 'map' ? (
              <div className="bg-white rounded-lg shadow-game border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Land Map View</h3>
                  <MapNavigation />
                </div>
                <LandGrid 
                  viewSettings={{
                    zoom: 1,
                    centerX: 0,
                    centerY: 0,
                    showGrid: true,
                    showCoordinates: true,
                    viewMode: 'ownership'
                  }}
                  onPan={() => {}}
                  ownedLand={filteredLands}
                />
              </div>
            ) : (
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredLands.map((land) => (
                  <LandPlotCard
                    key={land.id}
                    land={land}
                    viewMode={viewMode}
                    onSelect={() => setSelectedLand(land.id)}
                    isSelected={selectedLand === land.id}
                  />
                ))}
              </div>
            )}

            {filteredLands.length === 0 && (
              <div className="bg-white rounded-lg shadow-game border border-gray-200 p-12 text-center">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Land Plots Found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Start your journey by acquiring your first land plot!'
                  }
                </p>
                <Button leftIcon={<Plus />} className="bg-green-500 hover:bg-green-600">
                  Acquire Land
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {selectedLand ? (
              <LandDetails 
                landId={selectedLand} 
                onClose={() => setSelectedLand(null)}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-game border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-blue-500" />
                  Land Details
                </h3>
                <p className="text-gray-600 text-sm">
                  Select a land plot to view detailed information, manage buildings, and track productivity.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

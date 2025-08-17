'use client';

import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Grid3X3,
  Eye,
  EyeOff,
  Layers,
  Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MapNavigationProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;
  onToggleGrid?: () => void;
  onToggleCoordinates?: () => void;
  onViewModeChange?: (mode: 'terrain' | 'ownership' | 'buildings') => void;
  showGrid?: boolean;
  showCoordinates?: boolean;
  viewMode?: 'terrain' | 'ownership' | 'buildings';
  zoomLevel?: number;
}

export function MapNavigation({
  onZoomIn = () => {},
  onZoomOut = () => {},
  onReset = () => {},
  onToggleGrid = () => {},
  onToggleCoordinates = () => {},
  onViewModeChange = () => {},
  showGrid = true,
  showCoordinates = true,
  viewMode = 'terrain',
  zoomLevel = 100
}: MapNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const viewModes = [
    { id: 'terrain', name: 'Terrain', icon: <Layers className="w-4 h-4" /> },
    { id: 'ownership', name: 'Ownership', icon: <Navigation className="w-4 h-4" /> },
    { id: 'buildings', name: 'Buildings', icon: <Grid3X3 className="w-4 h-4" /> }
  ];

  return (
    <div className="flex flex-col space-y-2">
      {/* Main Controls */}
      <div className="flex items-center space-x-2">
        {/* Zoom Controls */}
        <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomIn}
            className="rounded-none border-r border-gray-300"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <div className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 min-w-[60px] text-center">
            {Math.round(zoomLevel)}%
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomOut}
            className="rounded-none border-l border-gray-300"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          leftIcon={<RotateCcw />}
          title="Reset View"
        >
          Reset
        </Button>

        {/* Expand/Collapse Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? "Hide Controls" : "Show More Controls"}
        >
          {isExpanded ? "Less" : "More"}
        </Button>
      </div>

      {/* Expanded Controls */}
      {isExpanded && (
        <div className="space-y-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* View Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              View Mode
            </label>
            <div className="flex space-x-1">
              {viewModes.map((mode) => (
                <Button
                  key={mode.id}
                  variant={viewMode === mode.id ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => onViewModeChange(mode.id as any)}
                  leftIcon={mode.icon}
                  className="flex-1"
                >
                  {mode.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Display Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={onToggleGrid}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Grid3X3 className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Show Grid</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCoordinates}
                  onChange={onToggleCoordinates}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {showCoordinates ? (
                  <Eye className="w-4 h-4 text-gray-500" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-500" />
                )}
                <span className="text-sm text-gray-700">Show Coordinates</span>
              </label>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Actions
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" fullWidth>
                Center on Lands
              </Button>
              <Button variant="outline" size="sm" fullWidth>
                Find Empty Plots
              </Button>
            </div>
          </div>

          {/* Map Legend */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terrain Legend
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded"></div>
                <span>Grassland</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-600 rounded"></div>
                <span>Forest</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-600 rounded"></div>
                <span>Mountain</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-400 rounded"></div>
                <span>Desert</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded"></div>
                <span>Water</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Volcanic</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { BlueprintCard } from './BlueprintCard';
import { Blueprint } from '@/lib/game-data';

interface BlueprintGalleryProps {
  blueprints: Blueprint[];
  viewMode: 'grid' | 'list';
  onSelectBlueprint: (blueprintId: string) => void;
  selectedBlueprintId: string | null;
}

export function BlueprintGallery({ 
  blueprints, 
  viewMode, 
  onSelectBlueprint, 
  selectedBlueprintId 
}: BlueprintGalleryProps) {
  return (
    <div className={`grid gap-4 ${
      viewMode === 'grid' 
        ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
        : 'grid-cols-1'
    }`}>
      {blueprints.map((blueprint) => (
        <BlueprintCard
          key={blueprint.id}
          blueprint={blueprint}
          viewMode={viewMode}
          onSelect={() => onSelectBlueprint(blueprint.id)}
          isSelected={selectedBlueprintId === blueprint.id}
        />
      ))}
    </div>
  );
}

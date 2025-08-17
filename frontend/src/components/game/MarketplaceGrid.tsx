'use client';

import React from 'react';
import { NFTCard } from './NFTCard';

interface MarketplaceItem {
  id: string;
  type: 'land' | 'blueprint' | 'building' | 'resource';
  name: string;
  description: string;
  price: number;
  currency: 'STX';
  seller: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  image: string;
  likes: number;
  views: number;
  listedDate: Date;
  featured?: boolean;
}

interface MarketplaceGridProps {
  items: MarketplaceItem[];
  viewMode: 'grid' | 'list';
  onSelectItem: (itemId: string) => void;
  selectedItemId: string | null;
}

export function MarketplaceGrid({ 
  items, 
  viewMode, 
  onSelectItem, 
  selectedItemId 
}: MarketplaceGridProps) {
  return (
    <div className={`grid gap-4 ${
      viewMode === 'grid' 
        ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
        : 'grid-cols-1'
    }`}>
      {items.map((item) => (
        <NFTCard
          key={item.id}
          item={item}
          viewMode={viewMode}
          onSelect={() => onSelectItem(item.id)}
          isSelected={selectedItemId === item.id}
        />
      ))}
    </div>
  );
}

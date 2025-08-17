'use client';

import React from 'react';
import { 
  Heart, 
  Eye, 
  ShoppingCart,
  Star,
  Clock,
  User,
  MapPin,
  Package,
  Building,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

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

interface NFTCardProps {
  item: MarketplaceItem;
  viewMode: 'grid' | 'list';
  onSelect: () => void;
  isSelected: boolean;
}

export function NFTCard({ item, viewMode, onSelect, isSelected }: NFTCardProps) {
  const getTypeIcon = (type: MarketplaceItem['type']) => {
    switch (type) {
      case 'land':
        return <MapPin className="w-4 h-4 text-green-500" />;
      case 'blueprint':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'building':
        return <Building className="w-4 h-4 text-purple-500" />;
      case 'resource':
        return <Zap className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getRarityColor = (rarity: MarketplaceItem['rarity']) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-600 bg-gray-100 border-gray-300';
      case 'uncommon':
        return 'text-green-600 bg-green-100 border-green-300';
      case 'rare':
        return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'epic':
        return 'text-purple-600 bg-purple-100 border-purple-300';
      case 'legendary':
        return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    }
  };

  const getRarityGlow = (rarity: MarketplaceItem['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return 'shadow-lg shadow-yellow-200';
      case 'epic':
        return 'shadow-lg shadow-purple-200';
      case 'rare':
        return 'shadow-lg shadow-blue-200';
      default:
        return '';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  if (viewMode === 'list') {
    return (
      <div 
        className={`bg-white rounded-lg shadow-game border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
          isSelected ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200 hover:border-gray-300'
        } ${getRarityGlow(item.rarity)}`}
        onClick={onSelect}
      >
        <div className="p-4">
          <div className="flex items-center space-x-4">
            {/* Image */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                {getTypeIcon(item.type)}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                    {item.featured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1">{item.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{item.seller}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(item.listedDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 mb-2">
                    {item.price} {item.currency}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(item.rarity)}`}>
                    {item.rarity}
                  </span>
                </div>
              </div>

              {/* Stats and Actions */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{item.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{item.views}</span>
                  </div>
                </div>
                <Button size="sm" leftIcon={<ShoppingCart />}>
                  Buy Now
                </Button>
              </div>
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
        isSelected ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200 hover:border-gray-300'
      } ${getRarityGlow(item.rarity)}`}
      onClick={onSelect}
    >
      {/* Image */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-lg flex items-center justify-center">
          <div className="text-4xl">
            {getTypeIcon(item.type)}
          </div>
        </div>
        
        {/* Overlay badges */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(item.rarity)}`}>
            {item.rarity}
          </span>
        </div>
        
        {item.featured && (
          <div className="absolute top-2 right-2">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
          </div>
        )}

        {/* Quick actions */}
        <div className="absolute bottom-2 right-2 flex space-x-1">
          <button className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors">
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Type */}
        <div className="flex items-center space-x-2 mb-2">
          {getTypeIcon(item.type)}
          <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>

        {/* Price */}
        <div className="text-xl font-bold text-gray-900 mb-3">
          {item.price} {item.currency}
        </div>

        {/* Seller and Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span className="truncate">{item.seller}</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Heart className="w-3 h-3" />
              <span>{item.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{item.views}</span>
            </div>
          </div>
        </div>

        {/* Listed time */}
        <div className="text-xs text-gray-500 mb-3">
          Listed {formatTimeAgo(item.listedDate)}
        </div>

        {/* Action button */}
        <Button 
          variant="primary" 
          fullWidth 
          size="sm" 
          leftIcon={<ShoppingCart />}
          className="bg-purple-500 hover:bg-purple-600"
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}

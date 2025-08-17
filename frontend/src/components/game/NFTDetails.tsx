'use client';

import React from 'react';
import { 
  X, 
  Heart, 
  Share2,
  ShoppingCart,
  TrendingUp,
  Clock,
  User,
  Star,
  Eye,
  Flag,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Mock data - in real app this would come from API
const mockItemDetails = {
  '1': {
    id: '1',
    name: 'Volcanic Peak Plot',
    description: 'A rare volcanic terrain plot with exceptional mineral deposits and geothermal energy potential. This unique land features active volcanic activity that provides natural heating and rare resource generation capabilities.',
    price: 150,
    currency: 'STX',
    seller: 'ST1ABC...DEF',
    sellerReputation: 4.8,
    rarity: 'rare',
    type: 'land',
    likes: 24,
    views: 156,
    listedDate: new Date('2024-01-10'),
    attributes: [
      { trait: 'Terrain Type', value: 'Volcanic' },
      { trait: 'Size', value: '100 units' },
      { trait: 'Resource Bonus', value: '+40% Minerals' },
      { trait: 'Special Feature', value: 'Geothermal Vents' }
    ],
    priceHistory: [
      { date: '2024-01-01', price: 120 },
      { date: '2024-01-05', price: 135 },
      { date: '2024-01-10', price: 150 }
    ],
    featured: true
  }
};

interface NFTDetailsProps {
  itemId: string;
  onClose: () => void;
}

export function NFTDetails({ itemId, onClose }: NFTDetailsProps) {
  const item = mockItemDetails[itemId as keyof typeof mockItemDetails];
  
  if (!item) {
    return (
      <div className="bg-white rounded-lg shadow-game border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <Eye className="w-12 h-12 mx-auto mb-2" />
          <p>Item not found</p>
        </div>
      </div>
    );
  }

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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-game border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Item Details</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Image */}
        <div className="relative">
          <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
            <div className="text-white text-4xl">🌋</div>
          </div>
          {item.featured && (
            <div className="absolute top-2 right-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
            </div>
          )}
        </div>

        {/* Title and Rarity */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border capitalize ${getRarityColor(item.rarity)}`}>
            {item.rarity}
          </span>
        </div>

        {/* Price */}
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="text-sm text-purple-600 mb-1">Current Price</div>
          <div className="text-2xl font-bold text-purple-900">
            {item.price} {item.currency}
          </div>
        </div>

        {/* Description */}
        <div>
          <h5 className="font-medium text-gray-900 mb-2">Description</h5>
          <p className="text-sm text-gray-600">{item.description}</p>
        </div>

        {/* Attributes */}
        <div>
          <h5 className="font-medium text-gray-900 mb-2">Attributes</h5>
          <div className="space-y-2">
            {item.attributes.map((attr, index) => (
              <div key={index} className="flex justify-between bg-gray-50 rounded p-2">
                <span className="text-sm text-gray-600">{attr.trait}</span>
                <span className="text-sm font-medium text-gray-900">{attr.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Seller Info */}
        <div>
          <h5 className="font-medium text-gray-900 mb-2">Seller</h5>
          <div className="flex items-center justify-between bg-gray-50 rounded p-3">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">{item.seller}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-xs text-gray-600">{item.sellerReputation}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div>
          <h5 className="font-medium text-gray-900 mb-2">Statistics</h5>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-50 rounded p-2 text-center">
              <Heart className="w-4 h-4 mx-auto mb-1 text-red-500" />
              <div className="font-medium">{item.likes}</div>
              <div className="text-xs text-gray-600">Likes</div>
            </div>
            <div className="bg-gray-50 rounded p-2 text-center">
              <Eye className="w-4 h-4 mx-auto mb-1 text-blue-500" />
              <div className="font-medium">{item.views}</div>
              <div className="text-xs text-gray-600">Views</div>
            </div>
          </div>
        </div>

        {/* Price History */}
        <div>
          <h5 className="font-medium text-gray-900 mb-2 flex items-center">
            <BarChart3 className="w-4 h-4 mr-1" />
            Price History
          </h5>
          <div className="space-y-1">
            {item.priceHistory.map((entry, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{formatDate(new Date(entry.date))}</span>
                <span className="font-medium">{entry.price} STX</span>
              </div>
            ))}
          </div>
        </div>

        {/* Listed Date */}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Listed {formatDate(item.listedDate)}</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button 
            variant="primary" 
            fullWidth 
            leftIcon={<ShoppingCart />}
            className="bg-purple-500 hover:bg-purple-600"
          >
            Buy Now
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" fullWidth leftIcon={<Heart />}>
              Like
            </Button>
            <Button variant="outline" fullWidth leftIcon={<Share2 />}>
              Share
            </Button>
          </div>
          <Button variant="outline" fullWidth leftIcon={<Flag />} className="text-red-600 border-red-300 hover:bg-red-50">
            Report
          </Button>
        </div>

        {/* Market Insights */}
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <h6 className="font-medium text-blue-900 mb-2">💡 Market Insights</h6>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Price increased 25% in the last week</li>
            <li>• Similar items average 140 STX</li>
            <li>• High demand for volcanic terrain</li>
            <li>• Seller has 98% positive feedback</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

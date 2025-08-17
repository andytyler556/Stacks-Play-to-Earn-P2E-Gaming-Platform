'use client';

import React from 'react';
import { 
  Zap, 
  TrendingUp, 
  Star, 
  Shield,
  Gift,
  Users,
  Clock,
  Crown,
  Sparkles,
  Target,
  BarChart3,
  Headphones
} from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  tier: 'basic' | 'pro' | 'elite';
  category: 'gameplay' | 'social' | 'exclusive' | 'support';
}

const features: Feature[] = [
  // Gameplay Features
  {
    icon: <Zap className="w-6 h-6 text-blue-500" />,
    title: 'Faster Construction',
    description: 'Build structures 25-75% faster depending on your tier',
    tier: 'basic',
    category: 'gameplay'
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-green-500" />,
    title: 'Resource Production Boost',
    description: 'Increase resource generation by 20-60% across all buildings',
    tier: 'basic',
    category: 'gameplay'
  },
  {
    icon: <Star className="w-6 h-6 text-purple-500" />,
    title: 'Premium Blueprints',
    description: 'Access exclusive building designs with unique properties',
    tier: 'basic',
    category: 'exclusive'
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
    title: 'Advanced Analytics',
    description: 'Detailed performance metrics and optimization suggestions',
    tier: 'pro',
    category: 'gameplay'
  },
  {
    icon: <Target className="w-6 h-6 text-red-500" />,
    title: 'Custom Land Designs',
    description: 'Create personalized terrain layouts and themes',
    tier: 'pro',
    category: 'exclusive'
  },
  
  // Social Features
  {
    icon: <Users className="w-6 h-6 text-orange-500" />,
    title: 'VIP Community Access',
    description: 'Exclusive Discord channels and community events',
    tier: 'basic',
    category: 'social'
  },
  {
    icon: <Crown className="w-6 h-6 text-yellow-500" />,
    title: 'Elite Tournaments',
    description: 'Participate in premium-only competitions with bigger rewards',
    tier: 'elite',
    category: 'social'
  },
  
  // Exclusive Features
  {
    icon: <Gift className="w-6 h-6 text-pink-500" />,
    title: 'Regular NFT Drops',
    description: 'Monthly to daily exclusive NFT airdrops based on tier',
    tier: 'basic',
    category: 'exclusive'
  },
  {
    icon: <Sparkles className="w-6 h-6 text-indigo-500" />,
    title: 'Early Access',
    description: 'Beta test new features before public release',
    tier: 'pro',
    category: 'exclusive'
  },
  {
    icon: <Clock className="w-6 h-6 text-gray-500" />,
    title: 'Revenue Sharing',
    description: 'Earn a percentage of platform revenue as an elite member',
    tier: 'elite',
    category: 'exclusive'
  },
  
  // Support Features
  {
    icon: <Headphones className="w-6 h-6 text-blue-400" />,
    title: 'Priority Support',
    description: 'Fast-track customer service and technical assistance',
    tier: 'basic',
    category: 'support'
  },
  {
    icon: <Shield className="w-6 h-6 text-green-600" />,
    title: 'Personal Account Manager',
    description: 'Dedicated support representative for elite members',
    tier: 'elite',
    category: 'support'
  }
];

export function PremiumFeatures() {
  const categories = [
    { id: 'gameplay', name: 'Gameplay Enhancements', color: 'bg-blue-50 border-blue-200' },
    { id: 'social', name: 'Social & Community', color: 'bg-purple-50 border-purple-200' },
    { id: 'exclusive', name: 'Exclusive Content', color: 'bg-yellow-50 border-yellow-200' },
    { id: 'support', name: 'Support & Service', color: 'bg-green-50 border-green-200' }
  ];

  const getTierBadge = (tier: Feature['tier']) => {
    switch (tier) {
      case 'basic':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Basic+</span>;
      case 'pro':
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Master+</span>;
      case 'elite':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Elite Only</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Premium Features Overview
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover all the exclusive benefits and enhancements available to premium members. 
          Each tier unlocks progressively more powerful features.
        </p>
      </div>

      {/* Features by Category */}
      {categories.map((category) => {
        const categoryFeatures = features.filter(f => f.category === category.id);
        
        return (
          <div key={category.id} className={`rounded-xl p-6 border ${category.color}`}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {category.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                        {getTierBadge(feature.tier)}
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Feature Comparison Table */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Tier Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 font-medium text-gray-900">Feature</th>
                <th className="text-center py-3 font-medium text-gray-900">Free</th>
                <th className="text-center py-3 font-medium text-blue-600">Basic Builder</th>
                <th className="text-center py-3 font-medium text-purple-600">Master Creator</th>
                <th className="text-center py-3 font-medium text-yellow-600">Elite Empire</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 text-gray-600">Construction Speed</td>
                <td className="text-center py-3">Normal</td>
                <td className="text-center py-3 text-blue-600">+25%</td>
                <td className="text-center py-3 text-purple-600">+50%</td>
                <td className="text-center py-3 text-yellow-600">+75%</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-600">Resource Production</td>
                <td className="text-center py-3">Normal</td>
                <td className="text-center py-3 text-blue-600">+20%</td>
                <td className="text-center py-3 text-purple-600">+40%</td>
                <td className="text-center py-3 text-yellow-600">+60%</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-600">Premium Blueprints</td>
                <td className="text-center py-3">❌</td>
                <td className="text-center py-3 text-blue-600">Basic</td>
                <td className="text-center py-3 text-purple-600">All</td>
                <td className="text-center py-3 text-yellow-600">Legendary</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-600">NFT Drops</td>
                <td className="text-center py-3">❌</td>
                <td className="text-center py-3 text-blue-600">Monthly</td>
                <td className="text-center py-3 text-purple-600">Weekly</td>
                <td className="text-center py-3 text-yellow-600">Daily</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-600">Analytics Dashboard</td>
                <td className="text-center py-3">Basic</td>
                <td className="text-center py-3">Basic</td>
                <td className="text-center py-3 text-purple-600">Advanced</td>
                <td className="text-center py-3 text-yellow-600">Advanced</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-600">Priority Support</td>
                <td className="text-center py-3">❌</td>
                <td className="text-center py-3 text-blue-600">✓</td>
                <td className="text-center py-3 text-purple-600">✓</td>
                <td className="text-center py-3 text-yellow-600">Personal Manager</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-600">Revenue Sharing</td>
                <td className="text-center py-3">❌</td>
                <td className="text-center py-3">❌</td>
                <td className="text-center py-3">❌</td>
                <td className="text-center py-3 text-yellow-600">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Benefits Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          Why Premium Members Love Our Platform
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">2.5x</div>
            <div className="text-sm text-gray-600">Faster progression than free players</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">$1,200+</div>
            <div className="text-sm text-gray-600">Average additional earnings per month</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-600 mb-2">95%</div>
            <div className="text-sm text-gray-600">Member satisfaction rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}

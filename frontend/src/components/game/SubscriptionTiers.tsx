'use client';

import React from 'react';
import { 
  Crown, 
  Star, 
  Zap, 
  Check,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  popular?: boolean;
  features: string[];
  icon: React.ReactNode;
  color: string;
  savings?: string;
}

interface SubscriptionTiersProps {
  onSelectTier: (tierId: string) => void;
  selectedTier: string | null;
}

const tiers: SubscriptionTier[] = [
  {
    id: 'basic',
    name: 'Basic Builder',
    price: 10,
    period: 'month',
    icon: <Star className="w-6 h-6" />,
    color: 'from-blue-500 to-blue-600',
    features: [
      '25% faster construction',
      '20% resource bonus',
      'Priority customer support',
      'Access to basic premium blueprints',
      'Monthly exclusive NFT drop',
      'Discord premium channel access'
    ]
  },
  {
    id: 'pro',
    name: 'Master Creator',
    price: 25,
    period: 'month',
    popular: true,
    icon: <Crown className="w-6 h-6" />,
    color: 'from-purple-500 to-purple-600',
    features: [
      'Everything in Basic Builder',
      '50% faster construction',
      '40% resource bonus',
      'Access to all premium blueprints',
      'Weekly exclusive NFT drops',
      'Early access to new features',
      'Custom land plot designs',
      'Advanced analytics dashboard',
      'VIP event invitations'
    ]
  },
  {
    id: 'elite',
    name: 'Elite Empire',
    price: 50,
    period: 'month',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'from-yellow-500 to-orange-500',
    features: [
      'Everything in Master Creator',
      '75% faster construction',
      '60% resource bonus',
      'Legendary blueprint access',
      'Daily exclusive NFT drops',
      'Beta feature testing',
      'Personal account manager',
      'Custom building animations',
      'Exclusive elite tournaments',
      'Revenue sharing program'
    ]
  }
];

const yearlyTiers: SubscriptionTier[] = tiers.map(tier => ({
  ...tier,
  id: `${tier.id}-yearly`,
  price: Math.round(tier.price * 12 * 0.8), // 20% discount
  period: 'year',
  savings: '20% off'
}));

export function SubscriptionTiers({ onSelectTier, selectedTier }: SubscriptionTiersProps) {
  const [billingPeriod, setBillingPeriod] = React.useState<'monthly' | 'yearly'>('monthly');
  
  const currentTiers = billingPeriod === 'monthly' ? tiers : yearlyTiers;

  return (
    <div>
      {/* Billing Period Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingPeriod === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
              billingPeriod === 'yearly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Subscription Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentTiers.map((tier) => (
          <div
            key={tier.id}
            className={`relative bg-white rounded-xl shadow-lg border-2 transition-all duration-200 ${
              selectedTier === tier.id
                ? 'border-purple-500 ring-2 ring-purple-200 scale-105'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
            } ${tier.popular ? 'ring-2 ring-purple-200' : ''}`}
          >
            {/* Popular Badge */}
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            {/* Savings Badge */}
            {tier.savings && (
              <div className="absolute -top-2 -right-2">
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {tier.savings}
                </span>
              </div>
            )}

            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <div className={`w-12 h-12 bg-gradient-to-r ${tier.color} rounded-lg flex items-center justify-center text-white mx-auto mb-4`}>
                  {tier.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl font-bold text-gray-900">${tier.price}</span>
                  <span className="text-gray-600 ml-1">/{tier.period}</span>
                </div>
                {billingPeriod === 'yearly' && (
                  <p className="text-sm text-green-600 mt-1">
                    ${Math.round(tier.price / 12)}/month billed annually
                  </p>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                variant={tier.popular ? 'primary' : 'outline'}
                fullWidth
                onClick={() => onSelectTier(tier.id)}
                className={tier.popular ? `bg-gradient-to-r ${tier.color} hover:opacity-90` : ''}
                leftIcon={<Crown />}
              >
                {selectedTier === tier.id ? 'Selected' : 'Choose Plan'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Comparison */}
      <div className="mt-12 bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Feature Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium text-gray-900">Feature</th>
                <th className="text-center py-2 font-medium text-gray-900">Basic</th>
                <th className="text-center py-2 font-medium text-gray-900">Master</th>
                <th className="text-center py-2 font-medium text-gray-900">Elite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-2 text-gray-600">Construction Speed Bonus</td>
                <td className="text-center py-2">25%</td>
                <td className="text-center py-2">50%</td>
                <td className="text-center py-2">75%</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-600">Resource Production Bonus</td>
                <td className="text-center py-2">20%</td>
                <td className="text-center py-2">40%</td>
                <td className="text-center py-2">60%</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-600">Premium Blueprint Access</td>
                <td className="text-center py-2">Basic</td>
                <td className="text-center py-2">All</td>
                <td className="text-center py-2">Legendary</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-600">NFT Drops</td>
                <td className="text-center py-2">Monthly</td>
                <td className="text-center py-2">Weekly</td>
                <td className="text-center py-2">Daily</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-600">Personal Account Manager</td>
                <td className="text-center py-2">-</td>
                <td className="text-center py-2">-</td>
                <td className="text-center py-2">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

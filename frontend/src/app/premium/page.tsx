'use client';

import React, { useState } from 'react';
import { 
  Crown, 
  Star, 
  Zap, 
  Shield,
  Gift,
  TrendingUp,
  Users,
  Clock,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SubscriptionTiers } from '@/components/game/SubscriptionTiers';
import { PremiumFeatures } from '@/components/game/PremiumFeatures';
import { PurchaseFlow } from '@/components/game/PurchaseFlow';
import { PremiumStatus } from '@/components/game/PremiumStatus';

type TabType = 'subscriptions' | 'features' | 'status';

export default function PremiumPage() {
  const [activeTab, setActiveTab] = useState<TabType>('subscriptions');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const tabs = [
    { id: 'subscriptions', name: 'Subscription Plans', icon: <Crown className="w-4 h-4" /> },
    { id: 'features', name: 'Premium Features', icon: <Star className="w-4 h-4" /> },
    { id: 'status', name: 'My Subscription', icon: <Shield className="w-4 h-4" /> }
  ];

  const benefits = [
    {
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      title: 'Increased Resource Production',
      description: 'Get 50% more resources from all your buildings'
    },
    {
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      title: 'Faster Construction',
      description: 'Build structures 25% faster than standard players'
    },
    {
      icon: <Gift className="w-6 h-6 text-purple-500" />,
      title: 'Exclusive NFTs',
      description: 'Access to premium-only blueprint and land collections'
    },
    {
      icon: <Users className="w-6 h-6 text-orange-500" />,
      title: 'Priority Support',
      description: 'Get priority customer support and early access to features'
    }
  ];

  return (
    <div className="min-h-screen bg-digital-oasis">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Crown className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Premium Membership
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unlock exclusive features, boost your gameplay, and get priority access to new content
            </p>
          </div>
        </div>

        {/* Benefits Overview */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-8 border border-yellow-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Go Premium?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-game border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'subscriptions' && (
              <div>
                <SubscriptionTiers 
                  onSelectTier={setSelectedTier}
                  selectedTier={selectedTier}
                />
                {selectedTier && (
                  <div className="mt-6">
                    <PurchaseFlow tierId={selectedTier} />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'features' && (
              <PremiumFeatures />
            )}

            {activeTab === 'status' && (
              <PremiumStatus />
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-game border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your current billing period.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                What happens to my premium NFTs if I cancel?
              </h3>
              <p className="text-gray-600">
                Any premium NFTs you've acquired during your subscription remain yours permanently. You'll only lose access to future premium-exclusive drops.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Are there any additional fees?
              </h3>
              <p className="text-gray-600">
                No hidden fees! The subscription price includes all premium features. You'll only pay blockchain transaction fees for NFT purchases and trades.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I upgrade or downgrade my plan?
              </h3>
              <p className="text-gray-600">
                Yes, you can change your subscription tier at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-8 text-center text-white mt-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Unlock Premium?
          </h2>
          <p className="text-xl text-yellow-100 mb-6 max-w-2xl mx-auto">
            Join thousands of premium players and take your gaming experience to the next level.
          </p>
          <Button
            size="lg"
            onClick={() => setActiveTab('subscriptions')}
            leftIcon={<Crown />}
            className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
          >
            Choose Your Plan
          </Button>
        </div>
      </div>
    </div>
  );
}

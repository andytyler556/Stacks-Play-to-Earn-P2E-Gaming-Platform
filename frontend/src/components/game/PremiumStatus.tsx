'use client';

import React, { useState } from 'react';
import { 
  Crown, 
  Calendar, 
  CreditCard,
  Settings,
  TrendingUp,
  Gift,
  Star,
  AlertCircle,
  Check,
  X,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Subscription {
  tier: 'basic' | 'pro' | 'elite';
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethod: 'stx' | 'card';
}

// Mock subscription data - in real app this would come from API
const mockSubscription: Subscription = {
  tier: 'pro',
  status: 'active',
  startDate: new Date('2024-01-15'),
  endDate: new Date('2024-02-15'),
  autoRenew: true,
  paymentMethod: 'stx'
};

const tierDetails = {
  basic: { name: 'Basic Builder', color: 'blue', price: 10 },
  pro: { name: 'Master Creator', color: 'purple', price: 25 },
  elite: { name: 'Elite Empire', color: 'yellow', price: 50 }
};

export function PremiumStatus() {
  const [subscription] = useState<Subscription | null>(mockSubscription);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = () => {
    if (!subscription) return 0;
    const now = new Date();
    const diff = subscription.endDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (status: Subscription['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-orange-600 bg-orange-100';
      case 'expired': return 'text-red-600 bg-red-100';
    }
  };

  const getTierColor = (tier: Subscription['tier']) => {
    const colors = {
      basic: 'from-blue-500 to-blue-600',
      pro: 'from-purple-500 to-purple-600',
      elite: 'from-yellow-500 to-orange-500'
    };
    return colors[tier];
  };

  if (!subscription) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <Crown className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Active Subscription
          </h3>
          <p className="text-gray-600 mb-4">
            You're currently using the free tier. Upgrade to unlock premium features!
          </p>
          <Button leftIcon={<Crown />} className="bg-gradient-to-r from-purple-500 to-purple-600">
            Upgrade to Premium
          </Button>
        </div>
      </div>
    );
  }

  const tier = tierDetails[subscription.tier];
  const daysRemaining = getDaysRemaining();

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <div className={`bg-gradient-to-r ${getTierColor(subscription.tier)} rounded-xl p-6 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Crown className="w-8 h-8" />
            <div>
              <h3 className="text-xl font-bold">{tier.name}</h3>
              <p className="text-white/80">Premium Member</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white/20 capitalize`}>
            {subscription.status}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-white/80">Next Billing</div>
            <div className="font-medium">{formatDate(subscription.endDate)}</div>
          </div>
          <div>
            <div className="text-white/80">Days Remaining</div>
            <div className="font-medium">{daysRemaining} days</div>
          </div>
        </div>
      </div>

      {/* Subscription Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Subscription Details</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Plan</span>
            <span className="font-medium">{tier.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Price</span>
            <span className="font-medium">${tier.price}/month</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Started</span>
            <span className="font-medium">{formatDate(subscription.startDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Next Billing</span>
            <span className="font-medium">{formatDate(subscription.endDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Auto Renewal</span>
            <span className={`font-medium ${subscription.autoRenew ? 'text-green-600' : 'text-red-600'}`}>
              {subscription.autoRenew ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method</span>
            <span className="font-medium capitalize">
              {subscription.paymentMethod === 'stx' ? 'STX Wallet' : 'Credit Card'}
            </span>
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Premium Benefits Used</h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Construction Speed Bonus</span>
              <span className="font-medium">+50% (247 builds)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Resource Production Bonus</span>
              <span className="font-medium">+40% (12,450 resources)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Premium NFTs Claimed</span>
              <span className="font-medium">8/12 this month</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '67%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Premium Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Recent Premium Activity</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Gift className="w-5 h-5 text-purple-500" />
            <div className="flex-1">
              <div className="text-sm font-medium">Claimed weekly NFT drop</div>
              <div className="text-xs text-gray-500">2 days ago</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <div className="flex-1">
              <div className="text-sm font-medium">Used fast construction (5 buildings)</div>
              <div className="text-xs text-gray-500">3 days ago</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Star className="w-5 h-5 text-blue-500" />
            <div className="flex-1">
              <div className="text-sm font-medium">Accessed premium blueprint</div>
              <div className="text-xs text-gray-500">1 week ago</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button variant="outline" fullWidth leftIcon={<Settings />}>
          Manage Subscription
        </Button>
        <Button variant="outline" fullWidth leftIcon={<Download />}>
          Download Invoice
        </Button>
        <Button 
          variant="outline" 
          fullWidth 
          leftIcon={<X />}
          onClick={() => setShowCancelModal(true)}
          className="text-red-600 border-red-300 hover:bg-red-50"
        >
          Cancel Subscription
        </Button>
      </div>

      {/* Renewal Warning */}
      {daysRemaining <= 7 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <div className="font-medium text-yellow-900">Renewal Reminder</div>
              <div className="text-sm text-yellow-800">
                Your subscription renews in {daysRemaining} days. 
                {!subscription.autoRenew && ' Please update your payment method.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cancel Subscription?
            </h3>
            <p className="text-gray-600 mb-6">
              You'll lose access to premium features at the end of your current billing period. 
              Your subscription will remain active until {formatDate(subscription.endDate)}.
            </p>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                fullWidth 
                onClick={() => setShowCancelModal(false)}
              >
                Keep Subscription
              </Button>
              <Button 
                variant="primary" 
                fullWidth 
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  // Handle cancellation
                  setShowCancelModal(false);
                }}
              >
                Cancel Subscription
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

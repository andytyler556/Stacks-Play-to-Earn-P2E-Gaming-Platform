'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  Shield, 
  Check,
  AlertCircle,
  Loader2,
  Crown,
  ArrowRight,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useWallet } from '@/components/providers/WalletProvider';

interface PurchaseFlowProps {
  tierId: string;
}

type Step = 'review' | 'payment' | 'processing' | 'success' | 'error';

export function PurchaseFlow({ tierId }: PurchaseFlowProps) {
  const [currentStep, setCurrentStep] = useState<Step>('review');
  const [paymentMethod, setPaymentMethod] = useState<'stx' | 'card'>('stx');
  const { isConnected, address } = useWallet();

  const tierDetails = {
    'basic': { name: 'Basic Builder', price: 10, period: 'month' },
    'basic-yearly': { name: 'Basic Builder', price: 96, period: 'year', savings: '20% off' },
    'pro': { name: 'Master Creator', price: 25, period: 'month' },
    'pro-yearly': { name: 'Master Creator', price: 240, period: 'year', savings: '20% off' },
    'elite': { name: 'Elite Empire', price: 50, period: 'month' },
    'elite-yearly': { name: 'Elite Empire', price: 480, period: 'year', savings: '20% off' }
  };

  const tier = tierDetails[tierId as keyof typeof tierDetails];

  const handlePurchase = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    setCurrentStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      if (Math.random() > 0.1) { // 90% success rate
        setCurrentStep('success');
      } else {
        setCurrentStep('error');
      }
    }, 3000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'review':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{tier?.name} Subscription</span>
                  <span className="font-medium">${tier?.price}/{tier?.period}</span>
                </div>
                {tier?.savings && (
                  <div className="flex justify-between text-green-600">
                    <span>Savings</span>
                    <span className="font-medium">{tier.savings}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${tier?.price}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Payment Method</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="stx"
                    checked={paymentMethod === 'stx'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'stx')}
                    className="text-purple-600"
                  />
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      S
                    </div>
                    <div>
                      <div className="font-medium">Pay with STX</div>
                      <div className="text-sm text-gray-600">Use your Stacks wallet</div>
                    </div>
                  </div>
                </label>
                <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                    className="text-purple-600"
                  />
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                    <div>
                      <div className="font-medium">Credit/Debit Card</div>
                      <div className="text-sm text-gray-600">Visa, Mastercard, etc.</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {!isConnected && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    Please connect your wallet to continue with the purchase.
                  </span>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Secure Payment</span>
              </div>
              <p className="text-sm text-blue-800">
                Your payment is secured by blockchain technology and industry-standard encryption.
              </p>
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={handlePurchase}
              disabled={!isConnected}
              leftIcon={<Crown />}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              {isConnected ? 'Complete Purchase' : 'Connect Wallet First'}
            </Button>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Complete Payment
              </h3>
              <p className="text-gray-600">
                {paymentMethod === 'stx' 
                  ? 'Confirm the transaction in your Stacks wallet'
                  : 'Enter your payment details below'
                }
              </p>
            </div>

            {paymentMethod === 'stx' ? (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                    S
                  </div>
                  <p className="text-sm text-orange-800">
                    A transaction request has been sent to your Stacks wallet. 
                    Please confirm to complete your subscription.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'processing':
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Processing Payment
              </h3>
              <p className="text-gray-600">
                Please wait while we process your subscription...
              </p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Welcome to Premium!
              </h3>
              <p className="text-gray-600">
                Your {tier?.name} subscription is now active. Enjoy your premium benefits!
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">What's Next?</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Your premium benefits are now active</li>
                <li>• Check your dashboard for new features</li>
                <li>• Join the premium Discord channel</li>
                <li>• Start earning bonus resources immediately</li>
              </ul>
            </div>
            <Button
              variant="primary"
              fullWidth
              leftIcon={<ArrowRight />}
              onClick={() => window.location.href = '/dashboard'}
            >
              Go to Dashboard
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Payment Failed
              </h3>
              <p className="text-gray-600">
                There was an issue processing your payment. Please try again.
              </p>
            </div>
            <div className="space-y-2">
              <Button
                variant="primary"
                fullWidth
                onClick={() => setCurrentStep('review')}
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                fullWidth
              >
                Contact Support
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Subscribe to {tier?.name}
        </h2>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className={currentStep === 'review' ? 'text-purple-600 font-medium' : ''}>
            1. Review
          </span>
          <ArrowRight className="w-4 h-4" />
          <span className={currentStep === 'payment' ? 'text-purple-600 font-medium' : ''}>
            2. Payment
          </span>
          <ArrowRight className="w-4 h-4" />
          <span className={['processing', 'success', 'error'].includes(currentStep) ? 'text-purple-600 font-medium' : ''}>
            3. Complete
          </span>
        </div>
      </div>

      {renderStep()}
    </div>
  );
}

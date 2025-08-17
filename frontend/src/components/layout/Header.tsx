'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Wallet,
  LogOut,
  User,
  Coins,
  MapPin,
  Trophy,
  ShoppingBag,
  Home,
  Package,
  Calendar,
  Crown,
  Gamepad2
} from 'lucide-react';
import { useWallet } from '@/components/providers/WalletProvider';
import { useGameView } from '@/components/providers/GameProvider';
import { connectWallet, shortenAddress } from '@/lib/stacks';
import { WalletButton } from '@/components/ui/WalletButton';
import { Button } from '@/components/ui/Button';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'Player hub and overview' },
  { name: 'Land', href: '/land', icon: MapPin, description: 'Manage your land plots' },
  { name: 'Blueprints', href: '/blueprints', icon: Package, description: 'Building blueprints' },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag, description: 'Trade NFTs and assets' },
  { name: 'Events', href: '/events', icon: Calendar, description: 'Community competitions' },
  { name: 'Premium', href: '/premium', icon: Crown, description: 'Premium features' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isConnected, address, stxBalance, tokenBalance, disconnect } = useWallet();

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold text-gray-900">Virtual Lands</div>
                <div className="text-xs text-gray-500">Building Simulation</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleNavClick}
                  className={clsx(
                    'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'text-tech bg-blue-50 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                  title={item.description}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Wallet Section */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-4">
                {/* Balance Display */}
                <div className="hidden sm:flex items-center space-x-3 text-sm">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Coins className="w-4 h-4" />
                    <span>{stxBalance.toFixed(2)} STX</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <div className="w-4 h-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full" />
                    <span>{tokenBalance.toFixed(0)} P2E</span>
                  </div>
                </div>

                {/* User Menu */}
                <div className="relative group">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Wallet className="w-4 h-4" />
                    <span className="hidden sm:inline">{shortenAddress(address!)}</span>
                  </Button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                        <div className="font-medium text-gray-900">{shortenAddress(address!)}</div>
                        <div className="mt-1">
                          <div>{stxBalance.toFixed(6)} STX</div>
                          <div>{tokenBalance.toFixed(2)} P2E Tokens</div>
                        </div>
                      </div>
                      <button
                        onClick={disconnect}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Disconnect</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <WalletButton />
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleNavClick}
                  className={clsx(
                    'flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors',
                    isActive
                      ? 'text-tech bg-blue-50 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Link>
              );
            })}

            {/* Mobile Wallet Info */}
            {isConnected && (
              <div className="px-3 py-2 border-t border-gray-200 mt-2">
                <div className="text-sm text-gray-500">
                  <div className="font-medium text-gray-900 mb-1">{shortenAddress(address!)}</div>
                  <div className="flex justify-between">
                    <span>{stxBalance.toFixed(2)} STX</span>
                    <span>{tokenBalance.toFixed(0)} P2E</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

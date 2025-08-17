'use client';

import React, { useState } from 'react';
import { 
  Megaphone, 
  X, 
  Calendar, 
  Gift, 
  Zap,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Announcement {
  id: string;
  type: 'event' | 'update' | 'maintenance' | 'promotion';
  title: string;
  message: string;
  actionText?: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  expiresAt?: Date;
}

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    type: 'event',
    title: 'Summer Building Contest Live!',
    message: 'Join the community building contest and win exclusive NFT rewards. Contest ends in 5 days!',
    actionText: 'Join Contest',
    actionUrl: '/events',
    priority: 'high',
    expiresAt: new Date(Date.now() + 432000000) // 5 days
  },
  {
    id: '2',
    type: 'update',
    title: 'New Blueprint Types Available',
    message: 'Portal and Tower blueprints are now available in the marketplace with special launch pricing.',
    actionText: 'View Marketplace',
    actionUrl: '/marketplace',
    priority: 'medium'
  },
  {
    id: '3',
    type: 'promotion',
    title: 'Premium Membership 50% Off',
    message: 'Upgrade to Premium and get exclusive building bonuses, priority support, and early access to new features.',
    actionText: 'Upgrade Now',
    actionUrl: '/premium',
    priority: 'medium'
  }
];

export function AnnouncementBanner() {
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeAnnouncements = mockAnnouncements.filter(
    announcement => !dismissedAnnouncements.includes(announcement.id)
  );

  const dismissAnnouncement = (id: string) => {
    setDismissedAnnouncements(prev => [...prev, id]);
    if (currentIndex >= activeAnnouncements.length - 1) {
      setCurrentIndex(0);
    }
  };

  const nextAnnouncement = () => {
    setCurrentIndex((prev) => (prev + 1) % activeAnnouncements.length);
  };

  if (activeAnnouncements.length === 0) {
    return null;
  }

  const currentAnnouncement = activeAnnouncements[currentIndex];

  const getAnnouncementIcon = (type: Announcement['type']) => {
    switch (type) {
      case 'event':
        return <Calendar className="w-5 h-5 text-orange-600" />;
      case 'update':
        return <Zap className="w-5 h-5 text-blue-600" />;
      case 'maintenance':
        return <Megaphone className="w-5 h-5 text-red-600" />;
      case 'promotion':
        return <Gift className="w-5 h-5 text-purple-600" />;
      default:
        return <Megaphone className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAnnouncementColor = (priority: Announcement['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-to-r from-red-500 to-orange-500';
      case 'medium':
        return 'bg-gradient-to-r from-blue-500 to-purple-500';
      case 'low':
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
      default:
        return 'bg-gradient-to-r from-blue-500 to-purple-500';
    }
  };

  const formatTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h remaining`;
    return 'Ending soon';
  };

  return (
    <div className={`${getAnnouncementColor(currentAnnouncement.priority)} text-white relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            {/* Icon */}
            <div className="flex-shrink-0">
              {getAnnouncementIcon(currentAnnouncement.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <h3 className="text-sm font-semibold truncate">
                  {currentAnnouncement.title}
                </h3>
                {currentAnnouncement.expiresAt && (
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full whitespace-nowrap">
                    {formatTimeRemaining(currentAnnouncement.expiresAt)}
                  </span>
                )}
              </div>
              <p className="text-sm text-white/90 mt-1 hidden sm:block">
                {currentAnnouncement.message}
              </p>
            </div>

            {/* Action Button */}
            {currentAnnouncement.actionText && (
              <div className="flex-shrink-0 hidden md:block">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
                  rightIcon={<ExternalLink />}
                >
                  {currentAnnouncement.actionText}
                </Button>
              </div>
            )}
          </div>

          {/* Navigation and Controls */}
          <div className="flex items-center space-x-2 ml-4">
            {/* Multiple announcements indicator */}
            {activeAnnouncements.length > 1 && (
              <>
                <div className="hidden sm:flex items-center space-x-1">
                  {activeAnnouncements.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex ? 'bg-white' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextAnnouncement}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  title="Next announcement"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Dismiss Button */}
            <button
              onClick={() => dismissAnnouncement(currentAnnouncement.id)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              title="Dismiss announcement"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Action Button */}
        {currentAnnouncement.actionText && (
          <div className="mt-2 md:hidden">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
              rightIcon={<ExternalLink />}
              fullWidth
            >
              {currentAnnouncement.actionText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

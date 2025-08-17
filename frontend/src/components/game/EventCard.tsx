'use client';

import React from 'react';
import { 
  Calendar, 
  Users, 
  Trophy, 
  Clock,
  Star,
  Play,
  CheckCircle,
  AlertCircle,
  Coins,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CommunityEvent } from '@/lib/game-data';

interface EventCardProps {
  event: CommunityEvent;
  onSelect: () => void;
  isSelected: boolean;
}

export function EventCard({ event, onSelect, isSelected }: EventCardProps) {
  const getEventTypeIcon = (type: CommunityEvent['type']) => {
    switch (type) {
      case 'building_contest':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'resource_challenge':
        return <Target className="w-5 h-5 text-green-500" />;
      case 'exploration':
        return <Star className="w-5 h-5 text-blue-500" />;
      case 'pvp_tournament':
        return <Users className="w-5 h-5 text-red-500" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: CommunityEvent['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: CommunityEvent['status']) => {
    switch (status) {
      case 'active':
        return <Play className="w-3 h-3" />;
      case 'upcoming':
        return <Clock className="w-3 h-3" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const formatTimeRemaining = () => {
    const now = new Date();
    const targetDate = event.status === 'upcoming' ? event.startDate : event.endDate;
    const diff = targetDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return 'Soon';
  };

  const getParticipationPercentage = () => {
    return Math.round((event.participants / event.maxParticipants) * 100);
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-game border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
        isSelected ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            {getEventTypeIcon(event.type)}
            <h3 className="font-semibold text-gray-900 text-sm">{event.title}</h3>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(event.status)}`}>
            {getStatusIcon(event.status)}
            <span className="capitalize">{event.status}</span>
          </span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Event Type */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Type:</span>
          <span className="font-medium capitalize text-gray-900">
            {event.type.replace('_', ' ')}
          </span>
        </div>

        {/* Timing */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {event.status === 'upcoming' ? 'Starts in:' : 'Ends in:'}
          </span>
          <span className="font-medium text-gray-900">{formatTimeRemaining()}</span>
        </div>

        {/* Participants */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center">
              <Users className="w-3 h-3 mr-1" />
              Participants:
            </span>
            <span className="font-medium text-gray-900">
              {event.participants}/{event.maxParticipants}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${getParticipationPercentage()}%` }}
            />
          </div>
        </div>

        {/* Entry Fee */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center">
            <Coins className="w-3 h-3 mr-1" />
            Entry Fee:
          </span>
          <span className="font-medium text-gray-900">{event.entryFee} STX</span>
        </div>

        {/* Top Rewards */}
        <div className="bg-yellow-50 rounded p-2">
          <div className="text-xs text-yellow-800 mb-1 font-medium">🏆 Top Rewards:</div>
          <div className="space-y-1">
            {event.rewards.slice(0, 2).map((reward, index) => (
              <div key={index} className="flex justify-between text-xs text-yellow-700">
                <span>#{reward.position}:</span>
                <span className="font-medium">{reward.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        {event.requirements.length > 0 && (
          <div className="bg-blue-50 rounded p-2">
            <div className="text-xs text-blue-800 mb-1 font-medium">📋 Requirements:</div>
            <ul className="text-xs text-blue-700 space-y-1">
              {event.requirements.slice(0, 2).map((req, index) => (
                <li key={index}>• {req}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        {event.status === 'active' && (
          <Button variant="primary" size="sm" fullWidth leftIcon={<Play />}>
            Join Event
          </Button>
        )}
        {event.status === 'upcoming' && (
          <Button variant="outline" size="sm" fullWidth leftIcon={<Calendar />}>
            Set Reminder
          </Button>
        )}
        {event.status === 'completed' && (
          <Button variant="outline" size="sm" fullWidth leftIcon={<Trophy />}>
            View Results
          </Button>
        )}
      </div>
    </div>
  );
}

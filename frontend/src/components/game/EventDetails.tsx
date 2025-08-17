'use client';

import React from 'react';
import { 
  Calendar, 
  X, 
  Users, 
  Trophy, 
  Clock,
  Star,
  Play,
  Coins,
  Target,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { generateMockCommunityEvents } from '@/lib/game-data';

interface EventDetailsProps {
  eventId: string;
  onClose: () => void;
}

export function EventDetails({ eventId, onClose }: EventDetailsProps) {
  const events = generateMockCommunityEvents(12);
  const event = events.find(e => e.id === eventId);
  
  if (!event) {
    return (
      <div className="bg-white rounded-lg shadow-game border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-2" />
          <p>Event not found</p>
        </div>
      </div>
    );
  }

  const getEventTypeIcon = (type: typeof event.type) => {
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

  const getStatusColor = (status: typeof event.status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'upcoming':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getParticipationPercentage = () => {
    return Math.round((event.participants / event.maxParticipants) * 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-game border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className={`${getStatusColor(event.status)} p-4 text-white relative`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center space-x-3">
          {getEventTypeIcon(event.type)}
          <div>
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <p className="text-white/80 text-sm capitalize">
              {event.type.replace('_', ' ')}
            </p>
          </div>
        </div>
        <div className="mt-2">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/20 capitalize">
            {event.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Description */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
          <p className="text-sm text-gray-600">{event.description}</p>
        </div>

        {/* Event Schedule */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <Clock className="w-4 h-4 mr-2 text-blue-500" />
            Schedule
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Starts:</span>
              <span className="font-medium">{formatDate(event.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ends:</span>
              <span className="font-medium">{formatDate(event.endDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">
                {Math.ceil((event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
              </span>
            </div>
          </div>
        </div>

        {/* Participation */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <Users className="w-4 h-4 mr-2 text-purple-500" />
            Participation
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Participants:</span>
              <span className="font-medium">{event.participants}/{event.maxParticipants}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getParticipationPercentage()}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Entry Fee:</span>
              <span className="font-medium flex items-center">
                <Coins className="w-3 h-3 mr-1" />
                {event.entryFee} STX
              </span>
            </div>
          </div>
        </div>

        {/* Rewards */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
            Rewards
          </h4>
          <div className="space-y-2">
            {event.rewards.map((reward, index) => (
              <div key={index} className="flex items-center justify-between bg-yellow-50 rounded p-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {reward.position}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {reward.description}
                  </span>
                </div>
                {reward.type === 'tokens' && (
                  <span className="text-sm font-bold text-yellow-600">
                    {reward.amount}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            Requirements
          </h4>
          <div className="space-y-1">
            {event.requirements.map((req, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                <span className="text-gray-600">{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {event.status === 'active' && (
            <Button variant="primary" fullWidth leftIcon={<Play />}>
              Join Event Now
            </Button>
          )}
          {event.status === 'upcoming' && (
            <Button variant="outline" fullWidth leftIcon={<Calendar />}>
              Set Reminder
            </Button>
          )}
          {event.status === 'completed' && (
            <Button variant="outline" fullWidth leftIcon={<Trophy />}>
              View Results
            </Button>
          )}
          <Button variant="outline" fullWidth>
            Share Event
          </Button>
        </div>

        {/* Event Rules */}
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <h5 className="font-medium text-blue-800 mb-1 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Event Rules
          </h5>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Participants must meet all requirements before joining</li>
            <li>• Entry fees are non-refundable once the event starts</li>
            <li>• Fair play is enforced - cheating results in disqualification</li>
            <li>• Rewards are distributed within 24 hours of event completion</li>
            <li>• Event organizers reserve the right to modify rules if needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

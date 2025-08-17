'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Trophy, 
  Users, 
  Clock,
  Star,
  Gift,
  Filter,
  Search,
  Play,
  Medal,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EventsList } from '@/components/game/EventsList';
import { EventCard } from '@/components/game/EventCard';
import { EventDetails } from '@/components/game/EventDetails';
import { Leaderboard } from '@/components/game/Leaderboard';
import { generateMockCommunityEvents } from '@/lib/game-data';

type FilterType = 'all' | 'active' | 'upcoming' | 'completed';
type EventTypeFilter = 'all' | 'building_contest' | 'resource_challenge' | 'exploration' | 'pvp_tournament';

export default function EventsPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<EventTypeFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const events = generateMockCommunityEvents(12);
  
  const filteredEvents = events.filter(event => {
    const matchesStatus = filter === 'all' || event.status === filter;
    const matchesType = eventTypeFilter === 'all' || event.type === eventTypeFilter;
    const matchesSearch = searchTerm === '' || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const activeEvents = events.filter(e => e.status === 'active');
  const upcomingEvents = events.filter(e => e.status === 'upcoming');
  const totalParticipants = events.reduce((sum, e) => sum + e.participants, 0);
  const totalRewards = events.reduce((sum, e) => sum + e.entryFee * e.participants, 0);

  return (
    <div className="min-h-screen bg-digital-oasis">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Calendar className="w-8 h-8 mr-3 text-purple-500" />
                Community Events
              </h1>
              <p className="text-gray-600 mt-1">Compete, collaborate, and earn exclusive rewards</p>
            </div>
            <Button leftIcon={<Trophy />} className="bg-purple-500 hover:bg-purple-600">
              Create Event
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-game p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Events</p>
                <p className="text-2xl font-bold text-green-600">{activeEvents.length}</p>
              </div>
              <Play className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-game p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-blue-600">{upcomingEvents.length}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-game p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold text-purple-600">{totalParticipants}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-game p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prize Pool</p>
                <p className="text-2xl font-bold text-orange-600">{totalRewards} STX</p>
              </div>
              <Gift className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-game border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Events</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value as EventTypeFilter)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="building_contest">Building Contest</option>
                <option value="resource_challenge">Resource Challenge</option>
                <option value="exploration">Exploration</option>
                <option value="pvp_tournament">PvP Tournament</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <EventsList
              events={filteredEvents}
              onSelectEvent={setSelectedEvent}
              selectedEventId={selectedEvent}
            />

            {filteredEvents.length === 0 && (
              <div className="bg-white rounded-lg shadow-game border border-gray-200 p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filter !== 'all' || eventTypeFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No events are currently available. Check back later!'
                  }
                </p>
                <Button leftIcon={<Trophy />} className="bg-purple-500 hover:bg-purple-600">
                  Create Event
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {selectedEvent ? (
              <EventDetails 
                eventId={selectedEvent} 
                onClose={() => setSelectedEvent(null)}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-game border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-purple-500" />
                  Event Details
                </h3>
                <p className="text-gray-600 text-sm">
                  Select an event to view detailed information, rules, and participation options.
                </p>
              </div>
            )}

            {/* Leaderboard */}
            <div className="bg-white rounded-lg shadow-game border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Medal className="w-5 h-5 mr-2 text-yellow-500" />
                Top Participants
              </h3>
              <Leaderboard />
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-game border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-500" />
                Your Progress
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Events Joined</span>
                  <span className="font-medium">7</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rewards Earned</span>
                  <span className="font-medium">245 STX</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Best Rank</span>
                  <span className="font-medium">#3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Win Rate</span>
                  <span className="font-medium">42%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

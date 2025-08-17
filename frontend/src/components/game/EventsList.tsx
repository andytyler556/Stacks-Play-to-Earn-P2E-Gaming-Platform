'use client';

import React from 'react';
import { EventCard } from './EventCard';
import { CommunityEvent } from '@/lib/game-data';

interface EventsListProps {
  events: CommunityEvent[];
  onSelectEvent: (eventId: string) => void;
  selectedEventId: string | null;
}

export function EventsList({ events, onSelectEvent, selectedEventId }: EventsListProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onSelect={() => onSelectEvent(event.id)}
          isSelected={selectedEventId === event.id}
        />
      ))}
    </div>
  );
}

import type { Event } from '../types';
import { EventCard } from './EventCard';

interface TimelineCellProps {
  date: string;
  timeSlotId: string;
  events: Event[];
  isWeekend?: boolean;
  onCellClick: () => void;
  onEventClick: (event: Event) => void;
}

export const TimelineCell: React.FC<TimelineCellProps> = ({
  date: _date,
  timeSlotId: _timeSlotId,
  events,
  isWeekend = false,
  onCellClick,
  onEventClick,
}) => {
  return (
    <div 
      className={`min-h-[60px] border border-gray-200 p-0.5 transition-colors relative group cursor-pointer ${
        isWeekend ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-50 hover:bg-gray-100'
      }`}
      onClick={onCellClick}
    >
      {events.map(event => (
        <EventCard
          key={event.id}
          event={event}
          onClick={() => onEventClick(event)}
        />
      ))}
      
      {events.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span className="text-gray-400 text-sm">+</span>
        </div>
      )}
    </div>
  );
};
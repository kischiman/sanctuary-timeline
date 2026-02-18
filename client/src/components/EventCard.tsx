import type { Event } from '../types';

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  return (
    <div
      className="bg-white rounded-sm p-0.5 mb-0.5 shadow-sm border-l-2 cursor-pointer hover:shadow-md transition-shadow text-xs overflow-hidden"
      style={{ borderLeftColor: event.color }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <div className="flex items-center gap-0.5 mb-0.5">
        <div 
          className="w-1 h-1 rounded-full flex-shrink-0"
          style={{ backgroundColor: event.color }}
        />
        <span className="font-medium text-gray-700 text-xs truncate hidden sm:inline">
          {event.creator_name}
        </span>
      </div>
      <div className="font-semibold text-gray-900 leading-tight text-xs truncate">
        {event.title}
      </div>
      {event.location && (
        <div className="text-gray-500 text-xs mt-0.5 truncate hidden sm:block">
          📍 {event.location}
        </div>
      )}
    </div>
  );
};
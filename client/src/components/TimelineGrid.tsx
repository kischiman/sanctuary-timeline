import React, { useState, useEffect, useRef } from 'react';
import type { Event, TimeSlot } from '../types';
import { TimelineCell } from './TimelineCell';
import { EventModal } from './EventModal';
import { formatDateHeader, isToday, generateDateRange, getTodayDateString, isWeekend } from '../utils/dates';

interface TimelineGridProps {
  startDate: string;
  endDate: string;
  timeSlots: TimeSlot[];
  events: Event[];
}

export const TimelineGrid: React.FC<TimelineGridProps> = ({
  startDate,
  endDate,
  timeSlots,
  events,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const dates = generateDateRange(startDate, endDate);
  const today = getTodayDateString();

  // Auto-scroll to today on mount
  useEffect(() => {
    if (scrollRef.current) {
      const todayIndex = dates.findIndex(date => date === today);
      if (todayIndex >= 0) {
        const cellWidth = 80; // Approximate cell width
        const scrollPosition = todayIndex * cellWidth - 200; // Center today in view
        scrollRef.current.scrollLeft = Math.max(0, scrollPosition);
      }
    }
  }, [dates, today]);

  const getEventsForCell = (date: string, timeSlotId: string): Event[] => {
    return events.filter(
      event => event.date === date && event.time_slot_id === timeSlotId
    );
  };

  const handleCellClick = (date: string, timeSlotId: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(timeSlotId);
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedEvent(null);
    setSelectedDate('');
    setSelectedTimeSlot('');
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-gray-900">Timeline</h1>
      </div>

      {/* Timeline Grid */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Time Slots Labels - Sticky Left */}
          <div className="w-24 bg-gray-50 border-r border-gray-200 flex-shrink-0">
            {/* Empty corner cell */}
            <div className="h-10 border-b border-gray-200 bg-white"></div>
            
            {/* Time slot labels */}
            {timeSlots.map(slot => (
              <div
                key={slot.id}
                className="h-[60px] border-b border-gray-200 p-1 flex flex-col justify-center bg-gray-50"
              >
                <div className="font-medium text-gray-900 text-xs">
                  {slot.label}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {slot.start_time} - {slot.end_time}
                </div>
              </div>
            ))}
          </div>

          {/* Scrollable Timeline */}
          <div className="flex-1 overflow-x-auto" ref={scrollRef}>
            <div style={{ width: dates.length * 80 }}>
              {/* Date Headers - Sticky Top */}
              <div className="sticky top-0 bg-white z-10 flex border-b border-gray-200">
                {dates.map(date => (
                  <div
                    key={date}
                    className={`w-[80px] h-10 border-r border-gray-200 p-1 flex flex-col justify-center ${
                      isToday(date) ? 'bg-blue-50 border-blue-200' : 
                      isWeekend(date) ? 'bg-gray-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className={`font-medium text-xs ${
                      isToday(date) ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {formatDateHeader(date)}
                    </div>
                    {isToday(date) && (
                      <div className="text-xs text-blue-600 font-medium">•</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Grid Cells */}
              {timeSlots.map(slot => (
                <div key={slot.id} className="flex">
                  {dates.map(date => {
                    const cellEvents = getEventsForCell(date, slot.id);
                    return (
                      <div
                        key={`${date}-${slot.id}`}
                        className={`w-[80px] border-r border-b ${
                          isToday(date) ? 'border-blue-200' : 'border-gray-200'
                        }`}
                      >
                        <TimelineCell
                          date={date}
                          timeSlotId={slot.id}
                          events={cellEvents}
                          isWeekend={isWeekend(date)}
                          onCellClick={() => handleCellClick(date, slot.id)}
                          onEventClick={handleEventClick}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        event={selectedEvent}
        date={selectedDate}
        timeSlotId={selectedTimeSlot}
        timeSlots={timeSlots}
      />
    </div>
  );
};
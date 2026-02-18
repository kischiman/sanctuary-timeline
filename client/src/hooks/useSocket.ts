import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { AppState, Event, TimeSlot } from '../types';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [appState, setAppState] = useState<AppState | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(import.meta.env.PROD ? '' : 'http://localhost:3000');

    socketInstance.on('connect', () => {
      setConnected(true);
      console.log('Connected to server');
    });

    socketInstance.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from server');
    });

    socketInstance.on('initial_state', (state: AppState) => {
      setAppState(state);
    });

    socketInstance.on('event_created', (event: Event) => {
      setAppState(prev => prev ? {
        ...prev,
        events: [...prev.events, event]
      } : null);
    });

    socketInstance.on('event_updated', (updatedEvent: Partial<Event> & { id: string }) => {
      setAppState(prev => prev ? {
        ...prev,
        events: prev.events.map(event => 
          event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event
        )
      } : null);
    });

    socketInstance.on('event_deleted', ({ id }: { id: string }) => {
      setAppState(prev => prev ? {
        ...prev,
        events: prev.events.filter(event => event.id !== id)
      } : null);
    });

    socketInstance.on('config_updated', (config: Partial<AppState['config']>) => {
      setAppState(prev => prev ? {
        ...prev,
        config: { ...prev.config, ...config }
      } : null);
    });

    socketInstance.on('time_slot_created', (timeSlot: TimeSlot) => {
      setAppState(prev => prev ? {
        ...prev,
        time_slots: [...prev.time_slots, timeSlot].sort((a, b) => a.display_order - b.display_order)
      } : null);
    });

    socketInstance.on('time_slot_updated', (updatedSlot: Partial<TimeSlot> & { id: string }) => {
      setAppState(prev => prev ? {
        ...prev,
        time_slots: prev.time_slots.map(slot => 
          slot.id === updatedSlot.id ? { ...slot, ...updatedSlot } : slot
        ).sort((a, b) => a.display_order - b.display_order)
      } : null);
    });

    socketInstance.on('time_slot_deleted', ({ id }: { id: string }) => {
      setAppState(prev => prev ? {
        ...prev,
        time_slots: prev.time_slots.filter(slot => slot.id !== id)
      } : null);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, appState, connected };
};
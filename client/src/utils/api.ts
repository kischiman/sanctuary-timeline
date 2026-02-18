import type { AppState, Config, Event, EventFormData, TimeSlot } from '../types';

const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

export const api = {
  getState: async (): Promise<AppState> => {
    const response = await fetch(`${API_BASE}/state`);
    return response.json();
  },

  createEvent: async (data: EventFormData & { date: string; time_slot_id: string }): Promise<Event> => {
    const response = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateEvent: async (id: string, updates: Partial<Event>): Promise<void> => {
    await fetch(`${API_BASE}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  },

  deleteEvent: async (id: string): Promise<void> => {
    await fetch(`${API_BASE}/events/${id}`, {
      method: 'DELETE',
    });
  },

  getConfig: async (): Promise<Config> => {
    const response = await fetch(`${API_BASE}/config`);
    return response.json();
  },

  updateConfig: async (config: Partial<Config>): Promise<void> => {
    await fetch(`${API_BASE}/config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
  },

  getTimeSlots: async (): Promise<TimeSlot[]> => {
    const response = await fetch(`${API_BASE}/time-slots`);
    return response.json();
  },

  createTimeSlot: async (data: Omit<TimeSlot, 'id'>): Promise<TimeSlot> => {
    const response = await fetch(`${API_BASE}/time-slots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateTimeSlot: async (id: string, updates: Partial<TimeSlot>): Promise<void> => {
    await fetch(`${API_BASE}/time-slots/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  },

  deleteTimeSlot: async (id: string): Promise<void> => {
    await fetch(`${API_BASE}/time-slots/${id}`, {
      method: 'DELETE',
    });
  },
};
export interface TimeSlot {
  id: string;
  label: string;
  start_time: string;
  end_time: string;
  display_order: number;
}

export interface Event {
  id: string;
  date: string;
  time_slot_id: string;
  title: string;
  description?: string;
  creator_name: string;
  location?: string;
  color: string;
  created_at: number;
}

export interface Config {
  residency_start_date: string;
  residency_end_date: string;
}

export interface AppState {
  config: Config;
  time_slots: TimeSlot[];
  events: Event[];
}

export interface EventFormData {
  title: string;
  description: string;
  creator_name: string;
  location: string;
  specific_time?: string;
}
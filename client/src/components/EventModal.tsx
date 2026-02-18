import React, { useState, useEffect } from 'react';
import type { Event, EventFormData, TimeSlot } from '../types';
import { api } from '../utils/api';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event | null;
  date?: string;
  timeSlotId?: string;
  timeSlots: TimeSlot[];
}

const getStoredUserName = (): string => {
  return localStorage.getItem('user_name') || '';
};

const setStoredUserName = (name: string): void => {
  localStorage.setItem('user_name', name);
};

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  event,
  date,
  timeSlotId,
  timeSlots,
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    creator_name: getStoredUserName(),
    location: '',
    specific_time: '',
  });

  const [loading, setLoading] = useState(false);
  const isEditing = !!event;
  const canDelete = isEditing && event?.creator_name === getStoredUserName();

  useEffect(() => {
    if (isEditing && event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        creator_name: event.creator_name,
        location: event.location || '',
        specific_time: '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        creator_name: getStoredUserName(),
        location: '',
        specific_time: '',
      });
    }
  }, [isEditing, event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.creator_name.trim()) return;

    setLoading(true);
    try {
      setStoredUserName(formData.creator_name);

      if (isEditing && event) {
        await api.updateEvent(event.id, {
          title: formData.title,
          description: formData.description || undefined,
          location: formData.location || undefined,
        });
      } else if (date && timeSlotId) {
        await api.createEvent({
          ...formData,
          date,
          time_slot_id: timeSlotId,
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!event || !confirm('Are you sure you want to delete this event?')) return;

    setLoading(true);
    try {
      await api.deleteEvent(event.id);
      onClose();
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const timeSlot = timeSlots.find(ts => ts.id === (event?.time_slot_id || timeSlotId));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isEditing ? 'Event Details' : 'Create New Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {!isEditing && date && timeSlot && (
          <div className="mb-4 p-3 bg-blue-50 rounded">
            <p className="text-sm text-blue-700">
              <strong>Date:</strong> {new Date(date + 'T00:00:00').toLocaleDateString()}
            </p>
            <p className="text-sm text-blue-700">
              <strong>Time:</strong> {timeSlot.label} ({timeSlot.start_time} - {timeSlot.end_time})
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              value={formData.creator_name}
              onChange={(e) => setFormData({ ...formData, creator_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {!isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specific Time (optional)
              </label>
              <input
                type="text"
                value={formData.specific_time}
                onChange={(e) => setFormData({ ...formData, specific_time: e.target.value })}
                placeholder="e.g., 10:30am"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.creator_name.trim()}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Event' : 'Create Event')}
            </button>
            
            {canDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                Delete
              </button>
            )}
            
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
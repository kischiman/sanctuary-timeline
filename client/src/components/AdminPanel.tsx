import React, { useState } from 'react';
import type { Config, TimeSlot } from '../types';
import { api } from '../utils/api';

interface AdminPanelProps {
  config: Config;
  timeSlots: TimeSlot[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  config,
  timeSlots,
}) => {
  const [configData, setConfigData] = useState(config);
  const [newSlot, setNewSlot] = useState({
    label: '',
    start_time: '',
    end_time: '',
    display_order: timeSlots.length + 1,
  });
  const [saving, setSaving] = useState(false);

  const handleConfigSave = async () => {
    setSaving(true);
    try {
      await api.updateConfig(configData);
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSlotCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlot.label || !newSlot.start_time || !newSlot.end_time) return;

    setSaving(true);
    try {
      await api.createTimeSlot(newSlot);
      setNewSlot({
        label: '',
        start_time: '',
        end_time: '',
        display_order: timeSlots.length + 2,
      });
    } catch (error) {
      console.error('Error creating time slot:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSlotDelete = async (slotId: string) => {
    if (!confirm('Are you sure you want to delete this time slot?')) return;

    setSaving(true);
    try {
      await api.deleteTimeSlot(slotId);
    } catch (error) {
      console.error('Error deleting time slot:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <a
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Timeline
          </a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Residency Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Residency Dates</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={configData.residency_start_date}
                onChange={(e) => setConfigData({ ...configData, residency_start_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={configData.residency_end_date}
                onChange={(e) => setConfigData({ ...configData, residency_end_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <button
            onClick={handleConfigSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Dates'}
          </button>
        </div>

        {/* Time Slots Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Time Slots</h2>
          
          {/* Existing Time Slots */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-700">Current Time Slots</h3>
            <div className="space-y-3">
              {timeSlots.map(slot => (
                <div key={slot.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{slot.label}</span>
                    <span className="text-gray-500 ml-2">
                      {slot.start_time} - {slot.end_time}
                    </span>
                  </div>
                  <button
                    onClick={() => handleSlotDelete(slot.id)}
                    disabled={saving}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Time Slot */}
          <div>
            <h3 className="text-lg font-medium mb-3 text-gray-700">Add New Time Slot</h3>
            <form onSubmit={handleSlotCreate} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={newSlot.label}
                    onChange={(e) => setNewSlot({ ...newSlot, label: e.target.value })}
                    placeholder="e.g., Afternoon"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newSlot.start_time}
                    onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newSlot.end_time}
                    onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={saving || !newSlot.label || !newSlot.start_time || !newSlot.end_time}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? 'Adding...' : 'Add Time Slot'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
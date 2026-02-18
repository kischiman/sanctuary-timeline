import React from 'react';
import { AdminPanel } from '../components/AdminPanel';
import { useSocket } from '../hooks/useSocket';

export const AdminPage: React.FC = () => {
  const { appState, connected } = useSocket();

  if (!connected) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to server...</p>
        </div>
      </div>
    );
  }

  if (!appState) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse rounded-full h-12 w-12 bg-gray-300 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminPanel
      config={appState.config}
      timeSlots={appState.time_slots}
    />
  );
};
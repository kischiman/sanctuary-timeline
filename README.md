# Sanctuary Timeline

A collaborative real-time residency timeline app built with React, TypeScript, and Node.js.

## Features

- **Real-time collaboration** - Multiple users can create, edit, and delete events simultaneously
- **Gantt-style timeline** - Visual horizontal timeline grid with days and time slots
- **Event management** - Click to create events, edit existing ones
- **Admin panel** - Configure residency dates and time slots
- **Responsive design** - Optimized for desktop with touch support for mobile
- **Local storage** - Remembers user names across sessions

## Tech Stack

- **Frontend:** React + TypeScript (Vite), Tailwind CSS, Socket.IO Client
- **Backend:** Node.js, Express, Socket.IO, SQLite (better-sqlite3)
- **Real-time:** WebSockets for instant updates across all connected clients

## Quick Start

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - Timeline: http://localhost:5173
   - Admin Panel: http://localhost:5173/admin

## Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build the client for production
- `npm start` - Start the production server
- `npm run install:all` - Install dependencies for root, client, and server

## Usage

### Timeline View (/)

- **Creating Events:** Click on any empty cell in the timeline grid
- **Viewing Events:** Click on event cards to see details and edit/delete
- **Navigation:** Scroll horizontally to view different dates, auto-scrolls to today
- **Today Indicator:** Current date is highlighted in blue

### Admin Panel (/admin)

- **Residency Dates:** Set the start and end dates for the timeline
- **Time Slots:** Add, edit, or delete time slots (Morning, Midday, Evening by default)
- **Real-time Updates:** Changes are immediately reflected for all users

## Project Structure

```
/
├── client/          # React frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── hooks/         # Custom hooks (useSocket)
│   │   ├── pages/         # Route components
│   │   ├── utils/         # API client and utilities
│   │   └── types.ts       # TypeScript interfaces
│   └── package.json
├── server/          # Express backend + WebSocket
│   ├── database.js        # SQLite database layer
│   ├── index.js          # Express server + Socket.IO
│   └── package.json
└── package.json     # Root package with dev scripts
```

## Data Model

### Config
- `residency_start_date` - Start date of residency
- `residency_end_date` - End date of residency

### Time Slots
- `id` - Unique identifier
- `label` - Display name (e.g., "Morning")
- `start_time` - Start time (e.g., "07:00")
- `end_time` - End time (e.g., "12:00")
- `display_order` - Sort order

### Events
- `id` - Unique identifier (UUID)
- `date` - Event date (YYYY-MM-DD)
- `time_slot_id` - Associated time slot
- `title` - Event title
- `description` - Optional description
- `creator_name` - Name of person who created it
- `location` - Optional location
- `color` - Auto-assigned color based on creator
- `created_at` - Timestamp

## Database

The app uses SQLite with the following default configuration:
- **Residency Period:** Today + 14 days
- **Time Slots:** Morning (07:00-12:00), Midday (12:00-17:00), Evening (17:00-22:00)
- **Database File:** `server/timeline.db` (auto-created)

## Deployment

For production deployment:

1. Build the client: `npm run build`
2. Set `NODE_ENV=production`
3. Run: `npm start`
4. The server will serve the built client files and handle API/WebSocket requests

The server runs on port 3000 by default (configurable via `PORT` environment variable).

## Contributing

This is a simple, self-contained application designed for small residency programs. The codebase is intentionally straightforward and can be easily customized for specific needs.
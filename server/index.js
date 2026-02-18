const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const TimelineDatabase = require('./database');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:3001', 'http://localhost:5173'],
    methods: ['GET', 'POST']
  }
});

const db = new TimelineDatabase();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

function generateColor(creatorName) {
  let hash = 0;
  for (let i = 0; i < creatorName.length; i++) {
    hash = creatorName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];
  return colors[Math.abs(hash) % colors.length];
}

// API Routes
app.get('/api/state', (req, res) => {
  res.json(db.getAppState());
});

app.post('/api/events', (req, res) => {
  const { date, time_slot_id, title, description, creator_name, location } = req.body;
  const color = generateColor(creator_name);
  
  const event = db.createEvent(date, time_slot_id, title, description, creator_name, location, color);
  
  io.emit('event_created', event);
  res.json(event);
});

app.put('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  db.updateEvent(id, updates);
  
  io.emit('event_updated', { id, ...updates });
  res.json({ success: true });
});

app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;
  
  db.deleteEvent(id);
  
  io.emit('event_deleted', { id });
  res.json({ success: true });
});

app.get('/api/config', (req, res) => {
  res.json({
    residency_start_date: db.getConfig('residency_start_date'),
    residency_end_date: db.getConfig('residency_end_date')
  });
});

app.put('/api/config', (req, res) => {
  const { residency_start_date, residency_end_date } = req.body;
  
  if (residency_start_date) {
    db.setConfig('residency_start_date', residency_start_date);
  }
  if (residency_end_date) {
    db.setConfig('residency_end_date', residency_end_date);
  }
  
  io.emit('config_updated', { residency_start_date, residency_end_date });
  res.json({ success: true });
});

app.get('/api/time-slots', (req, res) => {
  res.json(db.getTimeSlots());
});

app.post('/api/time-slots', (req, res) => {
  const { label, start_time, end_time, display_order } = req.body;
  
  const slot = db.createTimeSlot(label, start_time, end_time, display_order);
  
  io.emit('time_slot_created', slot);
  res.json(slot);
});

app.put('/api/time-slots/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  db.updateTimeSlot(id, updates);
  
  io.emit('time_slot_updated', { id, ...updates });
  res.json({ success: true });
});

app.delete('/api/time-slots/:id', (req, res) => {
  const { id } = req.params;
  
  db.deleteTimeSlot(id);
  
  io.emit('time_slot_deleted', { id });
  res.json({ success: true });
});

// WebSocket handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.emit('initial_state', db.getAppState());
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
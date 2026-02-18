const Database = require('better-sqlite3');
const { v4: uuidv4 } = require('uuid');

class TimelineDatabase {
  constructor() {
    this.db = new Database('timeline.db');
    this.init();
  }

  init() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS time_slots (
        id TEXT PRIMARY KEY,
        label TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        display_order INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        time_slot_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        creator_name TEXT NOT NULL,
        location TEXT,
        color TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (time_slot_id) REFERENCES time_slots (id)
      );
    `);

    this.seedDefaults();
  }

  seedDefaults() {
    const startDate = this.getConfig('residency_start_date');
    const endDate = this.getConfig('residency_end_date');

    if (!startDate || !endDate) {
      const today = new Date();
      const endDateObj = new Date(today);
      endDateObj.setDate(today.getDate() + 14);

      this.setConfig('residency_start_date', today.toISOString().split('T')[0]);
      this.setConfig('residency_end_date', endDateObj.toISOString().split('T')[0]);
    }

    const existingSlots = this.db.prepare('SELECT COUNT(*) as count FROM time_slots').get();
    if (existingSlots.count === 0) {
      const defaultSlots = [
        { id: 'morning', label: 'Morning', start_time: '07:00', end_time: '12:00', display_order: 1 },
        { id: 'midday', label: 'Midday', start_time: '12:00', end_time: '17:00', display_order: 2 },
        { id: 'evening', label: 'Evening', start_time: '17:00', end_time: '22:00', display_order: 3 }
      ];

      const insertSlot = this.db.prepare(`
        INSERT INTO time_slots (id, label, start_time, end_time, display_order)
        VALUES (?, ?, ?, ?, ?)
      `);

      for (const slot of defaultSlots) {
        insertSlot.run(slot.id, slot.label, slot.start_time, slot.end_time, slot.display_order);
      }
    }
  }

  getConfig(key) {
    const result = this.db.prepare('SELECT value FROM config WHERE key = ?').get(key);
    return result ? result.value : null;
  }

  setConfig(key, value) {
    this.db.prepare('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)').run(key, value);
  }

  getTimeSlots() {
    return this.db.prepare('SELECT * FROM time_slots ORDER BY display_order').all();
  }

  createTimeSlot(label, start_time, end_time, display_order) {
    const id = uuidv4();
    this.db.prepare(`
      INSERT INTO time_slots (id, label, start_time, end_time, display_order)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, label, start_time, end_time, display_order);
    return { id, label, start_time, end_time, display_order };
  }

  updateTimeSlot(id, updates) {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    this.db.prepare(`UPDATE time_slots SET ${fields} WHERE id = ?`).run(...values, id);
  }

  deleteTimeSlot(id) {
    this.db.prepare('DELETE FROM time_slots WHERE id = ?').run(id);
  }

  getEvents() {
    return this.db.prepare('SELECT * FROM events ORDER BY date, time_slot_id').all();
  }

  createEvent(date, time_slot_id, title, description, creator_name, location, color) {
    const id = uuidv4();
    const created_at = Date.now();
    this.db.prepare(`
      INSERT INTO events (id, date, time_slot_id, title, description, creator_name, location, color, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, date, time_slot_id, title, description, creator_name, location, color, created_at);
    
    return { id, date, time_slot_id, title, description, creator_name, location, color, created_at };
  }

  updateEvent(id, updates) {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    this.db.prepare(`UPDATE events SET ${fields} WHERE id = ?`).run(...values, id);
  }

  deleteEvent(id) {
    this.db.prepare('DELETE FROM events WHERE id = ?').run(id);
  }

  getAppState() {
    return {
      config: {
        residency_start_date: this.getConfig('residency_start_date'),
        residency_end_date: this.getConfig('residency_end_date')
      },
      time_slots: this.getTimeSlots(),
      events: this.getEvents()
    };
  }
}

module.exports = TimelineDatabase;
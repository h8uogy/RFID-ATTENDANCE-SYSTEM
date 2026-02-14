const sqlite3 = require("sqlite3").verbose();

// ===============================
// CONNECT TO DATABASE
// ===============================
const db = new sqlite3.Database("./rfid.db", (err) => {
  if (err) {
    console.error("❌ Failed to connect to database:", err.message);
  } else {
    console.log("✅ Connected to SQLite database");
  }
});

// ===============================
// USERS TABLE
// Stores students and teachers
// ===============================
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,            -- student | teacher
    section TEXT NOT NULL,
    email TEXT,                    -- student or teacher email
    parent_email TEXT              -- only for students
  )
`, (err) => {
  if (err) {
    console.error("❌ Error creating users table:", err.message);
  }
});

// ===============================
// ATTENDANCE TABLE
// Stores RFID scan logs
// ===============================
db.run(`
  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid TEXT NOT NULL,
    name TEXT NOT NULL,
    section TEXT,
    status TEXT DEFAULT 'present',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error("❌ Error creating attendance table:", err.message);
  }
});

module.exports = db;


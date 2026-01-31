const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

// ===============================
// USERS TABLE
// ===============================
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);

  // ===============================
  // RESERVATIONS TABLE
  // ===============================
  db.run(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,          -- Rezervasyonu yapanın adı
      email TEXT,         -- Rezervasyonu yapanın emaili (Filtreleme için kritik)
      persons INTEGER,
      date TEXT,
      time TEXT,
      message TEXT
    )
  `);
});

module.exports = db;
import sqlite3 from "sqlite3";

// Create a SQLite database connection
const db = new sqlite3.Database("HealthTrack.db");

// Serialize database operations
db.serialize(() => {
  // Check if the 'patients' table exists, and create it if not
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='patients'", (err, row) => {
    if (err) {
      console.error(err.message);
    } else if (!row) {
      db.run(
        "CREATE TABLE patients (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, national_id TEXT UNIQUE)",
        (err) => {
          if (err) {
            console.error(err.message);
          } else {
            console.log("Table 'patients' created successfully");
          }
        }
      );
    }
  });

  // Check if the 'records' table exists, and create it if not
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='records'", (err, row) => {
    if (err) {
      console.error(err.message);
    } else if (!row) {
      db.run(
        "CREATE TABLE records (patient_id INTEGER, body_temperature REAL, heart_rate INTEGER, deduction TEXT DEFAULT 'fine', FOREIGN KEY(patient_id) REFERENCES patients(id) ON DELETE CASCADE)",
        (err) => {
          if (err) {
            console.error(err.message);
          } else {
            console.log("Table 'records' created successfully");
          }
        }
      );
    }
  });
});

// Export the database connection
export default db;
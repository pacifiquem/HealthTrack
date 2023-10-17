import sqlite3 from "sqlite3";

const db = new sqlite3.Database("HealthTrack.db");

db.serialize(() => {
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


export default db;
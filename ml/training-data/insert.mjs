import sqlite3 from "sqlite3";
import training_data from "./data.mjs";

// Open a database connection
const db = new sqlite3.Database('../../training_health_track.db');

// SQL query to create data
const createTableQuery = `CREATE TABLE IF NOT EXISTS health_tbl (id INTEGER PRIMARY KEY, heart_rate INTEGER, body_temperature REAL, sickness_status INTEGER);`;

// SQL query to insert data
const insertQuery = `INSERT INTO health_tbl (heart_rate, body_temperature, sickness_status) VALUES ${training_data}`;

// Execute the query
db.exec(createTableQuery, function(err) {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Database created successfully.');
  }
});

db.exec(insertQuery, function(err) {
  
    if (err) {
        console.error(err.message);
    } else {
        console.log(training_data.length);
        console.log('Data inserted successfully.');
    }

    // Close the database connection
    db.close();
});
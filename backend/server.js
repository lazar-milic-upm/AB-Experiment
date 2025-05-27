const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const db = new sqlite3.Database('./database.sqlite');
app.use(cors());
app.use(bodyParser.json());
db.run(`CREATE TABLE IF NOT EXISTS ab_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  version TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  clickCount INTEGER,
  likelihood INTEGER,
  appeal INTEGER
)`);
app.post('/submit', (req, res) => {
  const { version, timestamp, clickCount, likelihood, appeal } = req.body;
  db.run(`INSERT INTO ab_data (version, timestamp, clickCount, likelihood, appeal) VALUES (?, ?, ?, ?, ?)`,
    [version, timestamp, clickCount, likelihood, appeal], function (err) {
      if (err) return res.status(500).send("DB error");
      res.status(200).send("Data saved");
    });
});
app.get('/download-db', (req, res) => {
  res.download('./database.sqlite');
});
app.listen(3000, () => console.log("Server running on http://localhost:3000"));

const express  = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const db  = new sqlite3.Database('./database.sqlite');

app.use(cors());                 // allow calls from GitHub-Pages origin
app.use(bodyParser.json());

// DB table (autocreated the first time the service starts)
db.run(`
  CREATE TABLE IF NOT EXISTS ab_data (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    version    TEXT    NOT NULL,
    timestamp  TEXT    NOT NULL,
    clickCount INTEGER,
    likelihood INTEGER,
    appeal     INTEGER
  )
`);

//  POST  /submit   → store one record
app.post('/submit', (req, res) => {
  // convert ISO to readable format before storing
  let { version, timestamp, clickCount, likelihood, appeal } = req.body;
  timestamp = new Date(timestamp).toLocaleString('es-ES', { timeZone: 'Europe/Madrid'});

  db.run(
    `INSERT INTO ab_data (version, timestamp, clickCount, likelihood, appeal)
     VALUES (?, ?, ?, ?, ?)`,
    [version, timestamp, clickCount, likelihood, appeal],
    err => {
      if (err) { console.error(err); return res.status(500).send('DB error'); }
      res.send('Data saved');
    }
  );
});

//  DOWNLOAD JSON FILE 
app.get('/export/json', (req, res) => {
  db.all('SELECT * FROM ab_data', (err, rows) => {
    if (err) return res.status(500).send('DB read error');

    const json = JSON.stringify(rows, null, 2);      // pretty-printed
    res.header('Content-Type', 'application/json');
    res.attachment('ab_data.json');                   // <-- turns into file download
    res.send(json);
  });
});

//  GET  /download-db   → raw SQLite file
app.get('/download-db', (_req, res) => res.download('./database.sqlite'));

//  POST /clear-db      → remove all rows (use with caution!)
app.post('/clear-db', (_req, res) => {
  db.run('DELETE FROM ab_data', err => {
    if (err) { console.error(err); return res.status(500).send('Clear failed'); }
    res.send('Database cleared.');
  });
});

//  keep-alive ping 
app.get('/ping', (_req, res) => res.send('pong'));

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));
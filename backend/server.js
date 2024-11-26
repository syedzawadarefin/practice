const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3001;


app.use(express.static(path.join(__dirname, '..', 'frontend')))

// Middleware
app.use(express.json()); // Use express.json() for parsing JSON bodies
app.use(cors());


// Set up SQLite database

const dbPath = path.join(__dirname, 'database', 'study_log.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        db.run(`CREATE TABLE IF NOT EXISTS study_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT,
            date TEXT,
            duration INTEGER,
            notes TEXT
        )`);
    }
});


// Get a single study session by ID
app.get('http://localhost:3001/api/study-sessions/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM study_sessions WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).send('Error retrieving data');
        } else if (!row) {
            res.status(404).send('Study session not found');
        } else {
            res.status(200).json(row);
        }
    });
});


// Create a new study session
app.post('http://localhost:3001/api/study-sessions', (req, res) => {
    const { subject, date, duration, notes } = req.body;
    db.run(`INSERT INTO study_sessions (subject, date, duration, notes) VALUES (?, ?, ?, ?)`,
        [subject, date, duration, notes],
        function (err) {
            if (err) {
                res.status(500).send('Error inserting data');
            } else {
                res.status(201).json({ id: this.lastID });
            }
        });
});


// Get all study sessions
app.get('http://localhost:3001/api/study-sessions', (req, res) => {
    db.all('SELECT * FROM study_sessions', [], (err, rows) => {
        if (err) {
            res.status(500).send('Error retrieving data');
        } else {
            res.status(200).json(rows);
        }
    });
});


// Delete study session
app.delete('http://localhost:3001/api/study-sessions/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM study_session WHERE id = ?', [id], function (err) {
        if (err) {
            console.error(err);
            res.status(500).send("error deleting study session");
            } else if (this.changes === 0) {
                res.status(404).send("Study session not found");
            } else {
                res.status(200).json({ message: 'Study session deleted successfully'});
            
            }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});




const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');


const app = express();
const port = 3001;


// Middleware
app.use(express.json()); // Use express.json() for parsing JSON bodies
app.use(cors());


// Set up SQLite database
const path = require('path');
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
app.get('/api/study-sessions/:id', (req, res) => {
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
app.post('/api/study-sessions', (req, res) => {
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
app.get('/api/study-sessions', (req, res) => {
    db.all('SELECT * FROM study_sessions', [], (err, rows) => {
        if (err) {
            res.status(500).send('Error retrieving data');
        } else {
            res.status(200).json(rows);
        }
    });
});


// Define an endpoint to handle DELETE requests for deleting a specific study session
app.delete('/api/study-sessions/:id', (req, res) => {
   
    // Extract the 'id' parameter from the URL using 'req.params'
    const { id } = req.params;




// Execute a SQL query to delete the study session with the given 'id' from the database
    db.run(`DELETE FROM study_sessions WHERE id = ?`, id, function (err) {
       
        // Check if there was an error during the query execution
        if (err) {
            // If an error occurred, respond with a 500 status code (Internal Server Error)
            res.status(500).send('Error deleting data');
        } else {
            // If the query was successful, respond with a 200 status code (OK)
            res.status(200).send('Deleted successfully');
        }
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

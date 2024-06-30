const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json()); // Asegúrate de que esta línea esté aquí para parsear el cuerpo de las solicitudes

const PORT = process.env.PORT || 3306;

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        // Path to SSL certificates if needed
        ca: fs.readFileSync('/path/to/ca-cert.pem'),
        key: fs.readFileSync('/path/to/client-key.pem'),
        cert: fs.readFileSync('/path/to/client-cert.pem')
    }
});


db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Guarda los puntos
app.post('/save-score', (req, res) => {
    const { playerName, score, team } = req.body;

    // Validación de jugador
    const checkQuery = 'SELECT * FROM scores WHERE playerName = ?';
    db.query(checkQuery, [playerName], (err, result) => {
        if (err) {
            console.error('Error checking player:', err);
            return res.status(500).json({ error: 'Error checking player' });
        }

        if (result.length > 0) {
            const updateQuery = 'UPDATE scores SET score = ?, team = ? WHERE playerName = ?';
            db.query(updateQuery, [score, team, playerName], (err, result) => {
                if (err) {
                    console.error('Error updating score:', err);
                    return res.status(500).json({ error: 'Error updating score' });
                }
                res.json(result);
            });
        } else {
            const insertQuery = 'INSERT INTO scores (playerName, score, team) VALUES (?, ?, ?)';
            db.query(insertQuery, [playerName, score, team], (err, result) => {
                if (err) {
                    console.error('Error inserting score:', err);
                    return res.status(500).json({ error: 'Error inserting score' });
                }
                res.json(result);
            });
        }
    });
});

// Obtiene los puntos de todos los jugadores
app.get('/get-scores', (req, res) => {
    const sql = 'SELECT playerName, score, team FROM scores ORDER BY score DESC';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error getting scores:', err);
            return res.status(500).json({ error: 'Error getting scores' });
        }
        res.json(result);
    });
});

// Obtiene los puntos de un jugador específico
app.get('/get-scores/:playerName', (req, res) => {
    const { playerName } = req.params;
    const sql = 'SELECT score FROM scores WHERE playerName = ?';
    db.query(sql, [playerName], (err, result) => {
        if (err) {
            console.error('Error getting player score:', err);
            return res.status(500).json({ error: 'Error getting player score' });
        }
        res.json(result);
    });
});

// Marcar juego como completado
app.post('/complete-game', (req, res) => {
    const { playerName, score } = req.body;

    const updateQuery = 'UPDATE scores SET completed = 1, score = ? WHERE playerName = ?';
    db.query(updateQuery, [score, playerName], (err, result) => {
        if (err) {
            console.error('Error completing game:', err);
            return res.status(500).json({ error: 'Error completing game' });
        }
        res.json({ message: 'Game completed', result });
    });
});

// Verificar si el jugador ya completó el juego
app.get('/check-game-completed/:playerName', (req, res) => {
    const { playerName } = req.params;
    const checkQuery = 'SELECT completed, score FROM scores WHERE playerName = ?';
    db.query(checkQuery, [playerName], (err, result) => {
        if (err) {
            console.error('Error checking game completion:', err);
            return res.status(500).json({ error: 'Error checking game completion' });
        }
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.json({ completed: 0 });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

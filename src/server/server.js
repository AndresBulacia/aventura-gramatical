const express = require('express');
const mysql = require('mysql');
const app = express();
const PORT = process.env.PORT || 3001
const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_USER = process.env.DB_USER || 'root'
const DB_PASSWORD = process.env.DB_PASSWORD || 'Sanmartin3423!'
const DB_NAME = process.env.DB_NAME || 'aventura_gramatical'
const DB_PORT = process.env.DB_PORT || 3306

// Conexión a MySQL
const db = mysql.createConnection({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME
});

// Guarda los puntos
app.post('/save-score', (req, res) => { 
    const { playerName, score, team } = req.body;

    // Validación de jugador
    const checkQuery = 'SELECT * FROM scores WHERE playerName = ?';
    db.query(checkQuery, [playerName], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            const updateQuery = 'UPDATE scores SET score = ?, team = ? WHERE playerName = ?';
            db.query(updateQuery, [score, team, playerName], (err, result) => {
                if (err) throw err;
                res.json(result);
            });
        } else {
            // Si el jugador no existe, creación de uno
            const insertQuery = 'INSERT INTO scores (playerName, score, team) VALUES (?, ?, ?)';
            db.query(insertQuery, [playerName, score, team], (err, result) => {
                if (err) throw err;
                res.json(result);
            });
        }
    });
});

// Obtiene los puntos de todos los jugadores
app.get('/get-scores', (req, res) => {
    const sql = 'SELECT playerName, score, team FROM scores ORDER BY score DESC';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Obtiene los puntos de un jugador específico
app.get('/get-scores/:playerName', (req, res) => {
    const { playerName } = req.params;
    const sql = 'SELECT score FROM scores WHERE playerName = ?';
    db.query(sql, [playerName], (err, result) => {
        if (err) {
            console.error('Error al obtener el puntaje del jugador:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(result);
    });
});

// Marcar juego como completado
app.post('/complete-game', (req, res) => {
    const { playerName, score } = req.body;

    const updateQuery = 'UPDATE scores SET completed = 1, score = ? WHERE playerName = ?';
    db.query(updateQuery, [score, playerName], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Game completed', result });
    });
});

// Verificar si el jugador ya completó el juego
app.get('/check-game-completed/:playerName', (req, res) => {
    const { playerName } = req.params;
    const checkQuery = 'SELECT completed, score FROM scores WHERE playerName = ?';
    db.query(checkQuery, [playerName], (err, result) => {
        if (err) throw err;
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

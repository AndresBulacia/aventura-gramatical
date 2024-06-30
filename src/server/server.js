const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 8080;

// Middleware para manejar JSON
app.use(express.json());

// Conexión a MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conexión a la base de datos MySQL exitosa');
});

// Servir archivos estáticos de la build de React
app.use(express.static(path.join(__dirname, 'build')));

// Guarda los puntos
app.post('/save-score', (req, res) => {
    const { playerName, score, team } = req.body;

    // Validación de jugador
    const checkQuery = 'SELECT * FROM scores WHERE playerName = ?';
    db.query(checkQuery, [playerName], (err, result) => {
        if (err) {
            console.error('Error al validar el jugador:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (result.length > 0) {
            const updateQuery = 'UPDATE scores SET score = ?, team = ? WHERE playerName = ?';
            db.query(updateQuery, [score, team, playerName], (err, result) => {
                if (err) {
                    console.error('Error al actualizar el puntaje:', err);
                    return res.status(500).json({ error: 'Error interno del servidor' });
                }
                res.json(result);
            });
        } else {
            // Si el jugador no existe, creación de uno
            const insertQuery = 'INSERT INTO scores (playerName, score, team) VALUES (?, ?, ?)';
            db.query(insertQuery, [playerName, score, team], (err, result) => {
                if (err) {
                    console.error('Error al insertar el puntaje:', err);
                    return res.status(500).json({ error: 'Error interno del servidor' });
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
            console.error('Error al obtener los puntajes:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
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
            console.error('Error al obtener el puntaje del jugador:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(result);
    });
});


// Servir la aplicación React para cualquier otra ruta
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

import express from 'express';
import mysql from 'mysql2';

const router = express.Router();

// Conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chatapp'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado a MySQL');
});

// Ruta para obtener mensajes
router.get('/messages', (req, res) => {
    db.query('SELECT m.id, m.userId, m.content, m.timestamp, u.username FROM messages m JOIN users u ON m.userId = u.id ORDER BY m.timestamp ASC', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener mensajes' });
        }
        res.json(results);
    });
});

// Ruta para guardar un mensaje
router.post('/messages', (req, res) => {
    const { userId, content } = req.body;

    db.query('INSERT INTO messages (userId, content) VALUES (?, ?)', [userId, content], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al guardar el mensaje' });
        }
        res.json({ message: 'Mensaje guardado' });
    });
});

export default router;

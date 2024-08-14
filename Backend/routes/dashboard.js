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

router.get('/stats', (req, res) => {
    db.query('SELECT COUNT(*) AS users FROM users', (err, users) => {
        if (err) return res.status(500).json({ error: 'Error al obtener usuarios' });
        
        db.query('SELECT COUNT(*) AS messages FROM messages', (err, messages) => {
            if (err) return res.status(500).json({ error: 'Error al obtener mensajes' });
            
            res.json({
                users: users[0].users,
                messages: messages[0].messages
            });
        });
    });
});

export default router;

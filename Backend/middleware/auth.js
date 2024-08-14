import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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

router.post('/register', async (req, res) => {
    const { name, username, password, role } = req.body;

    // Verificar si el usuario ya existe
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al buscar usuario' });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'Usuario ya existe' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar el nuevo usuario en la base de datos
        db.query('INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)', [name, username, hashedPassword, role], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error al registrar usuario' });
            }

            res.status(201).json({ message: 'Usuario registrado exitosamente' });
        });
    });
});

export default router;

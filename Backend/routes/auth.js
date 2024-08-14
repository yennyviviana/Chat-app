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

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al buscar usuario' });
        }

        if (results.length === 0) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.id }, 'tu_secreto_jwt', { expiresIn: '1h' });
        res.json({ message: 'Inicio de sesión exitoso', token });
    });
});

export default router;

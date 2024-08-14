import express from 'express';
import mysql from 'mysql2';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import { Server as socketServer } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { PORT } from './config.js';
import authRoutes from './routes/auth.js'; 
import chatRoutes from './routes/chat.js'; 
import dashboardRoutes from './routes/dashboard.js';

const app = express();
const server = http.createServer(app);
const io = new socketServer(server, {
    cors: {
        origin: 'http://localhost:3000', 
    }
});

app.use('/api/dashboard', dashboardRoutes);
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

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

// Rutas de autenticación
app.use('/api/auth', authRoutes); // Asegúrate de que esta ruta esté configurada

// Rutas para el chat
app.use('/api/chat', chatRoutes); // Rutas para manejar los mensajes

// Manejo de conexiones de Socket.io
io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    // Enviar mensajes antiguos al nuevo usuario
    socket.on('getMessages', () => {
        db.query('SELECT m.id, m.userId, m.content, m.timestamp, u.username FROM messages m JOIN users u ON m.userId = u.id ORDER BY m.timestamp ASC', (err, results) => {
            if (err) {
                console.error('Error al obtener mensajes:', err);
            } else {
                socket.emit('loadMessages', results);
            }
        });
    });

    // Manejar nuevos mensajes
    socket.on('sendMessage', (message) => {
        const { userId, content } = message;

        // Guardar el mensaje en la base de datos
        db.query('INSERT INTO messages (userId, content) VALUES (?, ?)', [userId, content], (err, result) => {
            if (err) {
                console.error('Error al guardar el mensaje:', err);
            } else {
                // Emitir el mensaje a todos los clientes
                io.emit('receiveMessage', { userId, content, timestamp: new Date(), username: message.username });
            }
        });
    });

    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
    });
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

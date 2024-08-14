import React, { useEffect } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Chat from './components/Chat';
import Login from './components/Login';
import Register from './components/Register';
import { useAuth } from './hooks/useAuth';
import Dashboard from './components/Dashboard';


// Conectar con el servidor de Socket.io
const socket = io('http://localhost:5000', {
  transports: ['websocket'], // Asegura que se use WebSocket
});

function App() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Manejo de eventos de Socket.io
    socket.on('connect', () => {
      console.log('Conectado al servidor Socket.io');
    });

    socket.on('message', (message) => {
      console.log('Mensaje recibido:', message);
    });

    return () => {
      socket.disconnect();
      console.log('Desconectado del servidor Socket.io');
    };
  }, []);

  return (
    <div className="App">
      <Routes>
        {/* Ruta por defecto redirige al inicio de sesión */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Ruta para el formulario de inicio de sesión */}
        <Route path="/login" element={<Login />} />
        
        {/* Ruta para el formulario de registro */}
        <Route path="/register" element={<Register />} />
        

         {/* Ruta para el formulario de registro */}
         <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        {/* Ruta protegida para el chat */}
        <Route
          path="/chat"
          element={
            isAuthenticated ? <Chat /> : <Navigate to="/login" />
          }
        />
        
        {/* Ruta para manejar rutas no encontradas */}
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </div>
  );
}

export default App;

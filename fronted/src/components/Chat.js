import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './Chat.css';

const socket = io('http://localhost:5000');

function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        // Cargar mensajes antiguos
        socket.emit('getMessages');

        socket.on('loadMessages', (msgs) => {
            setMessages(msgs);
        });

        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            const message = {
                userId: 1, 
                content: input,
                username: 'Usuario', 
            };
            socket.emit('sendMessage', message);
            setInput('');
        }
    };

    return (
        <div className="chat-container">
            <div className="message-area">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.username === 'Moderador' ? 'moderator' : 'student'}`}
                    >
                        <span className="username">{msg.username}</span>
                        <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                        <div>{msg.content}</div>
                    </div>
                ))}
            </div>
            <form className="message-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribe un mensaje..."
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}

export default Chat;

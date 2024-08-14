import React, { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom'; 

function Register() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, username, password, role);
            navigate('/login'); // Redirige al login después del registro exitoso
        } catch (err) {
            setError('Error al registrar usuario: ' + err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Nombre" 
                required 
            />
            <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Usuario" 
                required 
            />
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Contraseña" 
                required 
            />
            <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
            >
                <option value="student">Estudiante</option>
                <option value="moderator">Moderador</option>
            </select>
            <button type="submit">Registrar</button>
            {error && <p>{error}</p>}
        </form>
    );
}

export default Register;

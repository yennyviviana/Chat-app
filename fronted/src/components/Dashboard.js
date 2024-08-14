import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
    const { isAuthenticated } = useAuth();
    const [stats, setStats] = useState({ users: 0, messages: 0 });

    useEffect(() => {
        if (isAuthenticated) {
            axios.get('http://localhost:5000/api/dashboard/stats')
                .then(response => setStats(response.data))
                .catch(error => console.error('Error al obtener estadísticas:', error));
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) return <p>No estás autenticado</p>;

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            <div className="stats">
                <div className="stat">
                    <h3>Usuarios Conectados</h3>
                    <p>{stats.users}</p>
                </div>
                <div className="stat">
                    <h3>Mensajes Enviados</h3>
                    <p>{stats.messages}</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

import axios from 'axios';

export async function register(name, username, password, role) {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
            name,
            username,
            password,
            role
        });

        return response.data;
    } catch (error) {
        console.error('Error en la solicitud de registro:', error);
        throw new Error(`Error al registrar usuario: ${error.response?.data?.error || error.message}`);
    }
}

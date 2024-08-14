import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) return res.status(403).json({ error: 'No token provided' });

    jwt.verify(token, 'tu_secreto_jwt', (err, decoded) => {
        if (err) return res.status(500).json({ error: 'Failed to authenticate token' });
        req.userId = decoded.id;
        next();
    });
}

router.get('/', verifyToken, (req, res) => {
    res.json({ message: 'Contenido protegido' });
});

export default router;

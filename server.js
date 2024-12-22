const express = require('express');
const path = require('path');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '/')));

// Almacenamiento temporal de puntuaciones (más adelante se guardará en una base de datos)
let scores = {};

// Configurar la ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API para guardar puntuación
app.post('/api/save-score', (req, res) => {
    const { username, score } = req.body;
    if (!username || !score) {
        return res.status(400).json({ error: 'Se requiere nombre de usuario y puntuación' });
    }
    scores[username] = score;
    res.json({ message: 'Puntuación guardada con éxito' });
});

// API para obtener puntuación
app.get('/api/get-score/:username', (req, res) => {
    const { username } = req.params;
    const score = scores[username];
    if (score === undefined) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ username, score });
});

// API para obtener todas las puntuaciones
app.get('/api/all-scores', (req, res) => {
    res.json(scores);
});

// Escuchar en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


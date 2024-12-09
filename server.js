const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '/')));

// Configurar la ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Escuchar en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

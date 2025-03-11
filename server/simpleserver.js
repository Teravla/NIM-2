const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5469;

// Servir les fichiers statiques depuis le dossier 'src'
app.use(express.static(path.join(__dirname, "..", 'src')));

// Route principale pour servir menu.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "..", 'src', 'menu.html')); // Modifiez le chemin ici
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

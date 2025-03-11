const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public')); // Assurez-vous que vos fichiers statiques (HTML, CSS, JS) sont dans un dossier public

// Stocker les jeux actifs
const games = {};

// Gérer les connexions WebSocket
wss.on('connection', (ws) => {
    console.log('Un joueur est connecté');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Message reçu:', data);

        switch (data.type) {
            case 'createGame':
                const gameCode = generateGameCode();
                // Créer une entrée pour le jeu avec l'ID du joueur
                games[gameCode] = { players: [{ id: data.playerId, socket: ws }], sticks: data.sticks };
                ws.send(JSON.stringify({ type: 'gameCreated', gameCode, sticks: data.sticks }));
                break;

            case 'joinGame':
                const game = games[data.gameCode];
                if (game) {
                    // Ajouter le nouveau joueur avec son ID
                    game.players.push({ id: data.playerId, socket: ws });
                    ws.send(JSON.stringify({ type: 'gameJoined', gameCode: data.gameCode, sticks: game.sticks }));
                    // Informer tous les joueurs de la mise à jour
                    game.players.forEach(player => player.socket.send(JSON.stringify({ type: 'playerJoined', playerId: data.playerId })));
                } else {
                    ws.send(JSON.stringify({ type: 'error', message: 'Game not found' }));
                }
                break;

            // Autres types de messages, comme le mouvement du jeu, peuvent être ajoutés ici
        }
    });

    ws.on('close', () => {
        console.log('Un joueur est déconnecté');
        // Logique pour gérer les déconnexions (retirer le joueur du jeu, etc.)
    });
});

// Fonction pour générer un code de jeu unique
function generateGameCode() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});

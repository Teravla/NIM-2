const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let games = {}; // Stocke les parties privées
let clients = [];

wss.on('connection', (ws) => {
    console.log('A player connected');

    clients.push(ws);

    ws.on('message', (message) => {
        let data = JSON.parse(message);
        
        if (data.type === 'move') {
            let targetClients = data.gameCode ? games[data.gameCode] : clients;
            targetClients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'updatePile', pile: pile }));
                }
            });
        }

        if (data.type === 'gameOver') {
            let targetClients = data.gameCode ? games[data.gameCode] : clients;
            targetClients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'gameOver', text: data.text }));
                }
            });
        }
    });

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
    });

    ws.on('error', (err) => console.error('WebSocket Error:', err));
});

console.log('WebSocket server running on ws://localhost:8080');

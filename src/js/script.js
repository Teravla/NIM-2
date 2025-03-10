let pile = 3;
let socket;
let gameMode = "public";
let gameCode = "";

// Connexion au serveur WebSocket
function connectToServer() {
    socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => console.log("Connected to WebSocket server");

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleMessage(message);
    };

    socket.onerror = (error) => console.log('WebSocket error:', error);

    socket.onclose = () => console.log('WebSocket connection closed');
}

// Gère les messages du serveur
function handleMessage(message) {
    if (message.type === 'updatePile') {
        pile = message.pile;
        updatePile();
    } else if (message.type === 'gameOver') {
        document.getElementById("message").innerText = message.text;
        disableButtons();
    }
}

// Envoie une action au serveur
function sendMove(count) {
    socket.send(JSON.stringify({ type: 'move', count, gameCode }));
}

// Désactive les boutons si nécessaire
function disableButtons() {
    document.querySelectorAll("button").forEach(button => button.disabled = true);
}

// Met à jour l'affichage de la pile
function updatePile() {
    const pileContainer = document.getElementById('pile1-sticks');
    pileContainer.innerHTML = '';
    for (let i = 0; i < pile; i++) {
        const stick = document.createElement('div');
        stick.classList.add('stick');
        pileContainer.appendChild(stick);
    }

    document.querySelectorAll("button").forEach(button => {
        let removeCount = parseInt(button.innerText.split(" ")[1]);
        button.disabled = removeCount > pile;
    });
}

// Supprime des bâtonnets
function removeStones(count) {
    if (pile >= count) {
        pile -= count;
        updatePile();
        sendMove(count);

        if (pile === 0) {
            socket.send(JSON.stringify({ type: 'gameOver', text: "Game Over!", gameCode }));
        }
    } else {
        alert("Not enough sticks!");
    }
}

// Basculer entre partie publique et privée
function toggleGameMode() {
    gameMode = document.querySelector('input[name="gameMode"]:checked').value;

    if (gameMode === "private") {
        gameCode = generateGameCode();
        document.getElementById("privateCode").style.display = "block";
        document.getElementById("privateCode").querySelector("span").innerText = gameCode;
        document.getElementById("startGameBtn").style.display = "none";
        document.getElementById("joinGameBtn").style.display = "block";
    } else {
        document.getElementById("privateCode").style.display = "none";
        document.getElementById("startGameBtn").style.display = "block";
        document.getElementById("joinGameBtn").style.display = "none";
    }
}

// Génère un code de partie privée aléatoire
function generateGameCode() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Afficher le modal de saisie de code
function showJoinModal() {
    document.getElementById("joinModal").style.display = "flex";
}

// Démarrer une partie
function startGame() {
    pile = parseInt(document.getElementById("sticksInput").value) || 3;
    document.getElementById("modal").style.display = "none";
    updatePile();
}

// Rejoindre une partie privée
function joinGame() {
    gameCode = document.getElementById("gameCodeInput").value.toUpperCase();
    document.getElementById("joinModal").style.display = "none";
    connectToServer();
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
    connectToServer();
    updatePile();
});



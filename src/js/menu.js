document.addEventListener("DOMContentLoaded", function () {
    console.log("Menu JS Loaded");
    let gameMode = "public";
    let gameCode = "";
    const socket = new WebSocket('ws://localhost:3000'); // Remplacez par l'URL de votre serveur si nécessaire

    const toggle = document.getElementById("gameModeToggle");
    const modeText = document.getElementById("gameModeText");
    const publicGameSection = document.getElementById("publicGameSection");
    const privateGameSection = document.getElementById("privateGameSection");
    const privateCodeContainer = document.getElementById("privateCode");
    const privateCodeSpan = privateCodeContainer.querySelector("span");
    const startGameBtn = document.getElementById("startGameBtn");
    const joinGameBtn = document.getElementById("joinGameBtn");
    const generateCodeBtn = document.getElementById("generateCodeBtn");
    const setupGameSection = document.getElementById("setupGameSection");

    function generateGameCode() {
        return Math.random().toString(36).substr(2, 9).toUpperCase(); 
    }

    function toggleGameMode() {
        gameMode = toggle.checked ? "private" : "public";
        modeText.innerText = toggle.checked ? "Private Game" : "Public Game"; 

        if (gameMode === "private") {
            privateGameSection.style.display = "block";
            publicGameSection.style.display = "none"; 
            startGameBtn.style.display = "none"; 
            joinGameBtn.style.display = "block"; 
            generateCodeBtn.style.display = "inline-block";
            privateCodeContainer.style.display = "none";
            setupGameSection.style.display = "none"; // Masquer la section de configuration
        } else {
            privateGameSection.style.display = "none";
            publicGameSection.style.display = "block";
            startGameBtn.style.display = "block"; 
            joinGameBtn.style.display = "none";  
            generateCodeBtn.style.display = "none";
            privateCodeContainer.style.display = "none";
            setupGameSection.style.display = "none"; // Masquer la section de configuration
        }
    }

    function generateAndShowCode() {
        gameCode = generateGameCode(); 
        console.log("Game Code:", gameCode);
        privateCodeContainer.style.display = "block";
        privateCodeSpan.innerText = gameCode;
        privateCodeContainer.style.display = "block";
        generateCodeBtn.style.display = "none";
        setupGameSection.style.display = "block"; // Afficher la section de configuration
    }

    generateCodeBtn.addEventListener("click", function () {
        generateAndShowCode();
    });

    toggle.addEventListener("change", toggleGameMode);

    toggleGameMode();


    socket.onopen = () => {
        console.log('Connecté au serveur WebSocket');
    };
    

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
            case 'gameCreated':
                console.log('Game created with code:', data.gameCode);
                // Mettre à jour l'interface utilisateur si nécessaire
                break;
            case 'gameJoined':
                console.log('Joined game:', data.gameCode);
                // Mettre à jour l'interface utilisateur avec les détails du jeu
                break;
            case 'playerJoined':
                console.log('Un joueur a rejoint la partie');
                // Mettre à jour l'interface utilisateur si nécessaire
                break;
            case 'error':
                alert(data.message);
                break;
        }
    };

    // Fonction pour créer un cookie
    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000)); // Durée du cookie
        const expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    // Fonction pour lire un cookie
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length); // Supprimer les espaces
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Fonction pour générer un ID utilisateur
    function generateUserId() {
        return Math.random().toString(36).substr(2, 9); // Générer un ID aléatoire
    }

    // Récupérer l'ID utilisateur à partir des cookies ou en créer un nouveau
    let userId = getCookie('userId');
    if (!userId) {
        userId = generateUserId();
        setCookie('userId', userId, 365); // Durée de 365 jours
        console.log("Nouveau User ID généré et stocké dans un cookie:", userId);
    } else {
        console.log("User ID récupéré du cookie:", userId);
    }

    // Afficher l'ID du joueur dans l'interface utilisateur
    document.querySelector("#PlayerId span").innerText = userId; // Met à jour le span avec l'ID du joueur
    
    // Gestionnaire d'événements pour le bouton "Start Private Game"
    document.getElementById('startPrivateGameBtn').addEventListener('click', () => {
        const sticksInput = document.getElementById('sticksInput');
        console.log(sticksInput);
        const sticks = sticksInput.value;
        console.log(sticks);

        // Vérifiez si le champ est vide ou si le nombre de bâtons est inférieur à 1
        console.log("Valeur du champ de bâtons:", sticks); // Log de la valeur récupérée

        console.log("Nombre de bâtons:", sticks);
        const gameData = {
            type: 'createGame',
            sticks: Number(sticks), // Assurez-vous que sticks est un nombre
            playerId: userId // Utiliser l'ID de l'utilisateur
        };
        console.log("Données du jeu à envoyer:", gameData); // Log des données du jeu avant l'envoi
        socket.send(JSON.stringify(gameData));
    });

    
    
    

    document.getElementById('joinPrivateGameBtn').addEventListener('click', () => {
        const gameCodeInput = document.getElementById('gameCodeInput').value;
        const joinData = {
            type: 'joinGame',
            gameCode: gameCodeInput,
            playerId: userId // Utiliser l'ID de l'utilisateur
        };
        socket.send(JSON.stringify(joinData));
    });


});

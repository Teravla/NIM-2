document.addEventListener("DOMContentLoaded", function () {
    let gameMode = "public"; // Initialiser le mode à "public"
    let gameCode = "";

    const toggle = document.getElementById("gameModeToggle");
    const modeText = document.getElementById("gameModeText");
    const publicGameSection = document.getElementById("publicGameSection");
    const privateGameSection = document.getElementById("privateGameSection");
    const privateCodeContainer = document.getElementById("privateCode");
    const privateCodeSpan = privateCodeContainer.querySelector("span");
    const startGameBtn = document.getElementById("startGameBtn");
    const joinGameBtn = document.getElementById("joinGameBtn");

    // Fonction pour générer un code de partie privée
    function generateGameCode() {
        return Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    // Fonction pour gérer le changement de mode
    function toggleGameMode() {
        gameMode = toggle.checked ? "private" : "public"; // Mise à jour du mode
        modeText.innerText = toggle.checked ? "Private Game" : "Public Game"; // Mise à jour du texte

        if (gameMode === "private") {
            gameCode = generateGameCode(); // Génère un code de jeu privé
            privateCodeContainer.style.display = "block";
            privateCodeSpan.innerText = gameCode;
            publicGameSection.style.display = "none"; // Masquer la section publique
            privateGameSection.style.display = "block"; // Afficher la section privée
            startGameBtn.style.display = "none";
            joinGameBtn.style.display = "block";
        } else {
            privateCodeContainer.style.display = "none"; // Masquer le code de jeu privé
            publicGameSection.style.display = "block"; // Afficher la section publique
            privateGameSection.style.display = "none"; // Masquer la section privée
            startGameBtn.style.display = "block";
            joinGameBtn.style.display = "none";
        }
    }

    // Ajout d'un écouteur d'événement sur le switch
    toggle.addEventListener("change", toggleGameMode);

    // Initialiser l'affichage au chargement de la page
    toggleGameMode();
});

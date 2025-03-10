document.addEventListener("DOMContentLoaded", function () {
    console.log("Menu JS Loaded");
    let gameMode = "public";
    let gameCode = "";

    const toggle = document.getElementById("gameModeToggle");
    const modeText = document.getElementById("gameModeText");
    const publicGameSection = document.getElementById("publicGameSection");
    const privateGameSection = document.getElementById("privateGameSection");
    const privateCodeContainer = document.getElementById("privateCode");
    const privateCodeSpan = privateCodeContainer.querySelector("span");
    const startGameBtn = document.getElementById("startGameBtn");
    const joinGameBtn = document.getElementById("joinGameBtn");
    const generateCodeBtn = document.getElementById("generateCodeBtn");

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
        } else {
            privateGameSection.style.display = "none";
            publicGameSection.style.display = "block";
            startGameBtn.style.display = "block"; 
            joinGameBtn.style.display = "none";  
            generateCodeBtn.style.display = "none";
            privateCodeContainer.style.display = "none";
        }
    }

    function generateAndShowCode() {
        gameCode = generateGameCode(); 
        console.log("Game Code:", gameCode);
        privateCodeContainer.style.display = "block";
        privateCodeSpan.innerText = gameCode;
        privateCodeContainer.style.display = "block";
        generateCodeBtn.style.display = "none";
    }


    generateCodeBtn.addEventListener("click", function () {
        generateAndShowCode();
    });

    toggle.addEventListener("change", toggleGameMode);

    toggleGameMode();
});

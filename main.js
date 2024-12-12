// Initial game state
let gameData = {
    points: 0,
    pointsPerClick: 1,
    upgrades: {
        bounce: 0
    }
};

// Update the UI
function updateUI() {
    document.getElementById("pointsCount").textContent = gameData.points;
    document.getElementById("pointsPerClick").textContent = gameData.pointsPerClick;
    document.getElementById("bounceCount").textContent = gameData.upgrades.bounce;
}

// Handle ball clicks
document.getElementById("ball").addEventListener("click", function () {
    gameData.points += gameData.pointsPerClick;
    updateUI();
});

// Handle upgrades
document.getElementById("buyBounce").addEventListener("click", function () {
    if (gameData.points >= 50) {
        gameData.points -= 50;
        gameData.pointsPerClick += 5;
        gameData.upgrades.bounce += 1;
        updateUI();
    } else {
        alert("Not enough points!");
    }
});

// Save game data to a .txt file
function saveGameData(data) {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ball_clicker_save.txt";
    link.click();
    URL.revokeObjectURL(link.href);
    console.log("Game saved successfully!");
}

// Load game data from a .txt file
function loadGameData(callback) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt";
    input.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const data = JSON.parse(e.target.result);
                    console.log("Game loaded successfully!", data);
                    callback(data);
                } catch (error) {
                    console.error("Error loading game data:", error);
                    alert("Invalid file format. Please select a valid save file.");
                }
            };
            reader.readAsText(file);
        } else {
            console.log("No file selected.");
        }
    });
    input.click();
}

// Save button
document.getElementById("saveButton").addEventListener("click", function () {
    saveGameData(gameData);
});

// Load button
document.getElementById("loadButton").addEventListener("click", function () {
    loadGameData(function (loadedData) {
        gameData = loadedData; // Replace game state with loaded data
        updateUI();
    });
});

// Initialize the game
updateUI();

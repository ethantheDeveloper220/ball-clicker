// Initial game state
let gameData = {
    points: 0,
    pointsPerClick: 1,
    pointsPerSecond: 0,
    upgrades: {},
    prestigeCount: 0,       // Tracks number of prestiges
    prestigeBonus: 1,       // Multiplier for points per click/second
    upgradeDiscount: 1.0,   // Discount on upgrades (1.0 = no discount)
};

// Upgrade definitions
const upgrades = [
    { id: "ultraBall", name: "Ultra Ball", cost: 50000, ppc: 50, type: "ppc" },
    { id: "autoBallFactory", name: "Auto Ball Factory", cost: 100000, pps: 100, type: "pps" },
    { id: "prestigeMultiplier", name: "Prestige Multiplier", cost: 200000, multiplier: 1.1, type: "multiplier" },
    { id: "bounceUpgrade", name: "Bounce Upgrade", cost: 50, ppc: 5, type: "ppc" },
    { id: "clickMultiplier", name: "Click Multiplier", cost: 150, multiplier: 2, type: "multiplier" },
    { id: "autoClicker", name: "Auto Clicker", cost: 500, pps: 10, type: "pps" },
];

// Update the UI
function updateUI() {
    document.getElementById("pointsCount").textContent = gameData.points;
    document.getElementById("pointsPerClick").textContent = (gameData.pointsPerClick * gameData.prestigeBonus).toFixed(1);
    document.getElementById("pointsPerSecond").textContent = (gameData.pointsPerSecond * gameData.prestigeBonus).toFixed(1);
    document.getElementById("prestigeCount").textContent = gameData.prestigeCount;

    upgrades.forEach((upgrade) => {
        if (document.getElementById(`${upgrade.id}Count`)) {
            document.getElementById(`${upgrade.id}Count`).textContent = gameData.upgrades[upgrade.id] || 0;
        }
    });

    checkPrestigeEligibility();
}

// Prestige requirements
const prestigeRequirement = 1000000;

// Check if player can prestige
function checkPrestigeEligibility() {
    if (gameData.points >= prestigeRequirement) {
        document.getElementById("prestigeButton").style.display = "block";
    } else {
        document.getElementById("prestigeButton").style.display = "none";
    }
}

// Prestige logic
document.getElementById("prestigeButton").addEventListener("click", function () {
    if (gameData.points >= prestigeRequirement) {
        // Reset points and upgrades
        gameData.points = 0;
        gameData.pointsPerClick = 1;
        gameData.pointsPerSecond = 0;
        gameData.upgrades = {};

        // Increment prestige count and apply bonuses
        gameData.prestigeCount += 1;
        gameData.prestigeBonus = 1 + gameData.prestigeCount * 0.5; // Example: +0.5x per prestige
        gameData.upgradeDiscount = 0.8 ** gameData.prestigeCount; // Example: 20% cheaper upgrades per prestige

        // Update UI and save
        updateUI();
        saveToLocalStorage();
        alert(`You prestiged! All progress reset, but you now earn ${gameData.prestigeBonus.toFixed(1)}x points and upgrades are ${(gameData.upgradeDiscount * 100).toFixed(1)}% cheaper.`);
    }
});

// Save data to local storage
function saveToLocalStorage() {
    localStorage.setItem("ballClickerSave", JSON.stringify(gameData));
    console.log("Game saved to local storage!");
}

// Load data from local storage
function loadFromLocalStorage() {
    const savedData = localStorage.getItem("ballClickerSave");
    if (savedData) {
        gameData = JSON.parse(savedData);
        console.log("Game loaded from local storage!", gameData);
        updateUI();
    } else {
        console.log("No saved game found.");
    }
}

// Save game on window close or refresh
window.onbeforeunload = function () {
    saveToLocalStorage();
};

// Load game when the page loads
loadFromLocalStorage();

// Generate upgrade buttons dynamically
const upgradesContainer = document.getElementById("upgradesContainer");

upgrades.forEach((upgrade) => {
    const button = document.createElement("button");
    button.id = upgrade.id;
    button.textContent = `${upgrade.name} (Cost: ${upgrade.cost})`;
    upgradesContainer.appendChild(button);

    const span = document.createElement("span");
    span.id = `${upgrade.id}Count`;
    span.textContent = `0`; // Initial count
    upgradesContainer.appendChild(span);

    upgradesContainer.appendChild(document.createElement("br"));

    button.addEventListener("click", function () {
        const discountedCost = Math.floor(upgrade.cost * gameData.upgradeDiscount);
        if (gameData.points >= discountedCost) {
            gameData.points -= discountedCost;

            // Apply the upgrade effect
            if (upgrade.type === "ppc") {
                gameData.pointsPerClick += upgrade.ppc * gameData.prestigeBonus;
            } else if (upgrade.type === "pps") {
                gameData.pointsPerSecond += upgrade.pps * gameData.prestigeBonus;
            } else if (upgrade.type === "multiplier") {
                gameData.pointsPerClick *= upgrade.multiplier;
            }

            // Increment the upgrade count
            gameData.upgrades[upgrade.id] = (gameData.upgrades[upgrade.id] || 0) + 1;

            // Increase cost for scalability
            upgrade.cost = Math.floor(upgrade.cost * 1.5);
            button.textContent = `${upgrade.name} (Cost: ${Math.floor(upgrade.cost * gameData.upgradeDiscount)})`;

            updateUI();
        } else {
            alert("Not enough points!");
        }
    });
});

// Auto clicker functionality
setInterval(function () {
    gameData.points += gameData.pointsPerSecond * gameData.prestigeBonus;
    updateUI();
}, 1000);

// Initialize the game
updateUI();
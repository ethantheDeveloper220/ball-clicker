// Game data
let gameData = {
    points: 0,
    pointsPerClick: 1,
    pointsPerSecond: 0,
    upgrades: {},
    prestigeCount: 0,
    prestigeBonus: 1,
    upgradeDiscount: 1.0,
};

// Upgrades
const upgrades = [
    { id: "bounceUpgrade", name: "Bounce Upgrade", cost: 50, ppc: 5, type: "ppc" },
    { id: "clickMultiplier", name: "Click Multiplier", cost: 150, multiplier: 2, type: "multiplier" },
    { id: "autoClicker", name: "Auto Clicker", cost: 500, pps: 10, type: "pps" },
];

// Prestige requirements
const prestigeRequirement = 1000000;

// Update UI
function updateUI() {
    document.getElementById("pointsCount").textContent = Math.floor(gameData.points);
    document.getElementById("pointsPerClick").textContent = (gameData.pointsPerClick * gameData.prestigeBonus).toFixed(1);
    document.getElementById("pointsPerSecond").textContent = (gameData.pointsPerSecond * gameData.prestigeBonus).toFixed(1);
    document.getElementById("prestigeCount").textContent = gameData.prestigeCount;

    upgrades.forEach((upgrade) => {
        if (document.getElementById(`${upgrade.id}Count`)) {
            document.getElementById(`${upgrade.id}Count`).textContent = gameData.upgrades[upgrade.id] || 0;
        }
    });

    if (gameData.points >= prestigeRequirement) {
        document.getElementById("prestigeButton").style.display = "block";
    } else {
        document.getElementById("prestigeButton").style.display = "none";
    }
}

// Save data
function saveToLocalStorage() {
    localStorage.setItem("ballClickerSave", JSON.stringify(gameData));
}

// Load data
function loadFromLocalStorage() {
    const savedData = localStorage.getItem("ballClickerSave");
    if (savedData) {
        gameData = JSON.parse(savedData);
        updateUI();
    }
}

// Ball click functionality
document.getElementById("clickBall").addEventListener("click", function () {
    gameData.points += gameData.pointsPerClick * gameData.prestigeBonus;
    updateUI();
});

// Prestige functionality
document.getElementById("prestigeButton").addEventListener("click", function () {
    if (gameData.points >= prestigeRequirement) {
        gameData.points = 0;
        gameData.pointsPerClick = 1;
        gameData.pointsPerSecond = 0;
        gameData.upgrades = {};
        gameData.prestigeCount += 1;
        gameData.prestigeBonus = 1 + gameData.prestigeCount * 0.5;
        gameData.upgradeDiscount = 0.8 ** gameData.prestigeCount;
        updateUI();
        alert(`Prestiged! You now have ${gameData.prestigeBonus.toFixed(1)}x bonus and cheaper upgrades.`);
    }
});

// Create upgrades
const upgradesContainer = document.getElementById("upgradesContainer");
upgrades.forEach((upgrade) => {
    const button = document.createElement("button");
    button.id = upgrade.id;
    button.textContent = `${upgrade.name} (Cost: ${upgrade.cost})`;
    upgradesContainer.appendChild(button);

    const span = document.createElement("span");
    span.id = `${upgrade.id}Count`;
    span.textContent = "0";
    upgradesContainer.appendChild(span);
    upgradesContainer.appendChild(document.createElement("br"));

    button.addEventListener("click", function () {
        const discountedCost = Math.floor(upgrade.cost * gameData.upgradeDiscount);
        if (gameData.points >= discountedCost) {
            gameData.points -= discountedCost;
            if (upgrade.type === "ppc") gameData.pointsPerClick += upgrade.ppc * gameData.prestigeBonus;
            if (upgrade.type === "pps") gameData.pointsPerSecond += upgrade.pps * gameData.prestigeBonus;
            if (upgrade.type === "multiplier") gameData.pointsPerClick *= upgrade.multiplier;
            gameData.upgrades[upgrade.id] = (gameData.upgrades[upgrade.id] || 0) + 1;
            upgrade.cost = Math.floor(upgrade.cost * 1.5);
            button.textContent = `${upgrade.name} (Cost: ${Math.floor(upgrade.cost * gameData.upgradeDiscount)})`;
            updateUI();
        }
    });
});

// Auto-clicker
setInterval(() => {
    gameData.points += gameData.pointsPerSecond * gameData.prestigeBonus;
    updateUI();
}, 1000);

// Save on close
window.onbeforeunload = saveToLocalStorage;

// Load game
loadFromLocalStorage();
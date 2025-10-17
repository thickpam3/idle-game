// ---------- state ----------
let currentScreen = "main-menu";
let saves = JSON.parse(localStorage.getItem("saves")) || [];
let activeSave = null;
let gameInterval = null;

// ---------- helpers ----------
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  currentScreen = id;
}

// ---------- main menu ----------
document.getElementById("play-btn").onclick = () => showScreen("save-select");
document.querySelectorAll(".back-btn").forEach(btn =>
  btn.addEventListener("click", () => showScreen("main-menu"))
);

// ---------- settings ----------
document.getElementById("settings-btn").onclick = () => showScreen("settings");
document.getElementById("dark-mode-toggle").onchange = e => {
  document.body.classList.toggle("dark-mode", e.target.checked);
};

// ---------- save selection ----------
const saveSlotsDiv = document.getElementById("save-slots");
const newSaveBtn = document.getElementById("new-save-btn");

function renderSaves() {
  saveSlotsDiv.innerHTML = "";
  saves.forEach((save, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <b>${save.name}</b> (Money: ${save.money})
      <button onclick="loadSave(${i})">Play</button>
      <button onclick="renameSave(${i})">Rename</button>
      <button onclick="deleteSave(${i})">Delete</button>
    `;
    saveSlotsDiv.appendChild(div);
  });
}

newSaveBtn.onclick = () => {
  const name = prompt("Enter save name (optional):") || "Unnamed";
  const newSave = { name, money: 0, mps: 0, items: [] };
  saves.push(newSave);
  saveData();
  renderSaves();
};

function renameSave(i) {
  const newName = prompt("New name:", saves[i].name) || saves[i].name;
  saves[i].name = newName;
  saveData();
  renderSaves();
}

function deleteSave(i) {
  if (confirm("Delete this save?")) {
    saves.splice(i, 1);
    saveData();
    renderSaves();
  }
}

function loadSave(i) {
  activeSave = i;
  document.getElementById("save-name").textContent = saves[i].name;
  showScreen("game-screen");
  startGameLoop();
}

function saveData() {
  localStorage.setItem("saves", JSON.stringify(saves));
}

renderSaves();

// ---------- game logic ----------
document.getElementById("click-btn").onclick = () => {
  const save = saves[activeSave];
  save.money += 1;
  saveData();
  updateUI();
};

function updateUI() {
  const save = saves[activeSave];
  document.getElementById("money").textContent = save.money.toFixed(0);
  document.getElementById("mps").textContent = save.mps.toFixed(1);
}

function startGameLoop() {
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(() => {
    const save = saves[activeSave];
    save.money += save.mps;
    saveData();
    updateUI();
  }, 1000);
}

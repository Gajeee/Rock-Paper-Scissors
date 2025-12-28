const TOTAL_ROUNDS = 5;

let humanScore = 0;
let computerScore = 0;
let round = 0;
let locked = false;

const humanScoreEl = document.getElementById("humanScore");
const computerScoreEl = document.getElementById("computerScore");
const roundPillEl = document.getElementById("roundPill");
const humanPickEl = document.getElementById("humanPick");
const computerPickEl = document.getElementById("computerPick");
const messageEl = document.getElementById("message");
const logEl = document.getElementById("log");

const resetBtn = document.getElementById("resetBtn");
const clearLogBtn = document.getElementById("clearLogBtn");
const choiceBtns = Array.from(document.querySelectorAll("[data-choice]"));

function setText(el, value) { el.textContent = value; }

function updateUI() {
  setText(humanScoreEl, String(humanScore));
  setText(computerScoreEl, String(computerScore));
  setText(roundPillEl, `Round ${round} / ${TOTAL_ROUNDS}`);
}

function getComputerChoice() {
  const r = Math.random();
  if (r < 1 / 3) return "rock";
  if (r < 2 / 3) return "paper";
  return "scissors";
}

function determineRoundWinner(humanChoice, computerChoice) {
  if (humanChoice === computerChoice) return "tie";
  const humanWins =
    (humanChoice === "rock" && computerChoice === "scissors") ||
    (humanChoice === "paper" && computerChoice === "rock") ||
    (humanChoice === "scissors" && computerChoice === "paper");
  return humanWins ? "human" : "computer";
}

function formatResult(winner, humanChoice, computerChoice) {
  if (winner === "tie") return `Tie: both chose ${humanChoice}.`;
  if (winner === "human") return `Round win: ${humanChoice} beats ${computerChoice}.`;
  return `Round loss: ${computerChoice} beats ${humanChoice}.`;
}

function addLog(text) {
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const item = document.createElement("div");
  item.className = "logItem";

  const t = document.createElement("div");
  t.className = "t";
  t.textContent = time;

  const b = document.createElement("div");
  b.className = "b";
  b.textContent = text;

  item.appendChild(t);
  item.appendChild(b);

  logEl.prepend(item);
}

function endGame() {
  locked = true;

  if (humanScore > computerScore) setText(messageEl, "Final: You win the game.");
  else if (computerScore > humanScore) setText(messageEl, "Final: Computer wins the game.");
  else setText(messageEl, "Final: Game ends in a tie.");

  addLog(messageEl.textContent);
  choiceBtns.forEach(btn => (btn.disabled = true));
}

function playRound(humanChoice) {
  if (locked) return;

  round += 1;

  const computerChoice = getComputerChoice();
  const winner = determineRoundWinner(humanChoice, computerChoice);

  setText(humanPickEl, humanChoice);
  setText(computerPickEl, computerChoice);

  if (winner === "human") humanScore += 1;
  if (winner === "computer") computerScore += 1;

  const resultText = formatResult(winner, humanChoice, computerChoice);
  setText(messageEl, resultText);

  updateUI();
  addLog(`Round ${round}: ${resultText} (Score: You ${humanScore} : ${computerScore} Computer)`);

  if (round >= TOTAL_ROUNDS) endGame();
}

function resetGame() {
  humanScore = 0;
  computerScore = 0;
  round = 0;
  locked = false;

  setText(humanPickEl, "—");
  setText(computerPickEl, "—");
  setText(messageEl, "Pick a move to start.");

  choiceBtns.forEach(btn => (btn.disabled = false));
  updateUI();
  addLog("Game reset.");
}

function clearLog() {
  logEl.innerHTML = "";
  addLog("Log cleared.");
}

choiceBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const choice = btn.getAttribute("data-choice");
    playRound(choice);
  });
});

resetBtn.addEventListener("click", resetGame);
clearLogBtn.addEventListener("click", clearLog);

updateUI();
addLog("Ready.");

// Game State
let startingScore = 301;
let scores = { team1: 301, team2: 301 };
let teamNames = { team1: 'Team 1', team2: 'Team 2' };
let activeTeam = 'team1';
let gameIsOver = false;

// DOM Elements - Screens
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');

// DOM Elements - Setup
const gameModeSelect = document.getElementById('game-mode');
const team1NameInput = document.getElementById('team1-name-input');
const team2NameInput = document.getElementById('team2-name-input');

// DOM Elements - Game
const gameTitle = document.getElementById('game-title');
const team1NameDisplay = document.getElementById('team1-name-display');
const team2NameDisplay = document.getElementById('team2-name-display');
const team1ScoreEl = document.getElementById('team1-score');
const team2ScoreEl = document.getElementById('team2-score');
const team1Panel = document.getElementById('team1-panel');
const team2Panel = document.getElementById('team2-panel');
const messageBoard = document.getElementById('message-board');
const scoreInput = document.getElementById('score-input');
const submitBtn = document.getElementById('submit-btn');

// --- PRE-GAME LOGIC ---
function startGame() {
    startingScore = parseInt(gameModeSelect.value);
    teamNames.team1 = team1NameInput.value || "Team 1";
    teamNames.team2 = team2NameInput.value || "Team 2";

    scores.team1 = startingScore;
    scores.team2 = startingScore;
    activeTeam = 'team1';
    gameIsOver = false;
    submitBtn.disabled = false;

    gameTitle.innerText = `${startingScore} Darts`;
    team1NameDisplay.innerText = teamNames.team1;
    team2NameDisplay.innerText = teamNames.team2;
    team1Panel.classList.add('active');
    team2Panel.classList.remove('active');
    messageBoard.innerText = `Game On! ${teamNames.team1} to throw.`;
    scoreInput.value = '';
    updateScoreUI();

    setupScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
}

function resetToSetup() {
    gameScreen.classList.add('hidden');
    setupScreen.classList.remove('hidden');
}

// --- GAMEPLAY LOGIC ---
function submitScore() {
    if (gameIsOver) return;

    let roundScore = parseInt(scoreInput.value);

    if (isNaN(roundScore) || roundScore < 0 || roundScore > 180) {
        messageBoard.innerText = "Please enter a valid score (0-180).";
        return;
    }

    let currentTeamScore = scores[activeTeam];
    let newScore = currentTeamScore - roundScore;

    if (newScore < 0) {
        messageBoard.innerText = `Bust! ${teamNames[activeTeam]} stays at ${currentTeamScore}.`;
        switchTurns();
    } 
    else if (newScore === 0) {
        scores[activeTeam] = 0;
        updateScoreUI();
        messageBoard.innerText = `WINNER! ${teamNames[activeTeam]} takes the game!`;
        gameIsOver = true;
        submitBtn.disabled = true;
    } 
    else {
        scores[activeTeam] = newScore;
        messageBoard.innerText = "Good arrows!";
        updateScoreUI();
        switchTurns();
    }

    scoreInput.value = '';
    scoreInput.focus();
}

function switchTurns() {
    if (activeTeam === 'team1') {
        activeTeam = 'team2';
        team1Panel.classList.remove('active');
        team2Panel.classList.add('active');
        messageBoard.innerText += ` ${teamNames.team2} to throw.`;
    } else {
        activeTeam = 'team1';
        team2Panel.classList.remove('active');
        team1Panel.classList.add('active');
        messageBoard.innerText += ` ${teamNames.team1} to throw.`;
    }
}

function updateScoreUI() {
    team1ScoreEl.innerText = scores.team1;
    team2ScoreEl.innerText = scores.team2;
}
// --- BACKGROUND ANIMATION LOGIC ---

function spawnBackgroundDarts() {
    const bgContainer = document.getElementById('dart-bg-container');
    const numberOfDarts = 8; // How many darts are on screen at once

    for (let i = 0; i < numberOfDarts; i++) {
        let dart = document.createElement('div');
        dart.classList.add('bg-dart');
        
        // Randomize the starting vertical position (10% to 90% of screen height)
        let startY = Math.floor(Math.random() * 80) + 10; 
        
        // Randomize how fast it flies (between 4 and 9 seconds)
        let flightDuration = Math.random() * 5 + 4; 
        
        // Randomize the delay before it appears so they don't all fly at once
        let startDelay = Math.random() * 8; 

        // Apply the random math to the dart's CSS
        dart.style.top = `${startY}vh`;
        dart.style.animationDuration = `${flightDuration}s`;
        dart.style.animationDelay = `${startDelay}s`;
        
        // Put the dart on the screen
        bgContainer.appendChild(dart);
    }
}

// Trigger the function immediately
spawnBackgroundDarts();
// --- EVENT LISTENERS ---

// Listen for the "Enter" key on the score input
scoreInput.addEventListener('keypress', function(event) {
    // Check if the key pressed was exactly 'Enter'
    if (event.key === 'Enter') {
        // Prevent the default action (useful to stop page reloads if inside a form)
        event.preventDefault(); 
        
        // Trigger the exact same function the button uses
        submitScore(); 
    }
});

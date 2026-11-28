
'use strict';

// Get all screens
const mainMenu = document.getElementById('mainMenu');
const playerScreen = document.getElementById('playerScreen');
const leaderboardScreen = document.getElementById('leaderboardScreen');
const exitScreen = document.getElementById('exitScreen');

// Show selected screen
function showScreen(screen) {

    mainMenu.classList.add('hidden');
    playerScreen.classList.add('hidden');
    leaderboardScreen.classList.add('hidden');
    exitScreen.classList.add('hidden');

    screen.classList.remove('hidden');
}

// PLAY GAME
document.getElementById('playButton').addEventListener('click', () => {

    showScreen(playerScreen);

});

// BACK TO MENU
document.getElementById('backButton').addEventListener('click', () => {

    showScreen(mainMenu);

});

// LEADERBOARD
document.getElementById('leaderboardButton').addEventListener('click', () => {

    showScreen(leaderboardScreen);

});

// BACK FROM LEADERBOARD
document.getElementById('leaderboardBackButton').addEventListener('click', () => {

    showScreen(mainMenu);

});

// EXIT
document.getElementById('exitButton').addEventListener('click', () => {

    showScreen(exitScreen);

});

// RETURN TO MENU
document.getElementById('returnButton').addEventListener('click', () => {

    showScreen(mainMenu);

});

// START MATCH
document.getElementById('beginButton').addEventListener('click', () => {

    const player1 = document.getElementById('player1Name').value.trim();
    const player2 = document.getElementById('player2Name').value.trim();

    // Save player names
    window.playerNames = {
        player1: player1 || 'Player 1',
        player2: player2 || 'Player 2'
    };

    console.log('Players:', window.playerNames);

    // Start the game
    window.gameStarted = true;

    playerScreen.classList.add('hidden');

});

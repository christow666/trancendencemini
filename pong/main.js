import { Game } from './Game.js';
import { Configs } from './config.js';


let game = null;
let isGameInitialized = false;
let animationFrameId = null;
const originalConfigs = Configs; // Store the original configuration

document.addEventListener('DOMContentLoaded', function() {
    const startMenu = document.getElementById('startMenu');
    startMenu.style.display = 'block';

    document.getElementById('mode1').addEventListener('click', function() {
        handleModeSelection(1);
    });

    document.getElementById('mode2').addEventListener('click', function() {
        handleModeSelection(2);
    });

    document.getElementById('mode3').addEventListener('click', function() {
        handleModeSelection(3);
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'm') {
            stopGame();
        }
    });
});

function deepCopy(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj; // Return primitive types and null as-is
    }

    // Create an empty object/array of the same type as obj
    const newObj = Array.isArray(obj) ? [] : {};

    // Iterate through each property of obj
    for (let key in obj) {
        // Special handling for THREE.Vector3 objects
        if (obj[key] instanceof THREE.Vector3) {
            newObj[key] = new THREE.Vector3().copy(obj[key]);
        } else {
            // Recursively copy nested properties
            newObj[key] = deepCopy(obj[key]);
        }
    }

    return newObj; // Return the new deep copy
}

async function handleModeSelection(mode) {
    if (game) {
        stopGame();
    }

    // Create a deep copy of the original configuration
    let newConfig = deepCopy(originalConfigs);

    // Modify the configuration based on the selected mode
    if (mode === 2) {
        newConfig.ballConfigurations.duplicateBall = 1;
    } else if (mode === 3) {
        newConfig.paddles.leftPaddle.height = 10;
        newConfig.paddles.rightPaddle.height = 10;
    }

    game = new Game();
    document.getElementById('startMenu').style.display = 'none';
    await game.initialize(newConfig);
    isGameInitialized = true;

    renderGameScene(); // Render the game scene
    animate();
}

function renderGameScene() {
    const gameContainer = document.getElementById('gameContainer');
    // Clear the container
    gameContainer.innerHTML = '';
    // Append the new scene to the container
    gameContainer.appendChild(game.renderer.domElement);
}

function stopGame() {
    if (game) {
        game.clearScene();
        game = null;
        isGameInitialized = false; // Reset the initialization flag
    }
    cancelAnimationFrame(animationFrameId);
    document.getElementById('startMenu').style.display = 'block';
}

let isPaused = false;
let timeScale = 1;

function handleKeyPress(event) {
    if (event.key === 'p') {
        togglePause();
    } else if (event.key === 'r') {
        resetGame();
    }
}

function resetGame() {
    if (game && game.endGameManager) {
        game.endGameManager.resetGame();
        if (isPaused) {
            togglePause();
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        // Pause the game
        timeScale = 0; // Set time scale to 0 to pause
    } else {
        // Resume the game
        timeScale = 1; // Set time scale back to normal
        requestAnimationFrame(animate); // Restart animation loop if resumed
    }
}

function animate() {

    // Render the frame
    if (!isPaused && game) { // Check if game is not paused
        game.leftPaddle.update();
        game.rightPaddle.update();
        game.ballContainer.update(game.leftPaddle.mesh, game.rightPaddle.mesh, game.topWall, game.bottomWall);
        game.renderer.render(game.scene, game.camera);
    }

    // Request next frame
    if (!isPaused) { // Request next frame only if not paused
        animationFrameId = requestAnimationFrame(animate);
    }
}


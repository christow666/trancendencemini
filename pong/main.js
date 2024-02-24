import { BallContainer } from './Ball.js';
import { Gui } from './Gui.js';
import { Wall } from './Wall.js';
import { Paddle } from './Paddle.js';
import { ScoreTracker } from './ScoreTracker.js';
import { EndGameManager } from './EndGameManager.js';
import { Scene } from './Scene.js';
import { objectConfigs } from './config.js';


//Create my scene
const myScene = new Scene();
const scene = myScene.getScene();
const camera = myScene.getCamera();
const renderer = myScene.getRenderer();

// Create GUI, EndGameManager and scoreTracker
const gui = new Gui(scene, objectConfigs.playerInfo);
await gui.initGui();

const endGameManager = new EndGameManager(scene, gui, objectConfigs.ballConfigurations.duplicateBall);
const scoreTracker = new ScoreTracker(gui, endGameManager, objectConfigs.playerInfo);
endGameManager.setScoreTracker(scoreTracker);

// Create ball container
let ballContainer = new BallContainer(scene, objectConfigs.ballConfigurations, scoreTracker);
endGameManager.setBallContainer(ballContainer);
endGameManager.setBallConfigurations(objectConfigs.ballConfigurations);
// Create walls
const topWall = new Wall(scene, objectConfigs.walls.topWall);
const bottomWall = new Wall(scene, objectConfigs.walls.bottomWall);

// Create paddles
const leftPaddle = new Paddle(scene, objectConfigs.paddles.leftPaddle, [topWall, bottomWall]);
const rightPaddle = new Paddle(scene, objectConfigs.paddles.rightPaddle, [topWall, bottomWall]);

let isPaused = false;
let timeScale = 1; // Normal time scale

// Function to handle key press event
function handleKeyPress(event) {
    // Check if the pressed key is 'p'
    if (event.key === 'p') {
        // Toggle pause
        togglePause();
    }
}

// Add event listener for 'keydown' event
document.addEventListener('keydown', handleKeyPress);

// Function to toggle pause
function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        // Pause the game
        timeScale = 0; // Set time scale to 0 to pause
    } else {
        // Resume the game
        timeScale = 1; // Set time scale back to normal
    }
}

function animate() {
    requestAnimationFrame(animate);

    if (endGameManager.doReset) {
        endGameManager.resetGame();
        if (isPaused)
            togglePause();
    }

    if (!isPaused) {
        // Update paddles' position
        leftPaddle.update();
        rightPaddle.update();

        ballContainer.update(leftPaddle.mesh, rightPaddle.mesh, topWall, bottomWall);

        // Render the scene
        renderer.render(scene, camera);
    }
}

// Call animate
animate();

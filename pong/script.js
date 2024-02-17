
import { Ball } from './Ball.js';
import { Gui } from './Gui.js';
import { Wall } from './Wall.js';
import { Paddle } from './Paddle.js';
import { ScoreTracker } from './ScoreTracker.js';

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(0, 0, 10); // Move the camera away from the origin
camera.lookAt(scene.position);

// Create GUI and scoreTracker
const gui = new Gui(scene);
const scoreTracker = new ScoreTracker(gui);

// Create balls
const ball = new Ball(scene, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.1, 0.1, 0), scoreTracker);

// Create walls
const topWall = new Wall(scene, 15, 0.1, 0.1, 0x0000ff, { x: 0, y: 5, z: 0 });
const bottomWall = new Wall(scene, 15, 0.1, 0.1, 0x0000ff, { x: 0, y: -5, z: 0 });

// Create paddles
const player1Paddle = new Paddle(scene, 1, 2, 1, 0xff0000, { x: -7, y: 0, z: 0 }, { up: 'w', down: 's' });
const player2Paddle = new Paddle(scene, 1, 2, 1, 0xff0000, { x: 7, y: 0, z: 0 }, { up: 'o', down: 'l' });

// Reset the game
function resetGame() {
    player1Score = 0;
    player2Score = 0;
    updatePlayerScores(player1Score, player2Score);
    resetBall();
}

// Listen for the 'r' key press to reset the game
document.addEventListener('keydown', event => {
    if (event.key === 'r') {
        hideMessage(); // Hide the message
        resetGame();
    }
});

// Define the message element
const messageElement = document.getElementById('message');

// Function to show the message with the given text
function showMessage(text) {
    messageElement.innerText = text;
    messageElement.style.display = 'block'; // Show the message
}

// Function to hide the message
function hideMessage() {
    messageElement.style.display = 'none'; // Hide the message
}

function endGame() {
    showMessage('Game Over! Press "r" to reset.');
}

// Update ball's position and handle collisions
function animate() {
    requestAnimationFrame(animate);

    // // Update paddles' position
    // updatePaddles();
    player1Paddle.update();
    player2Paddle.update();

    // Update ball's position
    ball.update(player1Paddle.mesh, player2Paddle.mesh, topWall, bottomWall);

    // Render the scene
    renderer.render(scene, camera);
}

animate();

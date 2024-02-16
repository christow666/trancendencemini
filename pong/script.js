
import { Ball } from './Ball.js';
import { Gui } from './Gui.js';
import { Wall } from './Wall.js';

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(0, 0, 10); // Move the camera away from the origin
camera.lookAt(scene.position);

const ball = new Ball(scene, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.1, 0.1, 0));

// Define variables to keep track of player scores
let player1Score = 0;
let player2Score = 0;

const gui = new Gui(scene);
gui.createPongText();

// Call the function to create or update player score text objects with custom positions
gui.createOrUpdatePlayerScoreText(1, player1Score, { x: -5, y: 5.3, z: 0 }).then(player1ScoreMesh => {});
gui.createOrUpdatePlayerScoreText(2, player2Score, { x: 4.9, y: 5.3, z: 0 }).then(player2ScoreMesh => {});


// Create walls
const topWall = new Wall(scene, 15, 0.1, 0.1, 0x0000ff, { x: 0, y: 5, z: 0 });
const bottomWall = new Wall(scene, 15, 0.1, 0.1, 0x0000ff, { x: 0, y: -5, z: 0 });


// Create paddles
const paddleGeometry = new THREE.BoxGeometry(1, 2, 1);
const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const player1Paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
const player2Paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
player1Paddle.position.set(-7, 0, 0); // Set paddle position to z = 0
player2Paddle.position.set(7, 0, 0); // Set paddle position to z = 0
scene.add(player1Paddle, player2Paddle);

// Set up player controls
const player1Speed = 0.2;
const player2Speed = 0.2;

// Set up player controls
let player1MoveUp = false;
let player1MoveDown = false;
let player2MoveUp = false;
let player2MoveDown = false;


document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'w':
            player1MoveUp = true;
            break;
        case 's':
            player1MoveDown = true;
            break;
        case 'o':
            player2MoveUp = true;
            break;
        case 'l':
            player2MoveDown = true;
            break;
    }
});

document.addEventListener('keyup', event => {
    switch (event.key) {
        case 'w':
            player1MoveUp = false;
            break;
        case 's':
            player1MoveDown = false;
            break;
        case 'o':
            player2MoveUp = false;
            break;
        case 'l':
            player2MoveDown = false;
            break;
    }
});

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

// Update player paddles' position based on key events
function updatePaddles() {
    if (player1MoveUp && player1Paddle.position.y < 4) {
        player1Paddle.position.y += player1Speed;
    }
    if (player1MoveDown && player1Paddle.position.y > -4) {
        player1Paddle.position.y -= player1Speed;
    }
    if (player2MoveUp && player2Paddle.position.y < 4) {
        player2Paddle.position.y += player2Speed;
    }
    if (player2MoveDown && player2Paddle.position.y > -4) {
        player2Paddle.position.y -= player2Speed;
    }
}

// Define a cooldown duration (0.5 seconds)
const paddleCollisionCooldown = 500; // in milliseconds

// Keep track of the last collision time for each paddle
let lastPlayer1CollisionTime = 0;
let lastPlayer2CollisionTime = 0;

// Function to reset the ball position and velocity
function resetBall() {
    ball.position.set(0, 0, 0); // Reset ball position to z = 0
    ballVelocity.x *= Math.random() > 0.5 ? 1 : -1; // Reset ball velocity (randomize direction)
    ballVelocity.y = Math.random() * 0.1 - 0.05;
}

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

    // Update paddles' position
    updatePaddles();

    // Update ball's position
    ball.update(player1Paddle, player2Paddle, topWall, bottomWall);

    // Render the scene
    renderer.render(scene, camera);
}

animate();

// Update player scores using the GUI instance
gui.updatePlayerScores(player1Score, player2Score);
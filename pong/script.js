
import { Ball } from './Ball.js';
import { Gui } from './Gui.js';
import { Wall } from './Wall.js';
import { Paddle } from './Paddle.js';
import { ScoreTracker } from './ScoreTracker.js';
import { EndGameManager } from './EndGameManager.js';

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Color, Intensity
scene.add(ambientLight);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // Color, Intensity
directionalLight.position.set(0.5, 1, 1); // Set light position (from top-right-front)
scene.add(directionalLight);

camera.position.set(0, 0, 10); // Move the camera away from the origin
camera.lookAt(scene.position);

// Create GUI and scoreTracker
const gui = new Gui(scene);
const endGameManager = new EndGameManager(scene, gui);
const scoreTracker = new ScoreTracker(gui, endGameManager);

// Create an array to store ball instances
const balls = [];

// Create balls
const ballPositions = [
    { position: new THREE.Vector3(0, 0, 0), velocity: new THREE.Vector3(0.1, 0.1, 0) },
    // Add more positions and velocities as needed
];

function initBalls() {
    for (let i = 0; i < 0 ; i++){
        ballPositions.push({ position: new THREE.Vector3(0, 0, 0), velocity: new THREE.Vector3(0.1, 0.1, 0) });
    }

}
initBalls();

ballPositions.forEach(pos => {
    const ball = new Ball(scene, pos.position, pos.velocity, scoreTracker);
    balls.push(ball);
});


// Set balls in the endgame manager
balls.forEach(ball => endGameManager.addBall(ball));


endGameManager.setScoreTracker(scoreTracker);

// Create walls
const topWall = new Wall(scene, 15, 0.1, 0.1, 0x0000ff, { x: 0, y: 5, z: 0 });
const bottomWall = new Wall(scene, 15, 0.1, 0.1, 0x0000ff, { x: 0, y: -5, z: 0 });

// Create paddles
const player1Paddle = new Paddle(scene, 1, 2, 1, 0xff0000, { x: -7, y: 0, z: 0 }, { up: 'w', down: 's' });
const player2Paddle = new Paddle(scene, 1, 2, 1, 0xff0000, { x: 7, y: 0, z: 0 }, { up: 'o', down: 'l' });


// Update ball's position and handle collisions
function animate() {
    requestAnimationFrame(animate);

    // // Update paddles' position
    player1Paddle.update();
    player2Paddle.update();

    // Update ball's position
    // ball.update(player1Paddle.mesh, player2Paddle.mesh, topWall, bottomWall);
    balls.forEach(ball => {
        ball.update(player1Paddle.mesh, player2Paddle.mesh, topWall, bottomWall);
    });

    // Render the scene
    renderer.render(scene, camera);
}

animate();

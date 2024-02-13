// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(0, 0, 10); // Move the camera away from the origin
camera.lookAt(scene.position);

// Create ball geometry and material
const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
scene.add(ball);

// Set initial position of the ball
ball.position.set(0, 0, 0); // Set ball position to z = 0

// Define ball velocity
let ballVelocity = new THREE.Vector3(0.0, 0.1, 0.0);

// Create walls
const wallGeometry = new THREE.BoxGeometry(15, 0.1, 0.1);
const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const topWall = new THREE.Mesh(wallGeometry, wallMaterial);
topWall.position.set(0, 5, 0);
const bottomWall = new THREE.Mesh(wallGeometry, wallMaterial);
bottomWall.position.set(0, -5, 0);
scene.add(topWall, bottomWall);

// Create paddles
const paddleGeometry = new THREE.BoxGeometry(0.5, 2, 1);
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

function checkCollision(ballMesh, paddleMesh) {
    // Get positions of the ball and the paddle
    const ballPosition = ballMesh.position;
    const paddlePosition = paddleMesh.position;

    // Calculate the distance between the centers of the ball and the paddle
    const distance = ballPosition.distanceTo(paddlePosition);

    // If the distance is less than or equal to the sum of the ball's radius and half of the paddle's width,
    // it means they are colliding
    if (distance <= ballMesh.geometry.parameters.radius + paddleMesh.geometry.parameters.width / 2) {
        return true; // Collision detected
    } else {
        return false; // No collision
    }
}

// Update ball's position and handle collisions
function animate() {
    requestAnimationFrame(animate);

    // Update paddles' position
    updatePaddles();

    // Update ball's position
    ball.position.add(ballVelocity);

    // Check for collisions with walls
    if (ball.position.y >= topWall.position.y || ball.position.y <= bottomWall.position.y) {
        ballVelocity.y *= -1; // Reverse direction on collision with top or bottom walls
    }

    // Check for collisions with paddles
    if (checkCollision(ball, player1Paddle)) {
        ballVelocity.x *= -1; // Reverse direction on collision with player 1's paddle
    }
    if (checkCollision(ball, player2Paddle)) {
        ballVelocity.x *= -1; // Reverse direction on collision with player 2's paddle
    }
    // Check for collisions with walls
    // if (checkCollision(ball, topWall) || checkCollision(ball, bottomWall)) {
    //     ballVelocity.y *= -1; // Reverse direction on collision with top or bottom walls
    // }

    // Check for scoring
    if (ball.position.x <= -10 || ball.position.x >= 10) {
        // Reset ball position
        ball.position.set(0, 0, 0); // Reset ball position to z = 0
        // Reset ball velocity (randomize direction)
        ballVelocity.x *= Math.random() > 0.5 ? 1 : -1;
        ballVelocity.y = Math.random() * 0.1 - 0.05;

    }

    // Render the scene
    renderer.render(scene, camera);
}
animate();

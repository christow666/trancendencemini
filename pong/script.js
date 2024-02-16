// import {
//     endGame 
// }
// from "./endGame.js"

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
let ballVelocity = new THREE.Vector3(0.1, 0.1, 0.0);
ballVelocity.x *= Math.random() > 0.5 ? 1 : -1;
ballVelocity.y = Math.random() * 0.1 - 0.05;

// Create walls
const wallGeometry = new THREE.BoxGeometry(15, 0.1, 0.1);
const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const topWall = new THREE.Mesh(wallGeometry, wallMaterial);
topWall.position.set(0, 5, 0);
const bottomWall = new THREE.Mesh(wallGeometry, wallMaterial);
bottomWall.position.set(0, -5, 0);
scene.add(topWall, bottomWall);

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

function checkWallCollision(ballMesh, wallMesh) {
    // Define a raycaster
    const raycaster = new THREE.Raycaster();

    // Get the position of the ball
    const ballPosition = ballMesh.position.clone();

    // Define a direction vector towards the wall
    let direction;
    if (wallMesh.position.y > 0) {
        // Top wall
        direction = new THREE.Vector3(0, -1, 0);
    } else {
        // Bottom wall
        direction = new THREE.Vector3(0, 1, 0);
    }

    // Set the origin of the raycaster to the ball's position
    raycaster.set(ballPosition, direction);

    // Check for intersections with the wall
    const intersects = raycaster.intersectObject(wallMesh);

    // If there is an intersection and the distance is less than the ball's radius,
    // it means a collision occurred
    if (intersects.length > 0 && intersects[0].distance < ballMesh.geometry.parameters.radius) {
        return true; // Collision detected
    } else {
        return false; // No collision
    }
}

function checkCollision(ballMesh, paddleMesh) {
    // Define a raycaster
    const raycaster = new THREE.Raycaster();

    // Get the position of the ball
    const ballPosition = ballMesh.position.clone();

    // Get the direction from the ball to the paddle
    const direction = paddleMesh.position.clone().sub(ballPosition).normalize();

    // Set the origin of the raycaster to the ball's position
    raycaster.set(ballPosition, direction);

    // Check for intersections with the paddle
    const intersects = raycaster.intersectObject(paddleMesh);

    // If there is an intersection and the distance is less than the ball's radius,
    // it means a collision occurred
    if (intersects.length > 0 && intersects[0].distance < ballMesh.geometry.parameters.radius) {
        // Calculate the offset from the center of the paddle
        const offset = intersects[0].point.y - paddleMesh.position.y;
        
        // Normalize the offset to [-1, 1]
        const normalizedOffset = offset / (paddleMesh.geometry.parameters.height / 2);
        
        // Adjust the y velocity based on the offset
        ballVelocity.y = normalizedOffset * 0.2; // Adjust the factor as needed
        
        return true; // Collision detected
    } else {
        return false; // No collision
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

// Define variables to keep track of player scores
let player1Score = 0;
let player2Score = 0;

// Function to create the text object for player scores with custom positions
function createPlayerScoreText(player, score, position) {
    const text = `Player ${player}: ${score}`;
    const fontLoader = new THREE.FontLoader();

    return new Promise((resolve, reject) => {
        // Load a font (you can use a different font if you have one)
        fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function (font) {
            const textGeometry = new THREE.TextGeometry(text, {
                font: font,
                size: 0.5, // Size of the text
                height: 0.1, // Thickness of the text
                curveSegments: 12, // Number of points on the curves
                bevelEnabled: false // Disable bevel for simplicity
            });

            // Center the text geometry
            textGeometry.computeBoundingBox();
            const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
            textGeometry.translate(-0.5 * textWidth, 0, 0);

            // Create a basic material for the text
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

            // Create a mesh for the text
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            // Position the text based on the custom position
            textMesh.position.set(position.x, position.y, position.z);

            // Add the text mesh to the scene
            scene.add(textMesh);

            // Resolve the promise with the created text mesh
            resolve(textMesh);
        });
    });
}

// Call the function to create player score text objects with custom positions
createPlayerScoreText(1, 0, { x: -5, y: 5.3, z: 0 }).then(player1ScoreMesh => {
    player1ScoreMesh.name = 'player1ScoreText'; // Set name for identification
});
createPlayerScoreText(2, 0, { x: 4.9, y: 5.3, z: 0 }).then(player2ScoreMesh => {
    player2ScoreMesh.name = 'player2ScoreText'; // Set name for identification
});


// Function to update the player scores
function updatePlayerScores(player1Score, player2Score) {
    const player1Text = `Player 1: ${player1Score}`;
    const player2Text = `Player 2: ${player2Score}`;

    // Update Player 1 score text
    const player1ScoreMesh = scene.getObjectByName('player1ScoreText');
    if (player1ScoreMesh) {
        player1ScoreMesh.geometry.dispose(); // Dispose the old geometry
        createPlayerScoreText(1, player1Score, player1ScoreMesh.position).then(newTextMesh => {
            scene.remove(player1ScoreMesh); // Remove the old text mesh
            newTextMesh.name = 'player1ScoreText'; // Set name for identification
        });
    }

    // Update Player 2 score text
    const player2ScoreMesh = scene.getObjectByName('player2ScoreText');
    if (player2ScoreMesh) {
        player2ScoreMesh.geometry.dispose(); // Dispose the old geometry
        createPlayerScoreText(2, player2Score, player2ScoreMesh.position).then(newTextMesh => {
            scene.remove(player2ScoreMesh); // Remove the old text mesh
            newTextMesh.name = 'player2ScoreText'; // Set name for identification
        });
    }
}

function endGame() {
    
}


// Update ball's position and handle collisions
function animate() {
    requestAnimationFrame(animate);

    // Update paddles' position
    updatePaddles();

    // Update ball's position
    ball.position.add(ballVelocity);

    // Check for collisions with walls
    if (checkWallCollision(ball, topWall) || checkWallCollision(ball, bottomWall)) {
        ballVelocity.y *= -1; // Reverse direction on collision with top or bottom walls
    }

    // Check for collisions with walls
    if (ball.position.y >= topWall.position.y || ball.position.y <= bottomWall.position.y) {
        ballVelocity.y *= -1; // Reverse direction on collision with top or bottom walls
    }

    // Check for collisions with paddles
    const currentTime = Date.now();
    if (checkCollision(ball, player1Paddle) && currentTime - lastPlayer1CollisionTime >= paddleCollisionCooldown) {
        ballVelocity.x *= -1; // Reverse direction on collision with player 1's paddle
        lastPlayer1CollisionTime = currentTime; // Update last collision time
    }
    if (checkCollision(ball, player2Paddle) && currentTime - lastPlayer2CollisionTime >= paddleCollisionCooldown) {
        ballVelocity.x *= -1; // Reverse direction on collision with player 2's paddle
        lastPlayer2CollisionTime = currentTime; // Update last collision time
    }

    // Check for scoring
    if (ball.position.x <= -10) {
        // Player 2 scores
        player2Score++;
        updatePlayerScores(player1Score, player2Score);
        if (player2Score == 3) {
            console.log("p2 win");
            endGame();
        }
        else
            resetBall();
    } else if (ball.position.x >= 10) {
        // Player 1 scores
        player1Score++;
        updatePlayerScores(player1Score, player2Score);
        if (player1Score == 3) {
            console.log("p1 win");
            endGame();
        }
        else
            resetBall();
    }

    // Render the scene
    renderer.render(scene, camera);
}

// Function to create the "Pong" text object
function createPongText() {
    const text = "Pong";
    const fontLoader = new THREE.FontLoader();

    // Load a font (you can use a different font if you have one)
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function (font) {
        const textGeometry = new THREE.TextGeometry(text, {
            font: font,
            size: 1, // Size of the text
            height: 0.1, // Thickness of the text
            curveSegments: 12, // Number of points on the curves
            bevelEnabled: false // Disable bevel for simplicity
        });

        // Center the text geometry
        textGeometry.computeBoundingBox();
        const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
        textGeometry.translate(-0.5 * textWidth, 0, 0);

        // Create a basic material for the text
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

        // Create a mesh for the text
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // Position the text in the center of the scene
        textMesh.position.set(0, 6.5, 0); // Adjust position as needed

        // Add the text mesh to the scene
        scene.add(textMesh);
    });
}

// Call the function to create "Pong" text
createPongText();



animate();

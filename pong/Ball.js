export class Ball {
    constructor(scene, position, velocity, scoreTracker) {
        this.geometry = new THREE.SphereGeometry(0.5, 32, 32);
        this.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene = scene;
        this.scoreTracker = scoreTracker; // Added scoreTracker property

        // Set initial position of the ball
        this.mesh.position.copy(position); // Set ball position

        // Set initial velocity of the ball
        this.velocity = velocity.clone();

        // Add the ball mesh to the scene
        this.scene.add(this.mesh);

        // Initialize last collision time for paddles
        this.lastPlayer1CollisionTime = 0;
        this.lastPlayer2CollisionTime = 0;
        this.paddleCollisionCooldown = 500; // Adjust the cooldown time as needed
    }

    update(player1Paddle, player2Paddle, topWall, bottomWall) {
        // Update ball's position
        this.mesh.position.add(this.velocity);

        // Check for collisions with walls

        if (this.mesh.position.y >= topWall.position.y || this.mesh.position.y <= bottomWall.position.y) {
            this.velocity.y *= -1; // Reverse direction on collision with top or bottom walls
        }

        // Check for collisions with paddles
        const currentTime = Date.now();
        if (this.checkCollision(player1Paddle) && currentTime - this.lastPlayer1CollisionTime >= this.paddleCollisionCooldown) {
            // Calculate the offset from the center of the paddle
            const offset = this.mesh.position.y - player1Paddle.position.y;
            
            // Normalize the offset to [-1, 1]
            const normalizedOffset = offset / (player1Paddle.geometry.parameters.height / 2);
            
            // Adjust the y velocity based on the offset
            this.velocity.y = normalizedOffset * 0.2; // Adjust the factor as needed
            
            // Reverse direction on collision with player 1's paddle
            this.velocity.x *= -1;
            this.lastPlayer1CollisionTime = currentTime; // Update last collision time
        }
        if (this.checkCollision(player2Paddle) && currentTime - this.lastPlayer2CollisionTime >= this.paddleCollisionCooldown) {
            // Calculate the offset from the center of the paddle
            const offset = this.mesh.position.y - player2Paddle.position.y;
            
            // Normalize the offset to [-1, 1]
            const normalizedOffset = offset / (player2Paddle.geometry.parameters.height / 2);
            
            // Adjust the y velocity based on the offset
            this.velocity.y = normalizedOffset * 0.2; // Adjust the factor as needed
            
            // Reverse direction on collision with player 2's paddle
            this.velocity.x *= -1;
            this.lastPlayer2CollisionTime = currentTime; // Update last collision time
        }

        // Check for scoring
        if (this.mesh.position.x <= -10) {
            this.scoreTracker.incrementPlayer2Score();
            this.reset();
        }
        else if (this.mesh.position.x >= 10) {
            this.scoreTracker.incrementPlayer1Score();
            this.reset();
        }
    }

    checkCollision(paddleMesh) {
        // Calculate the distance between the centers of the ball and the paddle
        const ballPosition = this.mesh.position;
        const paddlePosition = paddleMesh.position;
        const distance = ballPosition.distanceTo(paddlePosition);

        // If the distance is less than or equal to the sum of the ball's radius and half of the paddle's width, it means they are colliding
        return distance <= this.geometry.parameters.radius + paddleMesh.geometry.parameters.width / 2;
    }

    reset() {
        // Reset ball position and velocity
        this.mesh.position.set(0, 0, 0); // Reset ball position to z = 0
        this.velocity.x *= Math.random() > 0.5 ? 1 : -1; // Reset ball velocity (randomize direction)
        this.velocity.y = Math.random() * 0.1 - 0.05;
    }
}

export class BallContainer {
    constructor(scene, balls, scoreTracker) {
        this.scene = scene;
        this.balls = balls.map(ball => new Ball(scene, ball.position, ball.velocity, scoreTracker));
    }

    update(player1Paddle, player2Paddle, topWall, bottomWall) {
        this.balls.forEach(ball => {
            ball.update(player1Paddle, player2Paddle, topWall, bottomWall);
        });
    }

    freezeAll() {
        this.balls.forEach(ball => {
            ball.freeze();
        });
    }
}

export class Ball {
    constructor(scene, position, velocity, scoreTracker) {
        this.geometry = new THREE.SphereGeometry(0.5, 32, 32);
        this.material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene = scene;
        this.velocity = velocity;
        this.maxVelocity = 0.1;
        this.scoreTracker = scoreTracker; // Added scoreTracker property

        // Set initial position of the ball
        this.mesh.position.copy(position); // Set ball position

        // Set initial velocity of the ball
        this.reset();

        // Add the ball mesh to the scene
        this.scene.add(this.mesh);

        // Initialize last collision time for paddles
        this.lastPlayerCollisionTime = 0;
        this.lastPlayer2CollisionTime = 0;
        this.paddleCollisionCooldown = 500; // Adjust the cooldown time as needed

        // Create a raycaster instance
        this.raycaster = new THREE.Raycaster(
            this.position,
            new THREE.Vector3(0, 0, 0),
            0,
            0.8
        );
    }

    update(player1Paddle, player2Paddle, topWall, bottomWall) {
        // Update ball's position
        this.mesh.position.add(this.velocity);

        // Check for collisions with walls
        if (this.checkCollisionWall(topWall.mesh) || this.checkCollisionWall(bottomWall.mesh)) {
            this.velocity.y *= -1; // Reverse direction on collision with top or bottom walls
        }

        // Check for collisions with paddles
        const currentTime = Date.now();
        if (this.checkCollision(player1Paddle) && currentTime - this.lastPlayerCollisionTime >= this.paddleCollisionCooldown) {
            // Calculate the offset from the center of the paddle
            const offset = this.mesh.position.y - player1Paddle.position.y;

            // Normalize the offset to [-1, 1]
            const normalizedOffset = offset / (player1Paddle.geometry.parameters.height / 2);

            // Adjust the y velocity based on the offset
            this.velocity.y = normalizedOffset * this.maxVelocity * 0.2;

            // Increase the total velocity by 10%
            this.maxVelocity *= 1.01;
            this.velocity.x *= 1.01;

            // Reverse direction on collision with player 1's paddle
            this.velocity.x *= -1;
            this.lastPlayerCollisionTime = currentTime; // Update last collision time

            // let totalVelocity = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
            // console.log(totalVelocity);
        }
        else if (this.checkCollision(player2Paddle) && currentTime - this.lastPlayerCollisionTime >= this.paddleCollisionCooldown) {
            // Calculate the offset from the center of the paddle
            const offset = this.mesh.position.y - player2Paddle.position.y;

            
            // Normalize the offset to [-1, 1]
            const normalizedOffset = offset / (player2Paddle.geometry.parameters.height / 2);

            // Adjust the y velocity based on the offset
            this.velocity.y = normalizedOffset * this.maxVelocity * 0.2;

            // Increase the total velocity by 10%
            this.maxVelocity *= 1.01;
            this.velocity.x *= 1.01;
        

            // Reverse direction on collision with player 2's paddle
            this.velocity.x *= -1;
            this.lastPlayerCollisionTime = currentTime; // Update last collision time

            // let totalVelocity = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
            // console.log(totalVelocity);
        }

        

        // Check for scoring
        if (this.mesh.position.x <= -10) {
            this.reset();
            this.scoreTracker.incrementPlayer2Score();
        }
        else if (this.mesh.position.x >= 10) {
            this.reset();
            this.scoreTracker.incrementPlayer1Score();
        }
    }

    checkCollisionWall(Mesh) {
        // Set up the raycaster's origin and direction based on the ball's position and velocity
        this.raycaster.set(this.mesh.position, this.velocity.clone().normalize());
    
        // Check for intersection between the ray and the paddle's mesh
        const intersects = this.raycaster.intersectObject(Mesh);
    
        // If there's an intersection, it means the ball has collided with the paddle
        return intersects.length > 0;
    }

    checkCollision(paddleMesh) {
        // Set up the raycaster's origin and direction based on the ball's position and velocity
        this.raycaster.set(this.mesh.position, this.velocity.clone().normalize());
    
        // Check for intersection between the ray and the paddle's mesh
        const intersectsMain = this.raycaster.intersectObject(paddleMesh);
    
        // If there's an intersection, it means the ball has collided with the paddle
        if (intersectsMain.length > 0) {
            return true;
        }
    
        // Set up a raycaster with a slight offset in the positive Y direction
        this.raycaster.set(
            new THREE.Vector3(this.mesh.position.x, this.mesh.position.y + 0.5, this.mesh.position.z), 
            this.velocity.clone().normalize()
        );
    
        // Check for intersection with paddle for raycaster with positive Y offset
        const intersectsOffsetPositiveY = this.raycaster.intersectObject(paddleMesh);
        if (intersectsOffsetPositiveY.length > 0) {
            return true;
        }
    
        // Set up a raycaster with a slight offset in the negative Y direction
        this.raycaster.set(
            new THREE.Vector3(this.mesh.position.x, this.mesh.position.y - 0.5, this.mesh.position.z), 
            this.velocity.clone().normalize()
        );
    
        // Check for intersection with paddle for raycaster with negative Y offset
        const intersectsOffsetNegativeY = this.raycaster.intersectObject(paddleMesh);
        if (intersectsOffsetNegativeY.length > 0) {
            return true;
        }
    
        // No collision detected
        return false;
    }
    
    reset() {
        // Reset ball position and velocity
        this.mesh.position.set(0, 0, 0); // Reset ball position to z = 0
        this.velocity.x = 0.1 * (Math.random() > 0.5 ? 1 : -1); // Reset ball velocity (randomize direction)
        this.velocity.y = Math.random() * 0.1 - 0.05;
        // this.velocity.y = 0;

        // Ensure maximum velocity
        this.velocity.clampLength(0, 0.05);
        this.maxVelocity = 0.1;
    }

    freeze() {
        this.mesh.position.set(0, 0, 0); // Reset ball position to z = 0
        this.velocity.x = 0;
        this.velocity.y = 0;
    }
}

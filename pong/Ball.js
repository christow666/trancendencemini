import { CollisionManager } from './CollisionManager.js';

// BallContainer.js
export class BallContainer {
    constructor(scene, ballConfigurations, scoreTracker) {
        this.scene = scene;
        this.balls = [];
        this.collisionManager = new CollisionManager();

        // Initialize ball configurations
        this.ballConfigurations = ballConfigurations;

        const numberOfBallsToAdd = ballConfigurations.numberOfBalls;
        for (let i = 0; i < numberOfBallsToAdd; i++) {
            const ball = new Ball(scene, ballConfigurations, scoreTracker, this, this.collisionManager); // Pass the collisionManager
            this.balls.push(ball);
        }
    }

    initBallPool(poolSize) {
        for (let i = 0; i < poolSize; i++) {
            const ball = new Ball(this.scene, this.ballConfigurations, this.scoreTracker, this, this.collisionManager);
            this.ballPool.push(ball);
        }
    }

    getBallFromPool() {
        if (this.ballPool.length > 0) {
            return this.ballPool.pop();
        } else {
            console.warn('Ball pool exhausted. Creating new ball.');
            return new Ball(this.scene, this.ballConfigurations, this.scoreTracker, this, this.collisionManager);
        }
    }

    releaseBallToPool(ball) {
        ball.reset(); // Reset ball properties
        this.ballPool.push(ball); // Return ball to pool
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

// Ball.js
export class Ball {
    constructor(scene, ballConfigurations, scoreTracker, container, collisionManager) {
        this.scene = scene;
        this.container = container;
        this.collisionManager = collisionManager;
        this.geometry = new THREE.SphereGeometry(ballConfigurations.size, 32, 32);
        this.material = new THREE.MeshStandardMaterial({ color: ballConfigurations.color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.velocity = ballConfigurations.velocity.clone();
        this.maxVelocity = ballConfigurations.maxVelocity;
        this.duplicateBall = ballConfigurations.duplicateBall;
        this.scoreTracker = scoreTracker;

        // Set initial position of the ball
        this.mesh.position.copy(ballConfigurations.position); // Set ball position

        // Set initial velocity of the ball
        this.velocity.x = 0.1 * (Math.random() > 0.5 ? 1 : -1); // Reset ball velocity (randomize direction)
        this.velocity.y = Math.random() * 0.1 - 0.05;
        this.velocity.clampLength(0, 0.05);
        // this.velocity.x = 0.01; // Reset ball velocity (randomize direction)
        // this.velocity.y = 0.005;

        // Add the ball mesh to the scene
        this.scene.add(this.mesh);

        // Initialize last collision time for paddles
        this.lastPlayerCollisionTime = Date.now();
        this.lastPlayer2CollisionTime = Date.now();
        this.paddleCollisionCooldown = 500; // Adjust the cooldown time as needed

        // Create a raycaster instance
        this.raycaster = new THREE.Raycaster(
            this.position,
            new THREE.Vector3(0, 0, 0),
            0,
            ballConfigurations.size
        );
    }



    update(player1Paddle, player2Paddle, topWall, bottomWall) {
        // Update ball's position
        this.mesh.position.add(this.velocity);

        // Check for collisions with walls
        if (this.checkCollisionWall(topWall.mesh, this.mesh, this.velocity, this.raycaster) || this.checkCollisionWall(bottomWall.mesh, this.mesh, this.velocity, this.raycaster)) {
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

            if (this.duplicateBall)
                this.createOppositeBall();
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

            if (this.duplicateBall)
                this.createOppositeBall();
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

    createOppositeBall() {
    // Create a new ball by cloning the current ball
        const oppositeBall = new Ball(this.scene, {
            position: this.mesh.position.clone(), // Clone current ball's position
            velocity: new THREE.Vector3(this.velocity.x, -this.velocity.y, 0), // Reverse y velocity
            size: this.geometry.parameters.radius, // Use current ball's size
            color: this.material.color.getHex(), // Use current ball's color
            maxVelocity: this.maxVelocity, // Use current ball's max velocity
            duplicateBall: this.duplicateBall,
            collisionManager: this.collisionManager,
        }, this.scoreTracker, this.container);

        // Add the new ball to the container
        this.container.balls.push(oppositeBall);

        // Add the new ball to the scene
        this.scene.add(oppositeBall.mesh);

        // return oppositeBall; // Return the new ball
    }

    removeFromContainer() {
        // Remove the ball from the container's array
        const index = this.container.balls.indexOf(this);
        if (index !== -1) {
            this.container.balls.splice(index, 1);
        }

        // Remove the ball from the scene
        this.scene.remove(this.mesh);
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

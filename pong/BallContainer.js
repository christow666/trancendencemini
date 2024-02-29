import { Ball } from './Ball.js'; // Import the Ball class from Ball.js
import { CollisionManager } from './CollisionManager.js';

// BallContainer.js
export class BallContainer {
    constructor(scene, ballConfigurations, scoreTracker) {
        this.scene = scene;
        this.balls = [];
        // this.ballPool = [];
        this.collisionManager = new CollisionManager();

        // Initialize ball configurations
        this.ballConfigurations = ballConfigurations;

        const numberOfBallsToAdd = ballConfigurations.numberOfBalls;
        for (let i = 0; i < numberOfBallsToAdd; i++) {
            const ball = new Ball(scene, ballConfigurations, scoreTracker, this, this.collisionManager); // Pass the collisionManager
            this.balls.push(ball);
        }
    }

    getBalls() {
        return this.balls;
    }

    // initBallPool(poolSize) {
    //     for (let i = 0; i < poolSize; i++) {
    //         const ball = new Ball(this.scene, this.ballConfigurations, this.scoreTracker, this, this.collisionManager);
    //         this.ballPool.push(ball);
    //     }
    // }

    // getBallFromPool() {
    //     if (this.ballPool.length > 0) {
    //         return this.ballPool.pop();
    //     } else {
    //         console.warn('Ball pool exhausted. Creating new ball.');
    //         return new Ball(this.scene, this.ballConfigurations, this.scoreTracker, this, this.collisionManager);
    //     }
    // }

    // releaseBallToPool(ball) {
    //     ball.reset(); // Reset ball properties
    //     this.ballPool.push(ball); // Return ball to pool
    // }

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

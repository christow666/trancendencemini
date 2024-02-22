export class EndGameManager {
    constructor(scene, gui) {
        this.scene = scene;
        this.gui = gui;
        this.balls = []; // Store multiple balls
        this.scoreTracker = null;

        // Bind event listener for keydown event
        this.handleKeyPress = this.handleKeyPress.bind(this);
        document.addEventListener('keydown', this.handleKeyPress);
    }
    
    addBall(ball) {
        this.balls.push(ball); // Add the provided ball instance to the array
    }

    setScoreTracker(scoreTracker) {
        this.scoreTracker = scoreTracker; // Assign the provided scoreTracker instance
    }

    // Method to handle key press event
    handleKeyPress(event) {
        if (event.key === 'r') {
            this.resetGame();
        }
    }
    
    // End game method
    endGame(winnerName) {
        this.balls.forEach(ball => {
            ball.freeze(); // Freeze all balls
        });
        this.gui.showEndGameMessage(winnerName);
    }

    // Method to reset the game
    resetGame() {
        this.scoreTracker.resetScores();
        this.gui.hideEndGameMessage();
        this.balls.forEach(ball => {
            ball.reset(); // Reset all balls
        });
        this.gui.resetScores();
    }

    // Cleanup method to remove event listener
    cleanup() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }
}


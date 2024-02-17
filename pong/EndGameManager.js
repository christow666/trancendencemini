export class EndGameManager {
    constructor(scene, gui) {
        this.scene = scene;
        this.gui = gui;
        this.ball = null;
        this.scoreTracker = null;

        // Bind event listener for keydown event
        this.handleKeyPress = this.handleKeyPress.bind(this);
        document.addEventListener('keydown', this.handleKeyPress);
    }
    
    setBall(ball) {
        this.ball = ball; // Assign the provided ball instance
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

    // Method to display endgame message
    showEndGameMessage() {
        this.gui.showEndGameMessage();
    }

    // Method to hide endgame message
    hideEndGameMessage() {
        this.gui.hideEndGameMessage();
    }

    //End game method
    endGame() {
        this.ball.freeze();
        this.showEndGameMessage();
    }

    // Method to reset the game
    resetGame() {
        this.scoreTracker.resetScores();
        this.hideEndGameMessage();
        this.ball.reset();
    }

    // Cleanup method to remove event listener
    cleanup() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }
}

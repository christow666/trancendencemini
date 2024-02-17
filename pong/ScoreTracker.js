export class ScoreTracker {
    constructor(gui, endGameManager) {
        this.player1Score = 0;
        this.player2Score = 0;
        this.gui = gui;
        this.endGameManager = endGameManager;
    }

    // Method to increment player 1's score
    incrementPlayer1Score() {
        this.player1Score++;
        this.gui.updatePlayerScores(this.player1Score, this.player2Score);
        if (this.player1Score === 3) {
            this.endGameManager.endGame();
        }
    }

    // Method to increment player 2's score
    incrementPlayer2Score() {
        this.player2Score++;
        this.gui.updatePlayerScores(this.player1Score, this.player2Score);
        if (this.player2Score === 3) {
            this.endGameManager.endGame();
        }
    }

    // Method to reset the scores
    resetScores() {
        this.player1Score = 0;
        this.player2Score = 0;
        this.gui.updatePlayerScores(this.player1Score, this.player2Score);
    }

    // Method to get player 1's score
    getPlayer1Score() {
        return this.player1Score;
    }

    // Method to get player 2's score
    getPlayer2Score() {
        return this.player2Score;
    }
}

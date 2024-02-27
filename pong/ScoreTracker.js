export class ScoreTracker {
    constructor(gui, endGameManager, playerInfo) {
        this.player1Score = 0;
        this.player2Score = 0;
        this.player1Name = playerInfo.player1Name;
        this.player2Name = playerInfo.player2Name;
        this.gui = gui;
        this.endGameManager = endGameManager;
    }

    // Method to increment player 1's score
    incrementPlayer1Score(ballValue) {
        // this.player1Score++;
        this.player1Score+= ballValue;
        this.gui.updatePlayerScores(this.player1Score, this.player2Score);
        if (this.player1Score >= 50) {
            console.log("p1 win")
            this.endGameManager.endGame(this.player1Name);
            return 0;
        }
        return 1;
    }

    // Method to increment player 2's score
    incrementPlayer2Score(ballValue) {
        // this.player2Score++;
        this.player2Score+= ballValue;
        this.gui.updatePlayerScores(this.player1Score, this.player2Score);
        if (this.player2Score >= 50) {
            console.log("p2 win")
            this.endGameManager.endGame(this.player2Name);
            return 0
        }
        return 1
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

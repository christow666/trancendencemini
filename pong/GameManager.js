// File: GameManager.js
import { Game } from './Game.js';
import { Configs } from './config.js';
import { SocketManager } from './SocketManager.js';

class GameManager {
    constructor() {
        this.game = null;
        this.isPaused = false;
        this.isMenued = true;
        this.animationFrameId = null;
        this.originalConfigs = Configs; // Store the original configuration
        // this.socketManager = new SocketManager();
        this.gameData = null;
        this.gameId = 'your-game-id';
        this.initializeMenu();
        this.initializeKeyPressListener(); // Add event listener for key presses
    }

    sendGameDataToServer() {
        this.socketManager.sendGameData(this.gameData);
    }

    serializeGameData() {
        if (this.isMenued)
            return
        const playerPositions = {
            "lp": {"x": this.game.leftPaddle.mesh.position.x,
                            "y": parseFloat(this.game.leftPaddle.mesh.position.y.toFixed(1))},
            "rp": {"x": this.game.rightPaddle.mesh.position.x,
                            "y": parseFloat(this.game.rightPaddle.mesh.position.y.toFixed(1))}
        };
        
        const ballPositions = this.game.ballContainer.getBalls().map(ball => {
            // ball.mesh.position.x = Math.round(number * 100) / 100
            // ball.mesh.position.y = Math.round(number * 100) / 100
            return {"x":parseFloat(ball.mesh.position.x.toFixed(1)) , "y": parseFloat(ball.mesh.position.y.toFixed(1))};
        });

    
        this.gameData = {
            // "gameId": this.gameId,
            "pp": playerPositions,
            "bp": ballPositions,
        };
    }

    initializeKeyPressListener() {
        document.addEventListener('keydown', (event) => this.handleKeyPress(event));
    }
    
    initializeMenu() {
        document.addEventListener('DOMContentLoaded', () => {
            const startMenu = document.getElementById('startMenu');
            startMenu.style.display = 'block';

            document.getElementById('mode1').addEventListener('click', () => this.handleModeSelection(1));
            document.getElementById('mode2').addEventListener('click', () => this.handleModeSelection(2));
            document.getElementById('mode3').addEventListener('click', () => this.handleModeSelection(3));
        });
    }

    async handleModeSelection(mode) {
        if (this.game) {
            this.stopGame();
        }

        let newConfig = this.deepCopy(this.originalConfigs);

        if (mode === 2) {
            newConfig.playerInfo.gameWinningScore = 50;
            newConfig.ballConfigurations.duplicateBall = 1;
            newConfig.playerInfo.gameModeName = "DupliPong";
            newConfig.paddles.rightPaddle.isAI = 1;
            newConfig.paddles.leftPaddle.isAI = 0;
        } else if (mode === 3) {
            newConfig.playerInfo.gameWinningScore = 500;
            newConfig.ballConfigurations.numberOfBalls = 1;
            newConfig.playerInfo.gameModeName = "Vs AI";
            newConfig.paddles.leftPaddle.height = 3;
            newConfig.paddles.rightPaddle.height = 3;
        	newConfig.paddles.rightPaddle.isAI = 1;
            newConfig.paddles.leftPaddle.isAI = 1;
        }

        this.game = new Game(this);
        document.getElementById('startMenu').style.display = 'none';
        await this.game.initialize(newConfig);
        this.isMenued = false;

        this.renderGameScene();
        this.animate();
    }

    animate() {
        if (!this.isPaused && this.game && !this.isMenued) {
            this.game.leftPaddle.update();
            this.game.rightPaddle.update();
            this.game.ballContainer.update(this.game.leftPaddle.mesh, this.game.rightPaddle.mesh, this.game.topWall, this.game.bottomWall);
            this.game.renderer.render(this.game.scene, this.game.camera);
        }

        // // Schedule serialization and logging every 2 seconds
        // if (!this.isPaused && !this.isMenued && !this.serializationTimeoutId) {
            // this.serializationTimeoutId = setTimeout(() => {
                this.serializeGameData();
                const jsonData = JSON.stringify(this.gameData)
                console.log(jsonData);
                // this.sendGameDataToServer(); // Uncomment this line to send game data to the server
                this.serializationTimeoutId = null;
        //     }, 2000);
        // }

        if (!this.isPaused && !this.isMenued)
            this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    renderGameScene() {
        const gameContainer = document.getElementById('gameContainer');
        gameContainer.innerHTML = '';
        gameContainer.appendChild(this.game.renderer.domElement);
    }

    stopGame() {
        if (this.game) {
            this.game.clearScene();
            this.game = null;
            this.isMenued = true;
        }
        cancelAnimationFrame(this.animationFrameId);
        document.getElementById('startMenu').style.display = 'block';
    }

    handleKeyPress(event) {
        if (event.key === 'p' && !this.isMenued){
            console.log("p")
            this.togglePause();
    }
        else if (event.key === 'r')
            this.resetGame();
        else if (event.key === 'm' && !this.isMenued){
            this.game.endGameManager.hideEndGameMessage();
            this.stopGame();
            if (this.isPaused)
                this.togglePause();   
        }
    }

    resetGame() {
        if (this.game && this.game.endGameManager) {
            this.game.endGameManager.resetGame();
            if (this.isPaused) {
                this.togglePause();
            }
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (!this.isPaused)
            requestAnimationFrame(() => this.animate());
    }

    deepCopy(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }

        const newObj = Array.isArray(obj) ? [] : {};

        for (let key in obj) {
            if (obj[key] instanceof THREE.Vector3) {
                newObj[key] = new THREE.Vector3().copy(obj[key]);
            } else {
                newObj[key] = this.deepCopy(obj[key]);
            }
        }

        return newObj;
    }
}

export { GameManager };

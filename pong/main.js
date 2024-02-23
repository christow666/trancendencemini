import { BallContainer } from './Ball.js';
import { Gui } from './Gui.js';
import { Wall } from './Wall.js';
import { Paddle } from './Paddle.js';
import { ScoreTracker } from './ScoreTracker.js';
import { EndGameManager } from './EndGameManager.js';
import { Scene } from './Scene.js';
import { objectConfigs } from './config.js';

//Create my scene
const myScene = new Scene();
const scene = myScene.getScene();
const camera = myScene.getCamera();
const renderer = myScene.getRenderer();

// Create GUI, EndGameManager and scoreTracker
const gui = new Gui(scene);
await gui.initGui();

const endGameManager = new EndGameManager(scene, gui);
const scoreTracker = new ScoreTracker(gui, endGameManager);

// Create ball container
const ballContainer = new BallContainer(scene, objectConfigs.ballConfigurations, scoreTracker);

// Create walls
const topWall = new Wall(scene, objectConfigs.walls.topWall);
const bottomWall = new Wall(scene, objectConfigs.walls.bottomWall);

// Create paddles
const leftPaddle = new Paddle(scene, objectConfigs.paddles.leftPaddle, [topWall, bottomWall]);
const rightPaddle = new Paddle(scene, objectConfigs.paddles.rightPaddle, [topWall, bottomWall]);

function animate() {
    requestAnimationFrame(animate);

    // Update paddles' position
    leftPaddle.update();
    rightPaddle.update();

    // Update ball container
    ballContainer.update(leftPaddle.mesh, rightPaddle.mesh, topWall, bottomWall);

    // Render the scene
    renderer.render(scene, camera);
}

animate();

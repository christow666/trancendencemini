// config.js

export const objectConfigs = {
    walls: {
        topWall: {
            width: 15,
            height: 0.1,
            depth: 0.1,
            color: 0x0000ff,
            position: { x: 0, y: 5, z: 0 }
        },
        bottomWall: {
            width: 15,
            height: 0.1,
            depth: 0.1,
            color: 0x0000ff,
            position: { x: 0, y: -5, z: 0 }
        }
    },
    paddles: {
        leftPaddle: {
            width: 1,
            height: 10,
            depth: 1,
            speed: 0.1,
            color: 0xff0000,
            position: { x: -7, y: 0, z: 0 },
            controls: { up: 'w', down: 's' }
        },
        rightPaddle: {
            width: 1,
            height: 10,
            depth: 1,
            speed: 0.1,
            color: 0xff0000,
            position: { x: 7, y: 0, z: 0 },
            controls: { up: 'o', down: 'l' }
        }
    },
    ballConfigurations: {
        position: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        size: 0.5,
        color: 0xff0000,
        maxVelocity: 0.1,
        numberOfBalls: 5,
        duplicateBall: 0
    },
    playerInfo: {
        player1Name: "TheYeti",
        player2Name: "TheLoser"
    }
};

export class Gui {
    constructor(scene) {
        this.scene = scene;
        this.createPongText();
        this.createOrUpdatePlayerScoreText(1, 0, { x: -5, y: 5.3, z: 0 });
        this.createOrUpdatePlayerScoreText(2, 0, { x: 4.9, y: 5.3, z: 0 });
    }

    createPongText() {
        const text = "Pong";
        const fontLoader = new THREE.FontLoader();

        // Load a font (you can use a different font if you have one)
        fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
            const textGeometry = new THREE.TextGeometry(text, {
                font: font,
                size: 1, // Size of the text
                height: 0.1, // Thickness of the text
                curveSegments: 12, // Number of points on the curves
                bevelEnabled: false // Disable bevel for simplicity
            });

            // Center the text geometry
            textGeometry.computeBoundingBox();
            const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
            textGeometry.translate(-0.5 * textWidth, 0, 0);

            // Create a basic material for the text
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

            // Create a mesh for the text
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            // Position the text in the center of the scene
            textMesh.position.set(0, 6.5, 0); // Adjust position as needed

            // Add the text mesh to the scene
            this.scene.add(textMesh);
        });
    }

    createOrUpdatePlayerScoreText(player, score, position) {
        const text = `Player ${player} : ${score}`;
        const fontLoader = new THREE.FontLoader();

        return new Promise((resolve, reject) => {
            fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
                const textGeometry = new THREE.TextGeometry(text, {
                    font: font,
                    size: 0.5, // Size of the text
                    height: 0.1, // Thickness of the text
                    curveSegments: 12, // Number of points on the curves
                    bevelEnabled: false // Disable bevel for simplicity
                });

                textGeometry.computeBoundingBox();
                const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
                textGeometry.translate(-0.5 * textWidth, 0, 0);

                const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);

                textMesh.position.set(position.x, position.y, position.z);

                const existingTextMesh = this.scene.getObjectByName(`player${player}ScoreText`);
                if (existingTextMesh) {
                    this.scene.remove(existingTextMesh);
                }

                textMesh.name = `player${player}ScoreText`;

                this.scene.add(textMesh);
                resolve(textMesh);
            });
        });
    }

    updatePlayerScores(player1Score, player2Score) {
        const player1ScoreTextMesh = this.scene.getObjectByName('player1ScoreText');
        if (player1ScoreTextMesh) {
            player1ScoreTextMesh.geometry.dispose();
            this.createOrUpdatePlayerScoreText(1, player1Score, player1ScoreTextMesh.position);
        }

        const player2ScoreTextMesh = this.scene.getObjectByName('player2ScoreText');
        if (player2ScoreTextMesh) {
            player2ScoreTextMesh.geometry.dispose();
            this.createOrUpdatePlayerScoreText(2, player2Score, player2ScoreTextMesh.position);
        }
    }
}

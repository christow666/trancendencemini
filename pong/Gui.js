export class Gui {
    constructor(scene) {
        this.scene = scene;
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

    // Function to create or update the text object for player scores with custom positions
    createOrUpdatePlayerScoreText(player, score, position) {
        const text = `Player ${player} : ${score}`;
        const fontLoader = new THREE.FontLoader();

        return new Promise((resolve, reject) => {
            // Load a font (you can use a different font if you have one)
            fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
                const textGeometry = new THREE.TextGeometry(text, {
                    font: font,
                    size: 0.5, // Size of the text
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

                // Position the text based on the custom position
                textMesh.position.set(position.x, position.y, position.z);

                // Remove previous text mesh if it exists
                const existingTextMesh = this.scene.getObjectByName(`player${player}ScoreText`);
                if (existingTextMesh) {
                    this.scene.remove(existingTextMesh);
                }

                // Set name for identification
                textMesh.name = `player${player}ScoreText`;

                // Add the text mesh to the scene
                this.scene.add(textMesh);

                // Resolve the promise with the created text mesh
                resolve(textMesh);
            });
        });
    }

    // Function to update the player scores
    updatePlayerScores(player1Score, player2Score) {
        // Update Player 1 score text
        this.createOrUpdatePlayerScoreText(1, player1Score, { x: -5, y: 5.3, z: 0 });

        // Update Player 2 score text
        this.createOrUpdatePlayerScoreText(2, player2Score, { x: 4.9, y: 5.3, z: 0 });
    }
}

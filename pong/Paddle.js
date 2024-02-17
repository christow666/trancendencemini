export class Paddle {
    constructor(scene, width, height, depth, color, position, controls) {
        this.geometry = new THREE.BoxGeometry(width, height, depth);
        this.material = new THREE.MeshBasicMaterial({ color: color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene = scene;

        // Set initial position of the paddle
        this.mesh.position.copy(position);

        // Add the paddle mesh to the scene
        this.scene.add(this.mesh);

        // Set up paddle speed
        this.speed = 0.2;

        // Set up paddle movement flags
        this.moveUp = false;
        this.moveDown = false;

        // Set up controls
        this.controls = controls;

        // Bind event listeners
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    // Event handlers for keydown and keyup events
    handleKeyDown(event) {
        if (event.key === this.controls.up) {
            this.moveUp = true;
        } else if (event.key === this.controls.down) {
            this.moveDown = true;
        }
    }

    handleKeyUp(event) {
        if (event.key === this.controls.up) {
            this.moveUp = false;
        } else if (event.key === this.controls.down) {
            this.moveDown = false;
        }
    }

    // Update paddle position based on key events
    update() {
        if (this.moveUp && this.mesh.position.y < 4) {
            this.mesh.position.y += this.speed;
        }
        if (this.moveDown && this.mesh.position.y > -4) {
            this.mesh.position.y -= this.speed;
        }
    }
}

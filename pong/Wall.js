export class Wall {
    constructor(scene, width, height, depth, color, position) {
        this.geometry = new THREE.BoxGeometry(width, height, depth);
        this.material = new THREE.MeshBasicMaterial({ color: color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.position = position;
        this.scene = scene;
        this.mesh.position.copy(position);
        this.scene.add(this.mesh);
    }
}

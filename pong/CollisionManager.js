// CollisionManager.js
export class CollisionManager {
    constructor(mesh, velocity) {
        this.mesh = mesh;
        this.velocity = velocity;
        this.raycaster = new THREE.Raycaster();
    }

    handdleColision(){

    }

    checkCollisionWall(mesh, ballMesh, velocity, raycaster) {
    // Set up the raycaster's origin and direction based on the ball's position and velocity
    console.log('Raycaster:', raycaster);
    console.log('Ball mesh position:', ballMesh.position);
    console.log('Velocity:', velocity);
    raycaster.set(ballMesh.position, velocity.clone().normalize());
    console.log('Raycaster after setting:', raycaster);

    // Check for intersection between the ray and the wall's mesh
    const intersects = raycaster.intersectObject(mesh);
    console.log('Intersects:', intersects);

    // If there's an intersection, it means the ball has collided with the wall
    return intersects.length > 0;
}

    checkCollision(mesh, ballMesh, velocity, raycaster) {
        // Set up the raycaster's origin and direction based on the ball's position and velocity
        raycaster.set(ballMesh.position, velocity.clone().normalize());
    
        // Check for intersection between the ray and the object's mesh
        const intersectsMain = raycaster.intersectObject(mesh);
    
        // If there's an intersection, it means the ball has collided with the object
        if (intersectsMain.length > 0) {
            return true;
        }
    
        // Set up a raycaster with a slight offset in the positive Y direction
        raycaster.set(
            new THREE.Vector3(ballMesh.position.x, ballMesh.position.y + 0.5, ballMesh.position.z), 
            velocity.clone().normalize()
        );
    
        // Check for intersection with the object for raycaster with positive Y offset
        const intersectsOffsetPositiveY = raycaster.intersectObject(mesh);
        if (intersectsOffsetPositiveY.length > 0) {
            return true;
        }
    
        // Set up a raycaster with a slight offset in the negative Y direction
        raycaster.set(
            new THREE.Vector3(ballMesh.position.x, ballMesh.position.y - 0.5, ballMesh.position.z), 
            velocity.clone().normalize()
        );
    
        // Check for intersection with the object for raycaster with negative Y offset
        const intersectsOffsetNegativeY = raycaster.intersectObject(mesh);
        if (intersectsOffsetNegativeY.length > 0) {
            return true;
        }
    
        // No collision detected
        return false;
    }

}

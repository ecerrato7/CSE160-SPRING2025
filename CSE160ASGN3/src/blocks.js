class BlockManager {
    constructor(map) {
        this.map = map; // 2D array representing the map
        console.log('BlockManager initialized with map:', this.map); // Debugging
    }

    // Get the map square in front of the camera
    getBlockInFront(camera) {
        const forward = camera.getForwardVector().normalize(); // Get the normalized forward vector
        const blockDistance = 1; // Distance in front of the camera to place the block
        const x = Math.round(camera.eye.elements[0] + forward.elements[0] * blockDistance);
        const z = Math.round(camera.eye.elements[2] + forward.elements[2] * blockDistance);
        return { x, z };
    }

    addBlock(camera) {
        const { x, z } = this.getBlockInFront(camera);
        console.log(`Adding block at (${x}, ${z})`);
    
        // Ensure the position is within bounds
        if (x >= 0 && x < this.map.length && z >= 0 && z < this.map[x].length) {
            if (typeof this.map[x][z] === 'number') {
                this.map[x][z] += 1; // Increase the stack height
            } else {
                this.map[x][z] = 1; // Initialize the stack if it doesn't exist
            }
        }
    }

    deleteBlock(camera) {
        const { x, z } = this.getBlockInFront(camera);
        console.log(`Deleting block at (${x}, ${z})`);
    
        // Ensure the position is within bounds
        if (x >= 0 && x < this.map.length && z >= 0 && z < this.map[x].length) {
            if (typeof this.map[x][z] === 'number' && this.map[x][z] > 0) {
                this.map[x][z] -= 1; // Decrease the stack height
            }
        }
    }

    // Render the blocks in the map
    renderBlocks() {
        const cube = new Cube();
        for (let x = 0; x < this.map.length; x++) {
            if (!Array.isArray(this.map[x])) continue; // Skip if row is not an array
            for (let z = 0; z < this.map[x].length; z++) {
                if (typeof this.map[x][z] !== 'number') continue; // Skip if column is not a number
                const height = this.map[x][z];
                for (let y = 0; y < height; y++) {
                    cube.color = [1.0, 1.0, 1.0, 1.0]; // White color for blocks
                    cube.matrix.setIdentity();
                    cube.matrix.translate(x - this.map.length / 2, y - 0.75, z - this.map[x].length / 2);
                    cube.render();
                }
            }
        }
    }
}
class Camera {
    constructor(){
        this.eye = new Vector3([0, 0, 3]);
        this.at = new Vector3([0, 0, -100]);
        this.up = new Vector3([0, 1, 0]);
        this.speed = 0.1;
        this.yaw = 0; // Horizontal rotation
        this.pitch = 0; // Vertical rotation
    }

    reset() {
        this.eye = new Vector3([0, 0, 3]);
        this.at = new Vector3([0, 0, -100]);
        this.up = new Vector3([0, 1, 0]);
        this.yaw = 0;
        this.pitch = 0;
    }

    getForwardVector() {
        const radYaw = (this.yaw * Math.PI) / 180; // Convert yaw to radians
        const radPitch = (this.pitch * Math.PI) / 180; // Convert pitch to radians
    
        const forward = new Vector3([
            Math.cos(radPitch) * Math.sin(radYaw), // x
            Math.sin(radPitch),                   // y
            Math.cos(radPitch) * Math.cos(radYaw) // z
        ]);
        return forward.normalize(); // Normalize the vector to keep it a unit vector
    }

    getRightVector() {
        const forward = this.getForwardVector(); // Get the forward vector
        const right = Vector3.cross(forward, this.up).normalize(); // Calculate the right vector
        return right;
    }
    forward() {
        const dir = this.getForwardVector().mul(this.speed);
        this.eye = this.eye.add(dir);
        this.updateAt();
    }
    
    back() {
        const dir = this.getForwardVector().mul(this.speed);
        this.eye = this.eye.sub(dir);
        this.updateAt();
    }
    
    left() {
        const side = this.getRightVector().mul(this.speed);
        this.eye = this.eye.sub(side);
        this.updateAt();
    }
    
    right() {
        const side = this.getRightVector().mul(this.speed);
        this.eye = this.eye.add(side);
        this.updateAt();
    }
    moveup() {
        const up = this.up.normalize().mul(this.speed); // Normalize the up vector and scale it
        this.eye = new Vector3([
            this.eye.elements[0] + up.elements[0],
            this.eye.elements[1] + up.elements[1],
            this.eye.elements[2] + up.elements[2],
        ]); // Move the eye position up
        this.updateAt(); // Update the "at" vector
    }
    
    movedown() {
        const up = this.up.normalize().mul(this.speed); // Normalize the up vector and scale it
        this.eye = new Vector3([
            this.eye.elements[0] - up.elements[0],
            this.eye.elements[1] - up.elements[1],
            this.eye.elements[2] - up.elements[2],
        ]); // Move the eye position down
        this.updateAt(); // Update the "at" vector
    }
    panRight() {
        const panSpeed = 2; // Adjust this value for the desired pan speed
        this.yaw -= panSpeed; // Rotate the camera to the right
        this.updateAt(); // Update the "at" vector based on the new yaw
    }
    
    panLeft() {
        const panSpeed = 2; // Adjust this value for the desired pan speed
        this.yaw += panSpeed; // Rotate the camera to the left
        this.updateAt(); // Update the "at" vector based on the new yaw
    }
    updateAt() {
        const forward = this.getForwardVector(); // Get the forward vector
        this.at = new Vector3([
            this.eye.elements[0] + forward.elements[0],
            this.eye.elements[1] + forward.elements[1],
            this.eye.elements[2] + forward.elements[2],
        ]); // Update the "at" vector based on the forward direction
    
        // Debugging: Log the updated "at" and "eye" vectors
        console.log('updateAt called');
        console.log(`Camera Position (eye): [${this.eye.elements[0].toFixed(2)}, ${this.eye.elements[1].toFixed(2)}, ${this.eye.elements[2].toFixed(2)}]`);
        console.log(`Camera Target (at): [${this.at.elements[0].toFixed(2)}, ${this.at.elements[1].toFixed(2)}, ${this.at.elements[2].toFixed(2)}]`);
    }
}

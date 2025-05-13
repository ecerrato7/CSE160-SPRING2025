let herd = []; // Array to store baby animals
let predatorPosition = new Vector3([5, 0.5, 5]); // Initial predator position
let predatorVelocity = new Vector3([-0.02, 0, -0.02]); // Predator movement speed

function initializeHerd() {
    herd = new Array(10); // Pre-allocate memory for the herd array
    herdVelocities = new Array(10); // Pre-allocate memory for the velocities array

    for (let i = 0; i < 10; i++) {
        const x = Math.random() * 8 - 4; // Random x position within the floor bounds
        const z = Math.random() * 8 - 4; // Random z position within the floor bounds
        herd[i] = new Vector3([x, -0.75, z]); // Set y to floor height (-0.75)

        // Assign a smaller random velocity for each baby animal
        const vx = (Math.random() - 0.5) * 0.005; // Reduced velocity in x
        const vz = (Math.random() - 0.5) * 0.005; // Reduced velocity in z
        herdVelocities[i] = new Vector3([vx, 0, vz]);
    }
}

function updatePredator() {
    predatorPosition = predatorPosition.add(predatorVelocity);

    // Keep the predator on the floor
    predatorPosition.elements[1] = -0.75; // Match the floor's height

    // Reset predator if it moves out of bounds
    if (Math.abs(predatorPosition.elements[0]) > 4 || Math.abs(predatorPosition.elements[2]) > 4) {
        resetPredator();
    }
}

function resetPredator() {
    predatorPosition = new Vector3([Math.random() * 8 - 4, -0.75, Math.random() * 8 - 4]); // Random x, z on the floor
    predatorVelocity = new Vector3([(Math.random() - 0.5) * 0.005, 0, (Math.random() - 0.5) * 0.005]); // Reduced velocity in x, z
}

function updateHerd() {
    const floorBounds = 4; // Define floor bounds to avoid recalculating
    for (let i = 0; i < herd.length; i++) {
        const herdMember = herd[i];
        const velocity = herdVelocities[i];

        // Update position
        herdMember.elements[0] += velocity.elements[0];
        herdMember.elements[2] += velocity.elements[2];

        // Keep the herd on the floor
        herdMember.elements[1] = -0.75; // Match the floor's height

        // Bounce off the edges of the floor
        if (Math.abs(herdMember.elements[0]) > floorBounds) {
            velocity.elements[0] *= -1; // Reverse x velocity
            herdMember.elements[0] = Math.sign(herdMember.elements[0]) * floorBounds; // Clamp position
        }
        if (Math.abs(herdMember.elements[2]) > floorBounds) {
            velocity.elements[2] *= -1; // Reverse z velocity
            herdMember.elements[2] = Math.sign(herdMember.elements[2]) * floorBounds; // Clamp position
        }
    }
}


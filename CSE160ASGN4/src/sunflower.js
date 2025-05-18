function createValleyOfFlowers() {
    for (let i = 0; i < flowerPositions.length; i++) {
        const { x, y, z } = flowerPositions[i];
  
        // Create the flower stem
        const stem = new Cube();
        stem.color = [0.0, 0.8, 0.0, 1.0]; // Green color for the stem
        stem.matrix.setTranslate(x, y, z);
        stem.matrix.scale(0.1, 0.5, 0.1); // Thin and tall
        stem.render();
  
        // Create the flower center
        const center = new Sphere(0.1, 6, 6); // Lower resolution
        center.color = [1.0, 1.0, 0.0, 1.0]; // Yellow color for the center
        center.matrix.setTranslate(x, y + 0.3, z); // Position above the stem
        center.render();
  
        // Create the petals
        const numPetals = 6; // Number of petals
        const petalRadius = 0.2; // Distance from the center
        for (let j = 0; j < numPetals; j++) {
            const angle = (j * 360) / numPetals; // Spread petals evenly
            const radian = (angle * Math.PI) / 180;
  
            const petal = new Sphere(0.1, 10, 10); // Use a sphere for the petal
            petal.color = [
                Math.random(), // Random red
                Math.random(), // Random green
                Math.random(), // Random blue
                1.0,           // Alpha (opacity)
            ];
            const petalX = x + petalRadius * Math.cos(radian);
            const petalZ = z + petalRadius * Math.sin(radian);
            petal.matrix.setTranslate(petalX, y + 0.3, petalZ); // Position around the center
            petal.render();
        }
    }
  }
  
  
  let flowerPositions = []; // Global array to store flower positions
  
  function initializeFlowerPositions(numFlowers, floorWidth, floorDepth) {
      flowerPositions = [];
      for (let i = 0; i < numFlowers; i++) {
          const x = Math.random() * floorWidth - floorWidth / 2;
          const z = Math.random() * floorDepth - floorDepth / 2;
          const y = -0.7; // Slightly above the floor
          flowerPositions.push({ x, y, z });
      }
  }
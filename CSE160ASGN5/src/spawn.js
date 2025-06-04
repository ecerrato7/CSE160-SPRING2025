import * as THREE from 'three';

// Helper to check if a position is clear (not near obstacles or other cubes)
function isPositionClear(x, z, obstacles, minDist = 3) {
  for (let obj of obstacles) {
    const objPos = new THREE.Vector3();
    obj.getWorldPosition(objPos);
    if (Math.hypot(objPos.x - x, objPos.z - z) < minDist) return false;
  }
  return true;
}

// Generate a random clear position for the special box
function getRandomClearPosition(obstacles) {
  let x, z, tries = 0;
  do {
    x = Math.random() * 30 - 15;
    z = Math.random() * 30 - 15;
    tries++;
    if (tries > 100) break; // avoid infinite loop
  } while (!isPositionClear(x, z, obstacles));
  return { x, z };
}

export { getRandomClearPosition };
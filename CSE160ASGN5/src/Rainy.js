import * as THREE from 'three';

let rain, rainCount, rainGeometry;

function addRainToScene(scene) {
  rainCount = 1000;
  rainGeometry = new THREE.BufferGeometry();
  const rainPositions = [];

  for (let i = 0; i < rainCount; i++) {
    const x = Math.random() * 100 - 50;
    const y = Math.random() * 30 + 10;
    const z = Math.random() * 100 - 50;
    rainPositions.push(x, y, z);
  }

  rainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(rainPositions, 3));

  const rainMaterial = new THREE.PointsMaterial({
    color: 0xaaaaee,
    size: 0.2,
    transparent: true,
    opacity: 0.7
  });

  rain = new THREE.Points(rainGeometry, rainMaterial);
  scene.add(rain);
}

// Call this in your animation loop
function updateRain() {
  if (!rain) return;
  const positions = rain.geometry.attributes.position.array;
  for (let i = 0; i < rainCount; i++) {
    let y = positions[i * 3 + 1];
    y -= 0.3;
    if (y < 0) y = Math.random() * 30 + 10;
    positions[i * 3 + 1] = y;
  }
  rain.geometry.attributes.position.needsUpdate = true;
}

export { addRainToScene, updateRain };
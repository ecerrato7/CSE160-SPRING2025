import * as THREE from 'three';

function addMistToScene(scene, color = 0xcce0ff, density = 0.03) {
  scene.fog = new THREE.FogExp2(color, density);
}

export { addMistToScene };
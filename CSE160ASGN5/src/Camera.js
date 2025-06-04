import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


  // Scene and Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
  );
  camera.position.set(0, 2, 8);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl') });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Orbit Controls
  
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1, 0);
  controls.maxPolarAngle = Math.PI / 2; // Prevent camera from going below floor
  controls.update();


// Export these so other files can use them
export { camera, scene, renderer, controls };
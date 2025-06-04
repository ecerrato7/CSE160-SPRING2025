 
import { scene, renderer, camera, controls } from './Camera.js';
import { initScene } from './Scene.js';
import { logControls } from './controls.js';


function main() {
  
  /*
  // Scene and Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
  );
  camera.position.set(0, 2, 8);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl') });
  renderer.setSize(window.innerWidth, window.innerHeight);
*/
  // Orbit Controls
  /*
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1, 0);
  controls.maxPolarAngle = Math.PI / 2; // Prevent camera from going below floor
  controls.update();
*/


  // Skybox (if you have 6 images)
  // const loader = new THREE.CubeTextureLoader();
  // const skybox = loader.load([
  //   'sky_px.jpg', 'sky_nx.jpg',
  //   'sky_py.jpg', 'sky_ny.jpg',
  //   'sky_pz.jpg', 'sky_nz.jpg'
  // ]);
  // scene.background = skybox;
  logControls();
initScene(); // sets up objects

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
 
}
animate();

}

main();
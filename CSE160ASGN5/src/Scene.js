import * as THREE from 'three';
import { scene, renderer, camera, controls } from './Camera.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { addRainToScene, updateRain } from './Rainy.js';
import { addMistToScene } from './mist.js';
import { createPond, updatePond } from './Water.js';
 import { getRandomClearPosition } from './spawn.js';


let catModel = null;
let catMixer = null;
let walkAction = null;
let walkTarget = null;
let walkSpeed = 1; // adjust speed
let followCat = true; // Camera follows cat by default
const gridMinX = -10, gridMaxX = -30;
const gridMinZ = -10, gridMaxZ = -30;
const numCylinders = 12;
const obstacles = [];

const specialBoxPos = getRandomClearPosition(obstacles);
window.addEventListener('keydown', function(e) {
  if (e.key === 't' || e.key === 'T') {
    followCat = !followCat;
  }
});


window.addEventListener('keydown', function(e) {
  if (e.key === 'i' || e.key === 'I') {
    walkSpeed += 0.1; // Increase speed
    console.log("Walk speed increased to:", walkSpeed);
  }

if (e.key === 'O' || e.key === 'o') {
    walkSpeed -= 0.1; // decrease speed
    console.log("Walk speed decreased to:", walkSpeed);
  }
  if (e.key === 'p' || e.key === 'P') {
    if (walkAction) {
      walkAction.paused = !walkAction.paused;  
    }
  }
});
const canfood = new THREE.TextureLoader().load('CSE160ASGN5/src/Textures/canfood.jpg');
function initScene() {
const fenceLoader = new OBJLoader();
fenceLoader.setPath('CSE160ASGN5/Structures/'); // adjust path if needed

fenceLoader.load('Fence.obj', function(object) {
  object.scale.set(1, 1, 1);
  object.position.set(10, -1, 7);
  scene.add(object);
  object.traverse(child => {
 
 // obstacles.push(object); // Add to obstacles array
});


fenceLoader.load('Fence.obj', function(object) {
  object.scale.set(1, 1, 1);
  object.position.set(16.5, -1, 7);
  scene.add(object);
 // object.traverse(child => {
 /* if (child.isMesh) {
    child.geometry.computeBoundingBox();
    obstacles.push(child); // Add mesh (not whole group) to obstacles
  }*/
});

 // obstacles.push(object); // Add to obstacles array
});

const textureLoader = new THREE.TextureLoader();
const farmhouseTexture = textureLoader.load('CSE160ASGN5/src/Textures/Farmhouse Texture.jpg');

const objLoader = new OBJLoader();
objLoader.setPath('CSE160ASGN5/Structures/');
objLoader.load('farmhouse_obj.obj', function(object) {
  object.traverse(function(child) {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshPhongMaterial({ map: farmhouseTexture });
    }
  });

  object.scale.set(.5, .5, .5);
  object.position.set(-10, 0, 12);
  scene.add(object);
});
addRainToScene(scene);
addMistToScene(scene);
const pond = createPond();
scene.add(pond);
// Load grass texture
const grassTexture = new THREE.TextureLoader().load('CSE160ASGN5/src/Textures/grass.jpg');
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(10, 10);

// Create floor
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshPhongMaterial({ map: grassTexture, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.scale.set(1, 1,0.5);
scene.add(floor);

// Horizontal road (east-west)
const roadHGeometry = new THREE.PlaneGeometry(100, 5); // long and wide
const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x333333, side: THREE.DoubleSide });
const roadH = new THREE.Mesh(roadHGeometry, roadMaterial);
roadH.rotation.x = -Math.PI / 2;
roadH.position.y = 0.01; // Slightly above the grass
scene.add(roadH);

// Vertical road (north-south)
const roadVGeometry = new THREE.PlaneGeometry(5, 100); // wide and long
const roadV = new THREE.Mesh(roadVGeometry, roadMaterial);
roadV.rotation.x = -Math.PI / 2;
roadV.position.y = 0.011; // Slightly above the horizontal road to prevent z-fighting
scene.add(roadV);


 
  scene.background = new THREE.TextureLoader().load('CSE160ASGN5/src/Textures/sky.jpg');

  // Lights
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(5, 10, 7.5);
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(0xffaa00, 1, 100);
  pointLight.position.set(-5, 5, 5);
  scene.add(pointLight);

  const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
  scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0x00aaff, 1.2, 30, Math.PI / 6, 0.5, 2);
spotLight.position.set(0, 10, 0);
scene.add(spotLight);
  // Texture for cubes
  const cubeTexture = new THREE.TextureLoader().load('CSE160ASGN5/src/Textures/woodenbox.jpg');

  // Multiple animated cubes
const cubes = [];
let specialBox = null;
 for (let i = 0; i < 5; ++i) {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshPhongMaterial({ map: cubeTexture });
  const cube = new THREE.Mesh(geometry, material);

  // Place the special box at the random clear position, others as before
  if (i === 0) {
    cube.position.set(specialBoxPos.x, 0.5, specialBoxPos.z);
    specialBox = cube;
    cube.userData.isSpecial = true;
  } else {
    cube.position.x = (i - 2) * 2.2;
    cube.position.y = 0.5;
  }

  scene.add(cube);
  cubes.push(cube);
  obstacles.push(cube);
}
const catFoodGeometry = new THREE.SphereGeometry(0.3, 16, 16);
const catFoodMaterial = new THREE.MeshPhongMaterial({ color: 0xff3333 });
const catFood = new THREE.Mesh(catFoodGeometry, catFoodMaterial);
catFood.position.set(specialBoxPos.x, 1.2, specialBoxPos.z);
catFood.visible = false; // hidden until cat is near
scene.add(catFood);

const cylinders2 = [];

for (let i = 0; i < numCylinders; ++i) {
  // Random position within grid
  const x = Math.random() * (gridMaxX - gridMinX) + gridMinX;
  const z = Math.random() * (gridMaxZ - gridMinZ) + gridMinZ;

  // Random size
  const radiusTop = Math.random() * 1.5 + 0.3;   // 0.3 to 1.8
  const radiusBottom = Math.random() * 1.5 + 0.3;
  const height = Math.random() * 8 + 1;          // 1 to 9
  const radialSegments = Math.floor(Math.random() * 16) + 8; // 8 to 24

  const cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments),
    new THREE.MeshPhongMaterial({ color: new THREE.Color(Math.random(), Math.random(), Math.random()) })
  );

  // Place so base sits on ground
  cylinder.position.set(x, height / 2, z);

  scene.add(cylinder);
  cylinders2.push(cylinder);
  obstacles.push(cylinder); // If you want them as obstacles
}



// Create multiple cylinders with different shapes

  
const cylinders = [];

 

const cylinderShapes = [
  // [radiusTop, radiusBottom, height, radialSegments]
  [0.5, 0.5, 10, 32],   // Tall, thin
  [0.5, 0.5, 10, 32],       // Short, wide
  [0.5, 0.5, 10, 32], // Tapered
  [0.5, 0.5, 10, 32], // Inverted tapered
  [0.7, 0.7, 0.7, 12], // Water barrel leaked
  [0.7, 0.7, 5, 16],   // Bulbous
];

// Define positions for each cylinder
const cylinderPositions = [
  [-3, 0, 3],  //wooden log
  [3, 0, 3],  //Wooden logs
  [3, 0, -3],  //wooden log
  [-3, 0, -3],  //wooden log
  [10, 0, 2],
  [12, 0, -5]
];

for (let i = 0; i < 6; ++i) {
  const [radiusTop, radiusBottom, height, radialSegments] = cylinderShapes[i];
  const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
  const material = new THREE.MeshPhongMaterial({ color: new THREE.Color(Math.random(), Math.random(), Math.random()) });
  const cylinder = new THREE.Mesh(geometry, material);
  // Use the position for this cylinder, and set y to half the height so it sits on the floor
  const [x, y, z] = cylinderPositions[i];
  cylinder.position.set(x, y + height / 2, z);
  scene.add(cylinder);
  cylinders.push(cylinder);
}
 
 

const spinningSpheres = [];

for (let i = 0; i < 20; ++i) {
  const geometry = new THREE.SphereGeometry(0.4, 16, 16);
  const material = new THREE.MeshPhongMaterial({ color: new THREE.Color(Math.random(), Math.random(), Math.random()) });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(
    Math.random() * 16 - 8,
    10 + Math.random() * 4,
    Math.random() * 16 - 8
  );
  scene.add(sphere);
  spinningSpheres.push(sphere); // Store for animation
}
    
const gltfLoader = new GLTFLoader();
gltfLoader.setPath('CSE160ASGN5/Structures/'); // adjust path if needed
const parts = {};  // Store references to body parts
 
gltfLoader.load('catwalking4.glb', function(gltf) {
  const cat = gltf.scene;
 cat.position.set(9, 0, 2);
   
  cat.scale.set(.01, .01, .01);
   
  scene.add(cat);

    catModel = cat;
 console.log("Cat X:", catModel.position.x);
console.log("Cat Y:", catModel.position.y);
console.log("Cat Z:", catModel.position.z);
 catMixer = new THREE.AnimationMixer(cat);
walkAction = catMixer.clipAction(gltf.animations[0]);
walkAction.play();
walkAction.paused = true; // Start paused until user clicks

});


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('click', function(event) {
  // Convert mouse position to normalized device coordinates (-1 to +1)
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // Intersect with the floor (assuming y=0 plane)
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const intersectPoint = new THREE.Vector3();
  raycaster.ray.intersectPlane(plane, intersectPoint);
// Show cat food if cat is near the special box
if (catModel && specialBox) {
  const dist = catModel.position.distanceTo(specialBox.position);
  catFood.visible = dist < 2; // show if cat is within 2 units
}
  if (catModel && intersectPoint) {
    walkTarget = new THREE.Vector3(intersectPoint.x, 0, intersectPoint.z); // Set walk target
    if (walkAction) walkAction.paused = false; // Start walk animation
  }
});

const clock = new THREE.Clock();

  // Animation loop
function animate() {
  requestAnimationFrame(animate);
    updateRain();
  const delta = clock.getDelta();
  for (const sphere of spinningSpheres) {
    sphere.rotation.y += 1.5 * delta; // Spin around Y axis
    sphere.rotation.x += 0.5 * delta; // Optional: also spin around X axis
  }
let catFed = false;
  if (catMixer) catMixer.update(delta);

  // Move the cat toward the target
  if (catModel && walkTarget) {
  const direction = new THREE.Vector3().subVectors(walkTarget, catModel.position);
  const distance = direction.length();

  if (distance > 0.05) {
    direction.normalize();
    const nextPos = catModel.position.clone().addScaledVector(direction, walkSpeed * delta);

    // Only move if not colliding
    if (!isColliding(nextPos, obstacles)) {
      catModel.position.copy(nextPos);
    } else {
      // Optionally: stop movement if collision detected
      walkTarget = null;
      if (walkAction) walkAction.paused = true;
    }

      // Rotate the cat to face the movement direction
      const angle = Math.atan2(direction.x, direction.z);
      catModel.rotation.y = angle;

      if (walkAction) walkAction.paused = false; // Play walk animation
    } else {
      // Arrived at target
      walkTarget = null;
      if (walkAction) walkAction.paused = true; // Pause walk animation
    }
  } else {
    if (walkAction) walkAction.paused = true; // Pause if not moving
  }
  if (catModel && specialBox && !catFed) {
  const dist = catModel.position.distanceTo(specialBox.position);
  if (dist < 2) {
    // Show the can food texture on top of the special box
    const canFoodMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 0.5, 32),
      new THREE.MeshPhongMaterial({ map: canfood })
    );
    canFoodMesh.position.set(specialBox.position.x, specialBox.position.y + 0.8, specialBox.position.z);
    scene.add(canFoodMesh);

    catFed = true;
    catFood.visible = false;  
    console.log("Your stray cat is no longer hungry");
  }
}
if (followCat && catModel) {
  // Set camera position relative to cat (adjust offset as needed)
  camera.position.lerp(
    new THREE.Vector3(
      catModel.position.x + 5,
      catModel.position.y + 3,
      catModel.position.z + 8
    ),
    0.1 // smoothness (0 = no move, 1 = instant)
  );
  controls.target.lerp(
    new THREE.Vector3(
      catModel.position.x,
      catModel.position.y + 1,
      catModel.position.z
    ),
    0.1
  );
  controls.update();
}
  controls.update();
  renderer.render(scene, camera);
  updatePond(pond, performance.now() * 0.001);
}

 animate();
}
 
function isColliding(nextPos, obstacles, catRadius = 0.5) {
  for (let obj of obstacles) {
    // Get object's world position
    const objPos = new THREE.Vector3();
    obj.getWorldPosition(objPos);

    // Estimate object radius (for cubes/cylinders, use half their size)
    const objRadius = obj.geometry.boundingSphere
      ? obj.geometry.boundingSphere.radius * obj.scale.x
      : 1;

    // Simple sphere-sphere collision
    if (nextPos.distanceTo(objPos) < (catRadius + objRadius)) {
      return true;
    }
  }
  return false;
}
 
export { initScene };

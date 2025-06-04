import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  uniform float time;
  void main() {
    vUv = uv;
    vec3 pos = position;
    pos.z += sin(pos.x * 2.0 + time) * 0.05 + cos(pos.y * 2.0 + time) * 0.05;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  void main() {
    vec3 waterColor = vec3(0.20, 0.60, 1.0);
    float ripple = 1.0 + 0.03 * sin(15.0 * vUv.x + 15.0 * vUv.y);
    gl_FragColor = vec4(waterColor * ripple, 1.0);
  }
`;

function createPond() {
  const geometry = new THREE.PlaneGeometry(20, 12, 128, 128);  

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      time: { value: 0 }
    },
    side: THREE.DoubleSide,  
    transparent: false  
  });

  const pond = new THREE.Mesh(geometry, material);
  pond.rotation.x = -Math.PI / 2;
  pond.position.set(12, 0.01, -12);  
  pond.name = "pond";
  return pond;
}

function updatePond(pond, elapsedTime) {
  if (pond.material.uniforms.time) {
    pond.material.uniforms.time.value = elapsedTime;
  }
}

export { createPond, updatePond };

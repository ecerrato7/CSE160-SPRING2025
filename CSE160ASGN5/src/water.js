import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  uniform float time;
  void main() {
    vUv = uv;
    vec3 pos = position;
    pos.z += sin(pos.x * 2.0 + time) * 0.1 + cos(pos.y * 2.0 + time) * 0.1;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  void main() {
    // Deeper water color
    vec3 waterColor = vec3(0.05, 0.25, 0.4);
    // Subtle rippling for realism
    float ripple = 0.9 + 0.1 * sin(15.0 * vUv.x + 15.0 * vUv.y);
    gl_FragColor = vec4(waterColor * ripple, 1.0);  // 1.0 = fully opaque
  }
`;

function createPond() {
  const geometry = new THREE.PlaneGeometry(8, 5, 64, 64);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      time: { value: 0 }
    },
    side: THREE.DoubleSide, // Ensure both sides render
    transparent: false // Full opacity
  });

  const pond = new THREE.Mesh(geometry, material);
  pond.rotation.x = -Math.PI / 2;
  pond.position.set(12, 0.01, -5);  // Slightly above grass to avoid z-fighting
  pond.name = "pond";
  return pond;
}

function updatePond(pond, elapsedTime) {
  if (pond.material.uniforms.time) {
    pond.material.uniforms.time.value = elapsedTime;
  }
}

export { createPond, updatePond };

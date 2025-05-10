// Vertex shader program
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }
`;

// Fragment shader program
const FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }
`;

// Global Variables
let canvas, gl;
let a_Position, u_FragColor, u_ModelMatrix, u_GlobalRotateMatrix;
let g_globalAngle = 0, g_seconds = 0;
let g_redAnimation = true, g_yellowAnimation = true, g_magentaAnimation = true;
let g_redAngle = 0, g_yellowAngle = 0, g_magentaAngle = 0;
let g_orangeAngle = 0, g_orangeScale = 1;
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = 'cube';
let g_shapeList = [];
let g_view = 'front';

let g_manualRedAngle = 0, g_manualYellowAngle = 0, g_manualMagentaAngle = 0;
let g_manualRedScale = 1, g_manualYellowScale = 1, g_manualMagentaScale = 1;
let g_legAngle = 0, g_legMovement = true, g_bodyShift = 0, g_bodyBounce = 0;
let orangeSphere;




let isDragging = false;
let lastX = 0, lastY = 0;
let rotationX = 0, rotationY = 0;




function setupWebGL() {
  canvas = document.getElementById('webgl');
  gl = getWebGLContext(canvas);
  if (!gl) {
    console.error('Failed to get WebGL context');
  }
}

function connectVariablesToGLSL() {
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.error('Failed to initialize shaders.');
    return;
  }

  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');

  if (a_Position < 0 || !u_FragColor || !u_ModelMatrix || !u_GlobalRotateMatrix) {
    console.error('Failed to get attribute/uniform location');
  }

  const identityMatrix = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityMatrix.elements);
}

function addActionForHTMLUI() {
  document.getElementById('Clear').onclick = clearCanvas;
  document.getElementById('angleSlider').addEventListener('input', ev => g_globalAngle = ev.target.value);
  document.getElementById('Stop Animation').onclick = () => { g_redAnimation = g_yellowAnimation = g_magentaAnimation = false; };
  document.getElementById('Start Animation').onclick = () => { g_redAnimation = g_yellowAnimation = g_magentaAnimation = true; };
  document.getElementById('magentaAngleSlider').addEventListener('input', ev => g_manualMagentaAngle = Number(ev.target.value));
  document.getElementById('magentaScaleSlider').addEventListener('input', ev => g_manualMagentaScale = Number(ev.target.value) / 100.0);

  document.getElementById('FrontView').onclick = () => g_view = 'front';
  document.getElementById('TopView').onclick = () => g_view = 'top';
  document.getElementById('RightView').onclick = () => g_view = 'right';
}


function setupMouseEvents() {
  // Add mouse event listeners to handle dragging
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });

  canvas.addEventListener('mouseup', () => isDragging = false);
  canvas.addEventListener('mouseleave', () => isDragging = false);

  canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    let dx = e.clientX - lastX;
    let dy = e.clientY - lastY;

    // Adjust the rotation values based on mouse movement
    rotationY += dx * 0.5; // rotate around Y axis
    rotationX += dy * 0.5; // rotate around X axis

    // Constrain the rotation on the X-axis to prevent flipping upside down
    if (rotationX > 90) rotationX = 90;
    if (rotationX < -90) rotationX = -90;

    lastX = e.clientX;
    lastY = e.clientY;

    // Re-render the scene with updated rotation
    renderAllShapes();
  });
}


function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionForHTMLUI();

  // Make sure canvas is defined before adding listeners
  if (canvas) {
    setupMouseEvents(); // Set up the mouse event listeners
  } else {
    console.error('Canvas element not found');
  }

  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);

  orangeSphere = new Sphere(0.5, 30, 30);

  requestAnimationFrame(tick);
}

window.onload = main; // Ensure the DOM is fully loaded

function tick() {
  g_seconds = performance.now() / 1000;
  updateAnimationAngles();
  renderAllShapes();
  requestAnimationFrame(tick);
}




function updateAnimationAngles() {
  g_redAngle = g_redAnimation ? 45 * Math.sin(g_seconds) : g_manualRedAngle;
  g_yellowAngle = g_yellowAnimation ? 45 * Math.sin(g_seconds) : g_manualYellowAngle;
  g_magentaAngle = g_magentaAnimation ? (g_seconds * 45) % 360 + g_manualMagentaAngle : g_manualMagentaAngle;

  if (g_yellowAnimation) {
    if (g_legMovement) {
      g_legAngle = 30 * Math.sin(g_seconds * 2);
      g_bodyShift = 0.05 * Math.sin(g_seconds * 2);
      g_bodyBounce = 0.02 * Math.sin(g_seconds * 3);
    }
    
  } else {
    g_legAngle = 0;
    g_bodyShift = 0;
    g_bodyBounce = 0;
  }
}


function renderAllShapes() {
  const startTime = performance.now();

  let modelMatrix = new Matrix4();
  modelMatrix.rotate(rotationX, 1, 0, 0); // Rotate around X axis
  modelMatrix.rotate(rotationY, 0, 1, 0); // Rotate around Y axis

  let globalRotMat = new Matrix4();
  if (g_view === 'front') {
    globalRotMat.setRotate(g_globalAngle, 0, 1, 0);
  } else if (g_view === 'top') {
    globalRotMat.setRotate(90, 1, 0, 0).rotate(g_globalAngle, 0, 0, 1);
  } else if (g_view === 'right') {
    globalRotMat.setRotate(-90, 0, 1, 0).rotate(g_globalAngle, 0, 0, 1);
  }

  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const zMovement = 0.1 * Math.sin(g_seconds * 2);

  // Draw Orange Sphere
  orangeSphere.matrix.setIdentity();
  orangeSphere.matrix.translate(100, 100, Math.sin(g_seconds));
  orangeSphere.matrix.scale(0.2, 0.2, 0.2);
  orangeSphere.render();

  // Yellow Arm Base
  const yellow = new Cube();
  yellow.color = [1, 1, 0, 1];
  yellow.matrix.setTranslate(-0.25, -0.25, zMovement).scale(0.35, 0.5, 0.5).rotate(-5, 1, 0, 0);
  if (g_yellowAnimation) {
    yellow.matrix.rotate(g_yellowAngle, 0, 1, 0);
  } else {
    yellow.matrix.translate(g_yellowAngle / 100, 0, 0);
  }
  const yellowCoordinatesMat = new Matrix4(yellow.matrix);
  yellow.render();

  drawWings(yellowCoordinatesMat, zMovement);
  drawHeadAndFace(yellowCoordinatesMat, zMovement);

  const duration = performance.now() - startTime;
  sendTextToHTML(`ms: ${Math.floor(duration)} fps: ${Math.floor(1000 / duration)} seconds: ${Math.floor(g_seconds * 100) / 100}`, "numdot");
}

function drawWings(baseMatrix, zMove) {
  const rightWing = new Cube();
  rightWing.color = [1, 1, 0, 1];
  rightWing.matrix = new Matrix4(baseMatrix);
  rightWing.matrix.translate(2.25, 0.20, zMove).rotate(145, 0, 0, 1).scale(1.5, 0.1, 1);
  rightWing.render();

  const leftWing = new Cube();
  leftWing.color = [1, 1, 0, 1];
  leftWing.matrix = new Matrix4(baseMatrix);
  leftWing.matrix.translate(-1.25, 0.25, zMove).rotate(30, 0, 0, 1).scale(1.5, 0.1, 1).rotate(g_globalAngle, 0, 1, 0);
  leftWing.render();
}

function drawHeadAndFace(baseMatrix, zMove) {
  const head = new Cube();
  head.color = [1, 1, 0, 1];
  head.matrix = new Matrix4(baseMatrix);
  head.matrix.translate(0.05, 0.8, zMove).scale(0.75, 0.5, 0.5).translate(0.1, 0.4, -0.3).rotate(g_globalAngle, 0, 1, 0);
  head.render();

  createEyes(new Matrix4(head.matrix));
  createBeak(new Matrix4(head.matrix));
  createLegs(baseMatrix);
  createFeet(baseMatrix);
}

function createEyes(headMatrix) {
  // Left Eye
  const leftSclera = new Cube();
  leftSclera.color = [1, 1, 1, 1];
  leftSclera.matrix = new Matrix4(headMatrix).translate(0.3, 0.6, -0.1).scale(0.2, 0.2, 0.2);
  leftSclera.render();

  const leftIris = new Cube();
  leftIris.color = [0, 0, 0, 1];
  leftIris.matrix = new Matrix4(leftSclera.matrix).translate(0, 0, -0.05).scale(0.5, 0.5, 0.5);
  leftIris.render();

  // Right Eye
  const rightSclera = new Cube();
  rightSclera.color = [1, 1, 1, 1];
  rightSclera.matrix = new Matrix4(headMatrix).translate(0.6, 0.6, -0.1).scale(0.2, 0.2, 0.2);
  rightSclera.render();

  const rightIris = new Cube();
  rightIris.color = [0, 0, 0, 1];
  rightIris.matrix = new Matrix4(rightSclera.matrix).translate(0, 0, -0.05).scale(0.5, 0.5, 0.5);
  rightIris.render();
}

function createBeak(headMatrix) {
  const beak1 = new Cube();
  beak1.color = [1, 0.5, 0, 1];
  beak1.matrix = new Matrix4(headMatrix).translate(0.45, 0.4, -0.1).rotate(50, 1, 0, 0).scale(0.15, 0.1, 0.2);
  beak1.render();

  const beak2 = new Cube();
  beak2.color = [1, 0.5, 0, 1];
  beak2.matrix = new Matrix4(beak1.matrix).translate(0, -0.15, 0.35).rotate(45, 0, 1, 0).scale(0.7, 1, 0.7);
  beak2.render();
}


// Placeholder click
function click(ev) {
  console.log('Clicked at', ev.clientX, ev.clientY);
}

function sendTextToHTML(text, id) {
  const elem = document.getElementById(id);
  if (!elem) {
    console.error(`Failed to get ${id}`);
    return;
  }
  elem.innerHTML = text;
}

function clearCanvas() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  g_shapeList = [];
}



function createFeet(headMatrix) {
  // Left Foot
  var leftFoot = new Cube();
  leftFoot.color = [1, 0.5, 0, 1]; // Orange color for the foot
  leftFoot.matrix = new Matrix4(headMatrix);
  leftFoot.matrix.translate(0.6, -0.5, 0.55); // Position it below the body
  leftFoot.matrix.rotate(45, 0, 1, 0); // Rotate to give a foot-like appearance
  leftFoot.matrix.scale(0.3, 0.1, 0.5); // Scale to make it look like a foot
  leftFoot.matrix.rotate(g_legAngle, 1, 0, 0);
  leftFoot.render(); // Render the left foot
  
  // Right Foot
  var rightFoot = new Cube();
  rightFoot.color = [1, 0.5, 0, 1]; // Orange color for the foot
  rightFoot.matrix = new Matrix4(headMatrix);
  rightFoot.matrix.translate(-0.2, -0.5, 0.55); // Position it below the body
  rightFoot.matrix.rotate(-45, 0, -1, 0); // Rotate to give a foot-like appearance
  rightFoot.matrix.scale(0.3, 0.1, 0.5); // Scale to make it look like a foot
  rightFoot.matrix.rotate(g_legAngle, 1, 0, 0);
  rightFoot.render(); // Render the right foot
  }
  function createLegs(headMatrix) {
    // Left Leg
    var leftLeg = new Cube();
    leftLeg.color = [1, 0.5, 0, 1]; // Orange color for the leg
    leftLeg.matrix = new Matrix4(headMatrix);
    leftLeg.matrix.translate(.25, -0.5 + g_bodyBounce, 0.45); // Adjust position with body bounce
    leftLeg.matrix.rotate(45, 0, 1, 0); // Rotate to give a leg-like appearance
    leftLeg.matrix.scale(0.1, 0.5, 0.1); // Scale to make it look like a leg
    leftLeg.matrix.rotate(g_legAngle, 1, 0, 0);  // Sync with leg angle
    leftLeg.render(); // Render the left leg
  
    // Right Leg
    var rightLeg = new Cube();
    rightLeg.color = [1, 0.5, 0, 1]; // Orange color for the leg
    rightLeg.matrix = new Matrix4(headMatrix);
    rightLeg.matrix.translate(.75, -0.5 + g_bodyBounce, 0.55); // Adjust position with body bounce
    rightLeg.matrix.rotate(-45, 0, -1, 0); // Rotate to give a leg-like appearance  
    rightLeg.matrix.scale(0.1, 0.5, 0.1); // Scale to make it look like a leg
    rightLeg.matrix.rotate(-g_legAngle, 1, 0, 0);  // Sync with leg angle (opposite direction)
    rightLeg.render(); // Render the right leg
  }
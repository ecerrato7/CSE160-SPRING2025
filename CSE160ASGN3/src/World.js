// Vertex shader program h
var VSHADER_SOURCE =  `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ProjectionMatrix;
  uniform mat4 u_ViewMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    }
`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
  uniform sampler2D u_Sampler5;
  uniform int u_whichTexture;

   void main() {
    if (u_whichTexture == -2) {
        gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) {
        gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else if (u_whichTexture == 0) {
        gl_FragColor = texture2D(u_Sampler0, v_UV); // Grass texture
    } else if (u_whichTexture == 1) {
        gl_FragColor = texture2D(u_Sampler1, v_UV); // Sky texture
    } else if (u_whichTexture == 2) {
    gl_FragColor = texture2D(u_Sampler2, v_UV); // Sheep texture
    } else if (u_whichTexture == 3) {
    gl_FragColor = texture2D(u_Sampler3, v_UV); // Wolf texture
      } else if (u_whichTexture == 4) {
    gl_FragColor = texture2D(u_Sampler4, v_UV); // meteor texture
      
     } else if (u_whichTexture == 5) {
    gl_FragColor = texture2D(u_Sampler4, v_UV); // meteor texture
      } 
    
    else {
        gl_FragColor = vec4(1.0, 0.2, 0.2, 1.0); // Default red color
      }

}
`;

 //gl_FragColor = u_FragColor;
    //gl_FragColor = vec4(v_UV, 0.0, 1.0);
    //gl_FragColor = texture2D(u_Sampler0, v_UV);
// Global Variables
let canvas;

let gl;
let a_Position;
let a_UV;
let u_FragColor; 
let u_Size;
let u_ModelMatrix ;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0
let u_Sampler1;
let u_Sampler2;
let u_whichTexture;
let u_Sampler3;
let u_Sampler4;
let u_Sampler5;

function setupWebGL() {
  canvas = document.getElementById('webgl');  
  if (!canvas) {
      console.error('Failed to retrieve the <canvas> element');
      return;
  }

  gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
  if (!gl) {
      console.error('Failed to get the rendering context for WebGL');
      return;
  }
  gl.enable(gl.DEPTH_TEST);
  console.log('WebGL context initialized:', gl);
}




  
  function connectVariablesToGLSL() {
    if (!initShaders( gl, VSHADER_SOURCE  , FSHADER_SOURCE)) {
      console.error('Failed to initialize shaders.');
      return;
    }

    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0 ) {
        console.error('Failed to get the storage location of a_Position');
    return; 
    }



    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0 ) {
        console.error('Failed to get the storage location of a_UV');
        return;
    }

    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) { 
        console.error('Failed to get the storage location of u_whichTexture');
        return;
      }

    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if(!u_FragColor) {
        console.error('Failed to get the storage location of u_FragColor');
        return;
    }

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if(!u_ModelMatrix) {
        console.error('Failed to get the storage location of u_FragColor');
        return;
    }



    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');

    if (!u_GlobalRotateMatrix) {
      console.error('Failed to get the storage location of u_GlobalRotateMatrix');
    }
  
    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
      console.error('Failed to get the storage location of u_ViewMatrix');
    }



    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
      console.error('Failed to get the storage location of u_ProjectionMatrix');
    }

    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
      console.error('Failed to get the storage location of u_Sampler0');
    }
    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
if (!u_Sampler1) {
    console.error('Failed to get the storage location of u_Sampler1');
    return;
}

u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
if (!u_Sampler2) {
    console.error('Failed to get the storage location of u_Sampler2');
    return;
}

u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
if (!u_Sampler3) {
    console.error('Failed to get the storage location of u_Sampler3');
    return;
}


u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
if (!u_Sampler4) {
    console.error('Failed to get the storage location of u_Sampler4');
    return;
}
    console.log('a_Position:', a_Position);
console.log('u_ModelMatrix:', u_ModelMatrix);
console.log('u_ProjectionMatrix:', u_ProjectionMatrix);
console.log('u_ViewMatrix:', u_ViewMatrix);
    const identityMatrix = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityMatrix.elements);
  }



  let g_leftArmAngle = 0; // Angle for the left arm
  let g_rightArmAngle = 0; // Angle for the right arm
  let g_leftArmAnimation = false; // Animation state for the left arm
  let g_rightArmAnimation = false; // Animation state for the right arm
  //Constants
  const POINT = 0;
  const TRIANGLE =1;
  const CUBE = 2;
  //Globals related UI elements 
  let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
  let g_selectedSize = 5;
  let g_selectedType = POINT;
  let g_globalAngle = 0;
  let g_yellowAngle = 0;
  let g_magentaAngle = 0;
  g_yellowAnimation = false;
  g_magentaAnimation = false;

  function addActionForHTMLUI() {
    document.getElementById('animationYellowOffButton').onclick = function() { g_yellowAnimation = false; g_yellowAngle = 0;renderAllShapes();}
    document.getElementById('animationYellowOnButton').onclick = function() { g_yellowAnimation = true; g_yellowAngle = 0;renderAllShapes();}
    document.getElementById('animationMagentaOffButton').onclick = function() { g_magentaAnimation = false; g_magentaAngle = 0;renderAllShapes();}
    document.getElementById('animationMagentaOnButton').onclick = function() { g_magentaAnimation = true; g_magentaAngle = 0;renderAllShapes();}

    document.getElementById('yellowSlide').addEventListener('mousemove', function() { g_yellowAngle = this.value; renderAllShapes();});
    document.getElementById('magentaSlide').addEventListener('mousemove', function() { g_magentaAngle = this.value; renderAllShapes() ;});

    canvas.onmousemove = function(ev) { if (ev.buttons == 1 )  {click(ev) }  }

    document.getElementById('angleSlide').addEventListener('input', function() {
      g_camera.yaw = parseFloat(this.value);
      g_camera.updateAt();
      renderAllShapes();});
  document.getElementById('leftArmAnimationOn').onclick = function () {g_leftArmAnimation = true;};
document.getElementById('leftArmAnimationOff').onclick = function () { g_leftArmAnimation = false; g_leftArmAngle = 0; };
document.getElementById('rightArmAnimationOn').onclick = function () {g_rightArmAnimation = true;};
document.getElementById('rightArmAnimationOff').onclick = function () {g_rightArmAnimation = false;g_rightArmAngle = 0; };
    
document.getElementById('speedSlider').addEventListener('input', function () {g_camera.speed = parseFloat(this.value);
    console.log('Camera speed:', g_camera.speed);});
    document.getElementById('resetButton').onclick = function () {g_camera.reset();  document.getElementById('angleSlide').value = 0;  
      updateCameraPositionDisplay();
      renderAllShapes(); };
    
    
    document.addEventListener('keydown', function(event) {
      switch (event.key) {
          case 'q': // Pan left
              g_camera.panLeft();
              break;
          case 'e': // Pan right
              g_camera.panRight();
              break;
      }
      updateCameraPositionDisplay();
      renderAllShapes(); // Re-render the scene
  });
  }

  function click(ev) {
   // console.log('Clicked at', ev.clientX, ev.clientY);
  }
  let textures = []; // Array to store textures
  let loadedTextures = 0;

  function loadTexture(imageSrc, textureUnit) {
    const texture = gl.createTexture();
    const image = new Image();
  
    image.onload = function () {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.activeTexture(gl[`TEXTURE${textureUnit}`]);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      textures[textureUnit] = texture;
      loadedTextures++;
  
      if (loadedTextures === 2) {
        requestAnimationFrame(tick); // Only start animation after both textures load
      }
    };
  
    image.src = imageSrc;
  }
  
// for indexhtml
/*
function initTextures() {
  loadTexture('grass.jpg', 0); // Load grass texture into texture unit 0
  loadTexture('sky.jpg', 1);  // Load sky texture into texture unit 1
  loadTexture('sheep.jpg', 2); // Load stone texture into texture unit 2
  loadTexture('wolf.jpg',3);
  loadTexture('meteor.jpg',4);
}
  */
function initTextures() {
  loadTexture('CSE160ASGN3/src/grass.jpg', 0); // Grass texture
  loadTexture('CSE160ASGN3/src/sky.jpg', 1);   // Sky texture
  loadTexture('CSE160ASGN3/src/wolf.jpg', 3);  // Wolf texture
  loadTexture('CSE160ASGN3/src/sheep.jpg', 2); // Sheep texture
  loadTexture('CSE160ASGN3/src/iron.jpg', 4);  // Iron texture
}

  function bindSamplers() {
    gl.uniform1i(u_Sampler0, 0);
    gl.uniform1i(u_Sampler1, 1);
    gl.uniform1i(u_Sampler2,2);
    gl.uniform1i(u_Sampler3,3);
    gl.uniform1i(u_Sampler4,4);
    gl.uniform1i(u_Sampler4,5);
  }
  

  function updateArmAngles() {
    if (g_leftArmAnimation) {
        g_leftArmAngle = 45 * Math.sin(g_seconds); // Oscillate the left arm
    }
    if (g_rightArmAnimation) {
        g_rightArmAngle = 45 * Math.sin(g_seconds); // Oscillate the right arm
    }
}
  function main() {
    setupWebGL(); // Initialize the canvas and WebGL context
    connectVariablesToGLSL();
    addActionForHTMLUI();
    

    initializeFlowerPositions(10, 20, 10); // 10 flowers, floor width 20, floor depth 10
    initializeHerd(); // Initialize the herd of baby animals
    canvas.onmousedown = handleMouseDown;
    canvas.onmouseup = handleMouseUp;
    canvas.onmousemove = handleMouseMove;

    document.onkeydown = keydown;

    initTextures();
    bindSamplers();  
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
   
    requestAnimationFrame(tick);
}


function updateAnimationAngles() {
  if (g_yellowAnimation) {
      g_yellowAngle = 45 * Math.sin(g_seconds);  
  }
  if (g_magentaAnimation) {
      g_magentaAngle = 45 * Math.sin(3 * g_seconds);  
  }
  if (g_leftArmAnimation) {
      g_leftArmAngle = 45 * Math.sin(g_seconds);  
  }
  if (g_rightArmAnimation) {
      g_rightArmAngle = 45 * Math.sin(g_seconds);  
  }
}

  const keyActions = {
    87: () => g_camera.forward(), // W key
    83: () => g_camera.back(),    // S key
    65: () => g_camera.left(),    // A key
    68: () => g_camera.right(),   // D key
    89: () => g_camera.moveup(),  // Y key
    85: () => g_camera.movedown(),// U key
    81: () => g_camera.panLeft(), // Q key
    69: () => g_camera.panRight(),// E key
    88: () => blockManager.addBlock(g_camera), // X key
    67: () => blockManager.deleteBlock(g_camera), // C key
};

function keydown(ev) {
    if (keyActions[ev.keyCode]) {
        keyActions[ev.keyCode]();
        updateCameraPositionDisplay();
        renderAllShapes();
    }
}

  let frameCount = 0;
  let fps = 0;
  let ms = 0;
  let lastTime = performance.now() / 1000.0; 
  var g_camera = new Camera();

  var g_map = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]

  //tick function
    var g_startTime = performance.now()/1000.0;
    var g_seconds = performance.now()/1000.0 - g_startTime;

    function tick() {
      const now = performance.now();
      const deltaTime = now - lastTime;
  
      // Calculate FPS and MS
      frameCount++;
      const elapsedTime = now - g_startTime * 1000; // Total elapsed time in milliseconds
      if (elapsedTime > 1000) { // Update FPS every second
          fps = Math.round((frameCount * 1000) / elapsedTime);
          ms = Math.round(deltaTime);
          frameCount = 0;
          g_startTime = now / 1000.0; // Reset start time
          document.getElementById('fps').innerText = fps;
          document.getElementById('ms').innerText = ms;
      }
  
      if (deltaTime < 16) { // ~60 FPS
          requestAnimationFrame(tick);
          return;
      }
      lastTime = now;
  
      g_seconds = performance.now() / 1000.0 - g_startTime; // Update elapsed time
      updateAnimationAngles(); // Update the angles for animations
      updateArmAngles();
      updateBallPosition(); // Update the ball position
      updateHerd();
      updatePredator(); // Update the predator position
  
      renderAllShapes(); // Re-render the scene
      requestAnimationFrame(tick);
  }

    var g_eye = [0,0,3];
    var g_at = [0,0,-1];
    var g_up = [0,1,0];
  

    // Create an instance of BlockManager
const blockManager = new BlockManager(g_map);

// Add event listeners for adding and deleting blocks
document.addEventListener('keydown', (event) => {
    if (event.key === 'x') { // Add block
        blockManager.addBlock(g_camera);
    } else if (event.key === 'c') { // Delete block
        blockManager.deleteBlock(g_camera);
    }
});



    function renderAllShapes() {
        var startTime = performance.now();
        
        var projMat = new Matrix4();
        projMat.setPerspective(50, 1*canvas.width/canvas.height, 1, 100); //set the perspective matrix
        gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);
      
        //pass the new matrix
        const viewMat = new Matrix4();
       viewMat.setLookAt(
        g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
        g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
        g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]
    );
        gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

        //pass the matrix to u_modelMatrixm attribute
        const globalRRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
        gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRRotMat.elements);

        //clear the canvas
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clear(gl.COLOR_BUFFER_BIT);
        blockManager.renderBlocks();
        drawScene();
      

        drawMap();
         // Render the basketball
   
      

    } 
    function renderBall() {
      const ball = new Sphere(0.2, 30, 30); // Create a sphere for the ball
      ball.textureNum = 2; // Use sheep.jpg texture
      ball.matrix.setTranslate(ballPosition.elements[0], ballPosition.elements[1], ballPosition.elements[2]);
      ball.render();
  }

    function drawCursor() {
      const cursorSize = 1; // Size of the crosshair
      const cursorColor = [1.0, 0.0, 0.0, 1.0]; // Red color for the crosshair
  
      // Horizontal line
      const horizontalLine = new Cube();
      horizontalLine.color = cursorColor;
      horizontalLine.matrix.setIdentity();
      horizontalLine.matrix.translate(-cursorSize / 2, 0, 0);
      horizontalLine.matrix.scale(cursorSize, 0.002, 0.002); // Thin horizontal line
      horizontalLine.render();
  
      // Vertical line
      const verticalLine = new Cube();
      verticalLine.color = cursorColor;
      verticalLine.matrix.setIdentity();
      verticalLine.matrix.translate(0, -cursorSize / 2, 0);
      verticalLine.matrix.scale(0.002, cursorSize, 0.002); // Thin vertical line
      verticalLine.render();
  }
    


    function drawMap() {
      var nbody = new Cube();
      for (let x = 0; x < g_map.length; x++) { // Use g_map.length for rows
          for (let y = 0; y < g_map[x].length; y++) { // Use g_map[x].length for columns
            if (g_map[x] && g_map[x][y] === 1) {
              nbody.color = [1, 1.0, 1.0, 1.0]; // Set cube color
              nbody.matrix.setIdentity(); // Reset the transformation matrix
              nbody.matrix.translate(x - 4, -0.75, y - 4); // Position the cube
              nbody.matrix.scale(1, 1, 1); // Scale the cube
              nbody.render(); // Render the cube
          }
          }
      }
  }

  function updateCameraPositionDisplay() {
    const eye = g_camera.eye.elements;
    const at = g_camera.at.elements;

    // Debugging: Log the camera position and target
    console.log('updateCameraPositionDisplay called');
    console.log(`Camera Position (eye): [${eye[0].toFixed(2)}, ${eye[1].toFixed(2)}, ${eye[2].toFixed(2)}]`);
    console.log(`Camera Target (at): [${at[0].toFixed(2)}, ${at[1].toFixed(2)}, ${at[2].toFixed(2)}]`);

    // Update the UI element (if added)
    const cameraPositionElement = document.getElementById('cameraPosition');
    if (cameraPositionElement) {
        cameraPositionElement.innerText = `
            Camera Position (eye): [${eye[0].toFixed(2)}, ${eye[1].toFixed(2)}, ${eye[2].toFixed(2)}]
            Camera Target (at): [${at[0].toFixed(2)}, ${at[1].toFixed(2)}, ${at[2].toFixed(2)}]
        `;
    }
}


let isMouseDown = false; // Tracks whether the mouse button is pressed
let lastMouseX = 0; // Stores the last X position of the mouse
let lastMouseY = 0; // Stores the last Y position of the mouse
let yaw = 0; // Horizontal rotation angle
let pitch = 0; // Vertical rotation angle

function handleMouseDown(ev) {
    isMouseDown = true;
    lastMouseX = ev.clientX;
    lastMouseY = ev.clientY;
}

function handleMouseUp(ev) {
    isMouseDown = false;
}

function handleMouseMove(ev) {
  if (!isMouseDown) return;

  // Calculate the change in mouse position
  const deltaX = ev.clientX - lastMouseX;
  const deltaY = ev.clientY - lastMouseY;
  lastMouseX = ev.clientX;
  lastMouseY = ev.clientY;

  const sensitivity = 0.1; // Adjust sensitivity for smoother movement
  g_camera.yaw += deltaX * sensitivity; // Update yaw based on horizontal mouse movement
  g_camera.pitch -= deltaY * sensitivity; // Update pitch based on vertical mouse movement

  // Clamp pitch to avoid flipping the camera
  g_camera.pitch = Math.max(-89, Math.min(89, g_camera.pitch));

  // Update the camera's "at" vector based on the new yaw and pitch
  g_camera.updateAt();

  renderAllShapes(); // Re-render the scene
}

function rotateCamera(angleInDegrees) {
  const angle = angleInDegrees * Math.PI / 180; // convert to radians

  let dx = g_eye[0] - g_at[0];
  let dz = g_eye[2] - g_at[2];

  const radius = Math.sqrt(dx * dx + dz * dz);
  let theta = Math.atan2(dz, dx);

  theta += angle;

  g_eye[0] = g_at[0] + radius * Math.cos(theta);
  g_eye[2] = g_at[2] + radius * Math.sin(theta);
}



let ballPosition = new Vector3([0, 0.5, 0]);
let ballVelocity = new Vector3([0, 0, 0]);
let ballHeld = false;
let ballThrown = false;


function updateBallPosition() {
  if (ballHeld) {
      ballPosition = g_camera.eye.add(new Vector3([0, 1, -1])); // Position the ball near the player
  } else if (ballThrown) {
      ballPosition = ballPosition.add(ballVelocity);
      ballVelocity = ballVelocity.mul(0.99); // Simulate drag
  }
}


function renderBall() {
  var ball = new Sphere(0.2, 30, 30);  // Create a sphere for the ball
  ball.color = [1.0, 0.5, 0.0, 1.0];  // Set ball color
  ball.matrix.setTranslate(ballPosition.x, ballPosition.y, ballPosition.z);
  ball.render();
}


function handleSpacePress() {
  if (holdingBall) {
    // Throw the ball in the direction the camera is facing
    holdingBall = false;

    const throwDir = camera.getForwardVector(); // Use your method

    ballVelocity = [
      throwDir.elements[0] * throwStrength,
      throwDir.elements[1] * throwStrength + 0.1, // add upward arc
      throwDir.elements[2] * throwStrength,
    ];
  } else {
    // Try to pick up the ball if close enough and not moving
    const dist = Math.hypot(
      ballPosition[0] - camera.eye.elements[0],
      ballPosition[1] - camera.eye.elements[1],
      ballPosition[2] - camera.eye.elements[2]
    );
    const speed = Math.hypot(...ballVelocity);
    if (dist < 1.5 && speed < 0.1) {
      holdingBall = true;
      ballVelocity = [0, 0, 0];
    }
  }
}



  //ground plane
  /*
  var ground = new Cube();
  ground.color=  [0.0, 1.0, 0.0, 1.0];
  ground.matrix.translate(0, 0, -1);
  ground.matrix.scale(2, .1, 2);
  ground.render();
*/
function drawScene() {
  // Render the floor
  const floorMatrix = new Matrix4();
  floorMatrix.translate(0, -0.75, 0.0);
  floorMatrix.scale(40, -1, 40);
  floorMatrix.translate(-0.5, 0, -0.5);
  var floorMatrixcoordinates = new Matrix4(floorMatrix.matrix);
  const floor = new Cube();
  floor.color = [1.0, 1.0, 1.0, 1.0]; // White color (texture will override this)
  floor.textureNum = 0; // Use texture unit 0 (grass texture)
  floor.matrix = floorMatrix;
  gl.uniform1i(u_whichTexture, 0); // Set texture to grass
  floor.render();

  // Render the skybox
  const skyboxMatrix = new Matrix4();
    skyboxMatrix.scale(100, 100, 100);
    skyboxMatrix.translate(-0.5, -0.5, -0.5);

    const sky = new Cube();
    sky.color = [1.0, 1.0, 1.0, 1.0]; // White color (texture will override this)
    sky.textureNum = 1; // Use texture unit 1 (sky texture)
    sky.matrix = skyboxMatrix;
    gl.uniform1i(u_whichTexture, 1); // Set texture to sky
    sky.render();

  //createValleyOfFlowers();



   //draw the body cube 
   var body = new Cube();
   body.color = [1.0, 1.0, 1.0, 1.0];
   //body.textureNum = 0;
   body.matrix.translate(-0.25, -.75, 0.0);
   body.matrix.rotate(-5,1,0,0);
   body.matrix.scale(0.5, 0.3, 0.5);
   body.render();


   //yellow arm
   var yellow = new Cube();

   yellow.color = [1.0, 1.0, 0.0, 1.0];
   //yellow.textureNum = 4;
   yellow.matrix.setTranslate(0,-.5, 0);
   yellow.matrix.rotate(-5 , 1 , 0, 0);
   yellow.matrix.rotate(-g_yellowAngle, 0, 0, 1);
   var yellowCoordinatesMat = new Matrix4(yellow.matrix);
   yellow.matrix.scale(0.25, .7 ,.5);
   yellow.matrix.translate(-0.5, 0, 0);
   yellow.render();



      //Magenta arm
      var magenta = new Cube();
      magenta.color = [1.0, 0.0, 1.0, 1.0];
      magenta.textureNum = 5;
      magenta.matrix = new Matrix4(yellowCoordinatesMat); // Attach to yellow arm
      magenta.matrix.translate(0,0.65,.1);
      magenta.matrix.rotate(g_magentaAngle, 0, 0, 1);
    
      magenta.matrix.scale(0.3, .3, .3);
      magenta.matrix.translate(-0.5, 0, -0.001);
      magenta.render();
    
   // Render the left arm
   const leftArm = new Cube();
   leftArm.color = [1.0, 0.0, 0.0, 1.0]; // Red color
   leftArm.matrix = new Matrix4(yellowCoordinatesMat); // Attach to magenta arm
   leftArm.matrix.translate(0, .5, -.1); // Attach to the left side of the body
   leftArm.matrix.rotate(g_leftArmAngle, 0, 0, 1); // Animate the arm
   leftArm.matrix.scale(0.1, 0.5, 0.1); // Scale the arm
   leftArm.render();

   // Render the right arm
   const rightArm = new Cube();
   rightArm.color = [0.0, 0.0, 1.0, 1.0]; // Blue color
   rightArm.matrix = new Matrix4(yellowCoordinatesMat);  
   rightArm.matrix.translate(0, .5 , .45);  
   rightArm.matrix.rotate(-g_rightArmAngle, 0, 0, 1);  
   rightArm.matrix.scale(0.1, 0.5, 0.1); 
   rightArm.render();



 
    renderHerd();
    // Render the predator
    const predator = new Cube();
    predator.color = [1.0, 1.0, 1.0, 1.0]; // Default color (texture will override this)
    predator.textureNum = 3; // Use wolf.jpg texture
    predator.matrix.setTranslate(predatorPosition.elements[0], predatorPosition.elements[1], predatorPosition.elements[2]);
    predator.matrix.scale(0.5, 0.5, 0.5);
    gl.uniform1i(u_whichTexture, 3); // Bind the wolf texture
    predator.render();

}



function renderHerd() {
  const babyAnimal = new Sphere(0.2, 30, 30); // Create a sphere for each herd member
  babyAnimal.textureNum = 2; // Use sheep.jpg texture
  babyAnimal.color = [1.0, 1.0, 1.0, 1.0]; // Default color (texture will override this)

  for (const baby of herd) {
      babyAnimal.matrix.setIdentity();
      babyAnimal.matrix.setTranslate(baby.elements[0], baby.elements[1], baby.elements[2]);
      babyAnimal.render();
  }
}
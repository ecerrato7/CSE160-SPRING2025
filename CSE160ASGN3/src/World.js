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
  uniform int u_whichTexture;

  void main() {
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;

    } else if (u_whichTexture == -1) {

      gl_FragColor = vec4(v_UV, 1.0, 1.0);

    } else if (u_whichTexture == 0) {

      gl_FragColor = texture2D(u_Sampler0, v_UV);
    
      } else {
      gl_FragColor = vec4(1.0, 0.2, 0.2, 1.0);
    }
  }


`;

 //gl_FragColor = u_FragColor;
    //gl_FragColor = vec4(v_UV, 0.0, 1.0);
    //gl_FragColor = texture2D(u_Sampler0, v_UV);
// Global Variables
let canvas
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
let u_whichTexture;

function setupWebGL() {
    canvas = document.getElementById('webgl');
    gl = canvas.getContext('webgl',{preserveDrawingBuffer: true});
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

    console.log('a_Position:', a_Position);
console.log('u_ModelMatrix:', u_ModelMatrix);
console.log('u_ProjectionMatrix:', u_ProjectionMatrix);
console.log('u_ViewMatrix:', u_ViewMatrix);
    const identityMatrix = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityMatrix.elements);
  }




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

    document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value;renderAllShapes();});    

    document.getElementById('speedSlider').addEventListener('input', function () {g_camera.speed = parseFloat(this.value);console.log('Camera speed:', g_camera.speed);});

    document.getElementById('resetButton').onclick = function () {g_camera.reset();  document.getElementById('angleSlide').value = 0;   renderAllShapes(); };
  }

  function click(ev) {
   // console.log('Clicked at', ev.clientX, ev.clientY);
  }
  
  function initTextures(){
    /*
        var texture = gl.createTexture();
        if (!texture) {
          console.error('Failed to create the texture object');
          return -1;
        }

        var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
        if (!u_Sampler) {
          console.error('Failed to get the storage location of u_Sampler');
          return -1;
        }

*/
        var image = new Image();
        if (!image) {
          console.error('Failed to create the image object');
          return -1;
        }

        image.onload = function() {
          console.log('Image loaded successfully');
          sendImageToTEXTURE0(image);
          requestAnimationFrame(tick);
        };
        image.src = 'sky.png';
        //add more texture loading

        return true;
  }

//sendImageToTEXTURE0
  function sendImageToTEXTURE0(image) {
    var texture = gl.createTexture();
    if(!texture){
      console.log('Failed to create the texture object');
      return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis

    //enable texture unit 0
    gl.activeTexture(gl.TEXTURE0);

    //bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    //set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
    //set texture image
    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texImage2D(gl.TEXTURE_2D,0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);  

    //set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler0, 0);


    console.log("finished loading texture");

  }




  function main (){
    setupWebGL();
    connectVariablesToGLSL();
    addActionForHTMLUI();
    document.onkeydown = keydown;
    initTextures();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    requestAnimationFrame(tick);
  }


  function updateAnimationAngles() {
    if(g_yellowAnimation) {
      g_yellowAngle = (45*Math.sin(g_seconds));
    }

    if(g_magentaAnimation) {
      g_magentaAngle = (45*Math.sin(3* g_seconds));
    }

  }

  function keydown(ev) {
    if (ev.keyCode == 87) { // W key
        g_camera.forward();
    } else if (ev.keyCode == 83) { // S key
        g_camera.back();
    } else if (ev.keyCode == 65) { // A key
        g_camera.left();
    } else if (ev.keyCode == 68) { // D key
        g_camera.right();
    } else if (ev.keyCode == 81) { // Q key
        g_camera.moveup();
    } else if (ev.keyCode == 69) { // E key
        g_camera.movedown();
    }
    renderAllShapes(); // Re-render the scene
}







  let frameCount = 0;
  let fps = 0;
  let ms = 0;
  let lastTime = performance.now() / 1000.0; 

  //tick function
    var g_startTime = performance.now()/1000.0;
    var g_seconds = performance.now()/1000.0 - g_startTime;

    function tick() {
      // Get the current time
      var currentTime = performance.now() / 1000.0;
      // Calculate elapsed time in seconds
      var deltaTime = currentTime - lastTime;
      // Increment frame count
      frameCount++;
      // Update FPS and MS every second
      if (deltaTime >= 1) {
        fps = frameCount;  // FPS = frames per second
        ms = deltaTime / frameCount * 1000;  // MS per frame
        // Reset for the next second
        frameCount = 0;
        lastTime = currentTime;
      }
    
      // Update the FPS and MS on the page
      document.getElementById('fps').innerText = `FPS: ${fps}`;
      document.getElementById('ms').innerText = `MS per frame: ${ms.toFixed(2)}`;
    
      // Update the elapsed time for animation
      g_seconds = currentTime - g_startTime;
    
      // Update the animation angles based on time
      updateAnimationAngles();
    
      // Render all shapes in the scene
      renderAllShapes();
    
      // Request the next animation frame
      requestAnimationFrame(tick);
    }


    
    var g_eye = [0,0,3];
    var g_at = [0,0-100];
    var g_up = [0,1,0];
  
    function renderAllShapes() {
        var startTime = performance.now();
        
        var projMat = new Matrix4();
        projMat.setPerspective(50, 1*canvas.width/canvas.height, 1, 100); //set the perspective matrix
        gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);
      
        //pass the new matrix
        var viewMat = new Matrix4();
      //  console.log('g_eye:', g_eye);
//console.log('g_at:', g_at);
//console.log('g_up:', g_up);
     // viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], 0, 0, -100, 0, 1, 0);
       // viewMat.setLookAt(0,0,3 , 0,0,-100, 0,1,0);  //eye at up 
      //  viewMat.setLookAt(
        //  g_camera.eye.x, g_camera.eye.y,g_camera.eye.z,
          //g_camera.at.x, g_camera.at.y,g_camera.at.z,
          //g_camera.up.x, g_camera.up.y,g_camera.up.z
        //);
       // console.log('Camera:', g_camera);

       viewMat.setLookAt(
        g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
        g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
        g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]
    );
        gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

        //pass the matrix to u_modelMatrixm attribute
        var globalRRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
        gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRRotMat.elements);

        //clear the canvas
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clear(gl.COLOR_BUFFER_BIT);


        //test cube
        /*
        var testCube = new Cube();
        testCube.color = [1.0, 0.0, 0.0, 1.0]; // Red color
        testCube.textureNum = -2; // Use solid color
        testCube.matrix.setTranslate(0, 0, -5); // Move into view
        testCube.render();
*/


     

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
        //magenta.textureNum = 0;
        magenta.matrix = yellowCoordinatesMat;
        magenta.matrix.translate(0,0.65,0);
        magenta.matrix.rotate(g_magentaAngle, 0, 0, 1);
        magenta.matrix.scale(0.3, .3, .3);
        magenta.matrix.translate(-0.5, 0, -0.001);
        magenta.render();

        //ground plane
        var ground = new Cube();
        ground.color=  [0.0, 1.0, 0.0, 1.0];
        ground.matrix.translate(0, 0, -1);
        ground.matrix.scale(2, .1, 2);
        ground.render();

         //floor 
         var body = new Cube();
         body.color = [1.0, 0.0,0.0, 1.0];
         //body.textureNum = 0;
         body.matrix.translate(0, -.75, 0.0);
         body.matrix.scale(10,0,10);
         body.matrix.translate(-.5,0,-0.5);
         body.render();
 
 
         //skybox
         var sky = new Cube();
         sky.color = [1.0, 1.0, 1.0, 1.0];
         sky.textureNum = 0;
         sky.matrix.scale(50, 50, 50);
         sky.matrix.translate(-.5, -.5, -.5);
         sky.render();
 
    } 

    var g_camera = new Camera();

    var g_map = [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
    ]

    function drawMap(){
      var body = new Cube();
      for(i=0 ; i<2 ; i++){
      for(x=0; x<32 ; x ++){
        for(y=0; y<32 ; y ++){
         // if (x<1 || x == 31 || y<1 || y == 31){
          
         //var body = new Cube();


            body.color = [.8, 1.0, 1.0, 1.0];
            body.matrix.translate(0, -.75, 0);
            body.matrix.scale(0.4, 0.4, 0.4);
            body.matrix.translate(x-16, 0, y-16);
            body.render();
          }
        }
    }
  }
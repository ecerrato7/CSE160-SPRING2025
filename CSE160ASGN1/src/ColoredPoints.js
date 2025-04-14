// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program


var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';
//Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL(){
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  console.log('Canvas width:', canvas.width, 'Canvas height:', canvas.height);


}

function  connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
   a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
   u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }

}
//Global Variables
const POINT = 'point';
const TRIANGLE = 'triangle';
const CIRCLE = 'circle';
let g_selectedColor = [1.0, 1.0, 1.0, 1.0]; 
let g_selectedSize = 5;
let g_selectedType = POINT;  



function addActionForHTMLUI() {
    document.getElementById('Clear').onclick = function() { clearCanvas(); };
    document.getElementById('Red').onclick = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
    document.getElementById('Green').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };


    document.getElementById("redSlide").addEventListener("input", function() {g_selectedColor [0] = this.value/100;});
    document.getElementById("greenSlide").addEventListener("input", function() {g_selectedColor [1] = this.value/100;});
    document.getElementById("blueSlide").addEventListener("input", function() {g_selectedColor [2]= this.value/100;});

    document.getElementById("sizeSlide").addEventListener("input", function() {g_selectedSize  = this.value;});

    //document.getElementById('Point').onclick = function() { g_selectedType = 'point'; };
    document.getElementById('Point').onclick = function() { g_selectedType = POINT; };
    document.getElementById('Draw Triangle').onclick = function() { g_selectedType = TRIANGLE; };
    document.getElementById('Draw Circle').onclick = function() { g_selectedType = CIRCLE; };
    document.getElementById('Draw Picture').onclick = function() { drawPicture(); };
  
  }

function clearCanvas(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    g_shapeList  = [];
}

let g_isDrawing = false; // The flag for drawing

function main() {
    // Retrieve <canvas> element
    setupWebGL();
    console.log('Canvas width:', canvas.width, 'Canvas height:', canvas.height);

    // Initialize shaders
    connectVariablesToGLSL();
    addActionForHTMLUI();

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = function(ev) { 
      g_isDrawing = true;
      click(ev);
  };
  canvas.onmouseup = function(ev) {
      g_isDrawing = false;
  };
  canvas.onmousemove = function(ev) {
      if (g_isDrawing) {
          click(ev);
      }
  };
    //canvas.onmousedown = click;

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}


let g_shapeList = []; // The array for the position of a mouse press

//var g_points = [];  // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_sizes = [];   // The array to store the size of a point



function click(ev) {
   let [x, y] = convertCoordinatesEventToGL(ev);
   let point;
   if (g_selectedType === 'point') {
    point = new Point();
  } else if (g_selectedType === 'triangle') {
    point = new Triangle();
  } else if (g_selectedType === 'circle') {
    point = new Circle();
  }
 
   point.position = [x, y];
   point.color = g_selectedColor.slice();
   point.size = g_selectedSize;
   g_shapeList.push(point);
 
   renderAllShapes();
 
 
   /*
  let point = new Point();
  point.position = [x, y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapeList.push(point);
*/
  // Store the coordinates to g_points array
  //g_points.push([x, y]);
  //g_points.push(g_selectedColor);
  // Store the coordinates to g_points array
  /*
  if (x >= 0.0 && y >= 0.0) {      // First quadrant
    g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  } else if (x < 0.0 && y < 0.0) { // Third quadrant
    g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  } else {                         // Others
    g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  }
    */
    //g_sizes.push(g_selectedColor);
   // g_colors.push(g_selectedColor.slice()); 
   //g_colors.push(g_selectedColor);
   // g_sizes.push(g_size);
   // renderAllShapes();
  
}

function convertCoordinatesEventToGL(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();
    
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    return [x, y];
}

function renderAllShapes(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    //var len = g_points.length;
    for (let i = 0; i < g_shapeList.length; i++) {
      g_shapeList[i].render();
    }
    /*
    for(var i = 0; i < len; i++) {
      var xy = g_shapeList
      var rgba = g_shapeList[i].color;
      var size = g_shapeList[i].size;

       // var xy = g_points[i];
        //var rgba = g_colors[i];
        //var size = g_sizes[i];
        
        
        // Pass the position of a point to a_Position variable
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
       
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
       //Pass the color the color of a point to u_Size variable
        gl.uniform1f(u_Size, size);
        // Draw
        gl.drawArrays(gl.POINTS, 0, 1);
    }
*/
}


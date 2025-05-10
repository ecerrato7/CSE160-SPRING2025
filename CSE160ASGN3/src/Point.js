// Point.js

class Point {
  constructor() {
    this.type = 'point';
    this.position = [0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0]; // Default color: white
    this.size = 5.0; // Default size
  }

  render(gl) {
    var xy = this.position;
    var rgb = this.color;
    var size = this.size;

    gl.uniform4f(u_FragColor, rgb[0], rgb[1], rgb[2], rgb[3]);
    gl.uniform1f(u_Size, size);

    var d = this.size / 200.0;
    drawPoints([xy[0], xy[1]], gl);
  }
}

function drawPoints(vertices, gl) {
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.POINTS, 0, 1); 
}

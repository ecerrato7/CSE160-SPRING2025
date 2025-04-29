class Triangle {
  constructor() {
    this.type = 'triangle';
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 50;
    this.buffer = null;
    this.vertices = null;
  }

  generateVertices() {
    var xy = this.position;
    let d = this.size / 400.0;
    let d2 = this.size / 200.0;

    // Create the vertices for the triangle
    this.vertices = [
      xy[0] - d, xy[1], 0,  // Vertex 1
      xy[0] + d, xy[1], 0,  // Vertex 2
      xy[0], xy[1] + d2, 0   // Vertex 3
    ];
  }

  render(gl) {
    let [r, g, b, a] = this.color;
    const uFragColor = gl.getUniformLocation(gl.program, "uFragColor");

    gl.uniform4f(uFragColor, r, g, b, a);

    // Buffer management: Create once, use multiple times
    if (!this.buffer) {
      this.buffer = gl.createBuffer();
      if (!this.buffer) {
        console.log("Failed to create the buffer object");
        return -1;
      }
    }

    this.generateVertices();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.DYNAMIC_DRAW);

    const aPosition = gl.getAttribLocation(gl.program, "aPosition");
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3); // Draw the triangle
  }
}

function drawTriangle3D(vertices) {
  var n = vertices.length / 3; // 3 components per vertex
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);

  gl.deleteBuffer(vertexBuffer);
}


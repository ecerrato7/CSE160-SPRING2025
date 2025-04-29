class Cube {
    constructor() {
      this.type = "cube";
      this.color = [1.0, 1.0, 1.0, 1.0];  // Color RGBA
      this.matrix = new Matrix4();
    }
  
    render() {
      var rgba = this.color;
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    drawCube(this.matrix);

      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
    }
  }


  function drawCube(matrix) {
    gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements);
  
    // Front face
    drawTriangle3D([
      0, 0, 0,   1, 1, 0,   1, 0, 0,
      0, 0, 0,   0, 1, 0,   1, 1, 0
    ]);
  
    // Back face
    drawTriangle3D([
      0, 0, 1,   1, 0, 1,   1, 1, 1,
      0, 0, 1,   1, 1, 1,   0, 1, 1
    ]);
  
    // Top face
    drawTriangle3D([
      0, 1, 0,   1, 1, 0,   1, 1, 1,
      0, 1, 0,   1, 1, 1,   0, 1, 1
    ]);
  
    // Bottom face
    drawTriangle3D([
      0, 0, 0,   1, 0, 1,   1, 0, 0,
      0, 0, 0,   0, 0, 1,   1, 0, 1
    ]);
  
    // Right face
    drawTriangle3D([
      1, 0, 0,   1, 1, 0,   1, 1, 1,
      1, 0, 0,   1, 1, 1,   1, 0, 1
    ]);
  
    // Left face
    drawTriangle3D([
      0, 0, 0,   0, 1, 1,   0, 1, 0,
      0, 0, 0,   0, 0, 1,   0, 1, 1
    ]);
  }
  



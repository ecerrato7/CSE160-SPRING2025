class Model {
  constructor(gl, filePath) {
    this.filePath = filePath;
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.loader = new OBJLoader(this.filePath);

    this.vertexBuffer = null;
    this.normalBuffer = null;
    this.numVertices = 0;
    this.loaded = false;

    this.loader.parseModel().then(() => {
      this.modelData = this.loader.getModelData();

      // Log data before uploading
      console.log("Raw vertices:", this.modelData.vertices.slice(0, 9));
      console.log("Raw normals:", this.modelData.normals.slice(0, 9));

      // Check if vertices/normals are arrays of objects, flatten if needed
      let vertices = this.modelData.vertices;
      if (vertices.length > 0 && typeof vertices[0] === "object") {
        vertices = vertices.flat();
        console.log("Flattened vertices:", vertices.slice(0, 9));
      }
      let normals = this.modelData.normals;
      if (normals.length > 0 && typeof normals[0] === "object") {
        normals = normals.flat();
        console.log("Flattened normals:", normals.slice(0, 9));
      }

      this.vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW
      );

      this.normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(normals),
        gl.STATIC_DRAW
      );

      this.numVertices = vertices.length / 3;
      this.loaded = true;
      console.log("Dragon OBJ loaded and buffers created!");
      console.log("Vertex count:", vertices.length / 3);
      console.log("Normal count:", normals.length / 3);
      console.log("First 9 vertices:", vertices.slice(0,9));
      console.log("First 9 normals:", normals.slice(0,9));
  

    });
  }

  render(gl, program) {
    if (!this.loaded) {
      // Only render if loaded
      return;
    }
    
    // Set uniforms
    gl.uniformMatrix4fv(program.u_ModelMatrix, false, this.matrix.elements);
    gl.uniform4fv(program.u_FragColor, this.color);

    // Normal matrix
    let normalMatrix = new Matrix4().setInverseOf(this.matrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(program.u_NormalMatrix, false, normalMatrix.elements);

    // Bind and set a_Position
gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
gl.vertexAttribPointer(program.a_Position, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(program.a_Position);

// Bind and set a_Normal
gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
gl.vertexAttribPointer(program.a_Normal, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(program.a_Normal);

const a_UV_loc = gl.getAttribLocation(gl.program, 'a_UV');
if (a_UV_loc >= 0) {
  gl.disableVertexAttribArray(a_UV_loc);
  gl.vertexAttrib2f(a_UV_loc, 0.0, 0.0);
}
    // Draw the OBJ
    gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);
  }
}
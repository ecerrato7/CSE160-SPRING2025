class Sphere {
  constructor(radius = 0.5, slices = 30, stacks = 30) {
    this.radius = radius;
    this.slices = slices; 
    this.stacks = stacks;
    this.color = [1.0, 0.5, 0.0, 1.0]; // Orange color
    this.matrix = new Matrix4();
    this.vertexBuffer = null;
    this.indexBuffer = null;
  }

  generateBuffers() {
    if (this.vertexBuffer && this.indexBuffer) return;

    let vertices = [];
    let indices = [];
    
    for (let i = 0; i <= this.stacks; i++) {
      let lat = Math.PI * i / this.stacks;
      for (let j = 0; j <= this.slices; j++) {
        let lon = 2 * Math.PI * j / this.slices;

        let x = this.radius * Math.sin(lat) * Math.cos(lon);
        let y = this.radius * Math.cos(lat);
        let z = this.radius * Math.sin(lat) * Math.sin(lon);

        vertices.push(x, y, z);
      }
    }

    for (let i = 0; i < this.stacks; i++) {
      for (let j = 0; j < this.slices; j++) {
        let first = i * (this.slices + 1) + j;
        let second = first + this.slices + 1;

        indices.push(first, second, first + 1);
        indices.push(second, second + 1, first + 1);
      }
    }

    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  }

  render() {
    this.generateBuffers();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.uniform4fv(u_FragColor, this.color);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLES, this.indexBuffer.length, gl.UNSIGNED_SHORT, 0);
  }
}

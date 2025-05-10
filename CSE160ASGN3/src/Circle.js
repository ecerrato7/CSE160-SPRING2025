class Circle {
    constructor() {
      this.type = 'circle';
      this.position = [0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 5.0;
      this.segments = 30; // Increase for smoother circles
      this.buffer = null;
      this.vertices = null;
    }
  
    generateVertices() {
      let [x, y] = this.position;
      let d = this.size / 200.0; // delta
      let v = [];
  
      let angleStep = 360 / this.segments;
      for (let angle = 0; angle < 360; angle += angleStep) {
        let angle1 = angle;
        let angle2 = angle + angleStep;
  
        // Create vectors for the two points on the circumference
        let vec1 = [
          Math.cos((angle1 * Math.PI) / 180) * d,
          Math.sin((angle1 * Math.PI) / 180) * d
        ];
        let vec2 = [
          Math.cos((angle2 * Math.PI) / 180) * d,
          Math.sin((angle2 * Math.PI) / 180) * d
        ];
  
        // Define the points on the circumference
        let pt1 = [x + vec1[0], y + vec1[1]];
        let pt2 = [x + vec2[0], y + vec2[1]];
  
        // Add vertices for the triangle (center -> pt1 -> pt2)
        v.push(x, y, pt1[0], pt1[1], pt2[0], pt2[1]);
      }
      this.vertices = new Float32Array(v);
    }
  
    render(gl) {
      let [r, g, b, a] = this.color;
      const uFragColor = gl.getUniformLocation(gl.program, "uFragColor");
      const aPosition = gl.getAttribLocation(gl.program, "aPosition");
  
      gl.uniform4f(uFragColor, r, g, b, a);
  
      if (this.vertices == null) {
        this.generateVertices();
      }
  
      if (this.buffer === null) {
        this.buffer = gl.createBuffer();
        if (!this.buffer) {
          console.log("Failed to create the buffer object");
          return -1;
        }
      }
  
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
  
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aPosition);
  
      gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 2); // Draw the circle as triangles
    }
  }
  

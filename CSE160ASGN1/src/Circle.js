class Circle {
    constructor() {
      this.type = 'circle';
      this.position = [0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 5.0;
      this.segments = 10;
    }
  
    render() {
        let xy = this.position;
        let rgba = this.color;
        let size = this.size;
        var d = this.size / 200.0;
        let angleStep = (2 * Math.PI) / this.segments; // Angle step for each segment

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        
        for (let i = 0; i < this.segments; i++) {
            // Define the angle for the current and next vertex
            let angle1 = i * angleStep;
            let angle2 = (i + 1) * angleStep;

            // Calculate positions for each vertex in the triangle
            let vec1 = [Math.cos(angle1) * d, Math.sin(angle1) * d];
            let vec2 = [Math.cos(angle2) * d, Math.sin(angle2) * d];

            // Create the three points for the triangle: center + two vertices on the circle's perimeter
            let pt1 = [xy[0] + vec1[0], xy[1] + vec1[1]];
            let pt2 = [xy[0] + vec2[0], xy[1] + vec2[1]];

            // Draw the triangle using the center and two vertices
            drawTriangles([xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]]);
        }
    }
}


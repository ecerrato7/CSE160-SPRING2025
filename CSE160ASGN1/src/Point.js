class Point{
    constructor(){
      this.type= 'point';
      this.position= [0.0 , 0.0 ,0.0];
      this.color= [1.0, 1.0, 1.0, 1.0];
      this.size= 5;
    }
    render(){

        gl.vertexAttrib3f(a_Position, this.position[0], this.position[1], 0.0);
        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
        gl.uniform1f(u_Size, this.size);
        gl.drawArrays(gl.POINTS, 0, 1);
    }


}



class Triangle {
    constructor() {
      this.type = 'triangle';
      this.position = [0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 5.0;
    }
  
    render() {
      var d = this.size / 200.0; // small offset for triangle size
  
      let x = this.position[0];
      let y = this.position[1];
  
      let vertices = new Float32Array([
        x, y + d,
        x - d, y - d,
        x + d, y - d,
      ]);
  
      let vertexBuffer = gl.createBuffer();
      if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
      }
  
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_Position);
  
      gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
  
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }
  
  class Circle {
    constructor() {
      this.type = 'circle';
      this.position = [0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 5.0;
      this.segments = 20;
    }
  
    render() {
        let [x, y] = this.position;
        let d = this.size / 200.0;
        let vertices = [];
        
        for (let i = 0; i <= this.segments; i++) {
            let angle = i * 2 * Math.PI / this.segments;
            vertices.push(x + d * Math.cos(angle));
            vertices.push(y + d * Math.sin(angle));
        }
  
        let vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
        
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        
        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.segments);
        
        gl.deleteBuffer(vertexBuffer);
    }
}
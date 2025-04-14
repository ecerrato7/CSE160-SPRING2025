
class Triangle {
    constructor() {
      this.type = 'triangle';
      this.position = [0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 20;
    }
  
    render() {
      var xy =this.position;
      var rgb =  this.color;
      var size =  this.size
  
      gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
      gl.uniform1f(u_Size, size);
      //Draw
      var d = this.size / 200.0;
      var vertices = [
        xy[0], xy[1] + d,         
        xy[0] - d, xy[1] - d,     
        xy[0] + d, xy[1] - d     
    ];

    
    drawTriangles(vertices);
  }
} 
  function drawTriangles(vertices) {

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    var numVertices = vertices.length / 2;
    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
  }
/*
class Triangle {
    constructor() {
      this.type = 'triangle';
      this.position = [0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 5.0;
    }
  
    render() {
      var size = this.size
      var xy = this.position;
      var rgba = this.color;
  
      var d = this.size / 200.0;
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniform1f(u_Size, size);


      drawTriangles(vertices);
    }
  }
  
function drawTriangles(vertices){

    let vertexBuffer = gl.createBuffer();
      if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
      }
  
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_Position);

  
      gl.drawArrays(gl.TRIANGLES, 0, 3);



}
      */
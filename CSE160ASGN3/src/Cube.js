class Cube {
    constructor() {
      this.type = "cube";
      this.color = [1.0, 1.0, 1.0, 1.0];  // Color RGBA
      this.matrix = new Matrix4();
      this.textureNum = -2;
      this.cubeVert32= new Float32Array([
        0, 0, 0,   1, 1, 0,   1, 0, 0,
        0, 0, 0,   0, 1, 0,   1, 1, 0,
        
        0, 1, 0,  0,1,1,   1, 1, 1,
        0, 1, 0,   1, 1, 1,   1, 0, 0,
        
        1,1,0,  1,1,1,   1,0,0,
        1,0,0,  1,1,1 ,  1,0,1,
         
        0,1,0,  0,1,1,   0,0,0,
        0,0,0,  0,1,1,   0,0,1,

        
        0,0,0,  0,0,1,   1,0,1,
        0,0,0,  1,0,1,   1,0,0,
        
        
        0,0,1,  1,1,1,   1,0,1,
        0,0,1,  0,1,1,   1,1,1,
      ]);
      this.cubeVerts = [
        0,0,0,  1,1,0,   1,0,0,
        0,0,0,  0,1,0,   1,1,0,


        0,1,0,  0,1,1,   1,1,1,
        0,1,0,  1,1,1,   1,1,0,

        1,1,0, 1,1,1,   1,0,0,
        1,0,0,  1,1,1 ,  1,0,1,

        0,1,0,  0,1,1,   0,0,0,
        0,0,0,  0,1,1,   0,0,1,

        0,0,0,  0,0,1,   1,0,1,
        0,0,0,  1,0,1,   1,0,0,

        0,0,1,  1,1,1,   1,0,1,
        0,0,1,  0,1,1,   1,1,1,

      ];

    }

    render() {
      var rgba = this.color;
      //pass the texture number
      gl.uniform1i(u_whichTexture, this.textureNum);



      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      //gl.uniform4f(u_whichTexture,this.textureNum);
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      //Pass the matrix to u_ModelMatrix attribute 
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
      // front of the cube
      drawTriangle3DUV([0, 0, 0,   1, 1, 0,   1, 0, 0,], [1,0, 0, 1, 1,1]);
      drawTriangle3DUV([0,0,0 ,  0,1,0 ,    1,1,0], [0,0 , 0,   1, 1,1]);
      
      gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2] * .9,rgba[3]);


        //Top of the cube
      drawTriangle3DUV([ 0,1,0,  0,1,1,  1,1,1], [0,0, 0,1, 1,1]);
      drawTriangle3DUV([ 0,1,0,  1,1,1,  1,1,0], [0,0, 1,1 ,1,0]);

      gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2] * .8,rgba[3]);
      //right of the cube
      drawTriangle3D([ 1,1,0,  1,1,1, 1,0,0]);
      drawTriangle3D([ 1,0,0,  1,1,1 , 1,0,1]);

      gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2] * .7,rgba[3]);
      //left of the cube 
      drawTriangle3D([ 0,1,0, 0,1,1, 0,0,0]);
      drawTriangle3D([ 0,0,0,  0,1,1 , 0,0,1]);
      
      
      gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2] * .6,rgba[3]);
      //bottom of the cube
      drawTriangle3D([ 0,0,0,  0,0,1,  1,0,1]);
      drawTriangle3D([ 0,0,0,  1,0,1,  1,0,0]);

      gl.uniform4f(u_FragColor, rgba[0]*.5, rgba[1]*.5, rgba[2] * .5,rgba[3]);
      //back of the cube
      drawTriangle3D([ 0,0,1,  1,1,1,  1,0,1]);
      drawTriangle3D([ 0,0,1,  0,1,1,  1,1,1]);

    }

    renderfast(){
      var rgba =this.color;
      gl.uniform1i(u_whichTexture, -2);
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
      var allverts =[];
      //front of the cube
      allverts = allverts.concat([0,0,0, 1,1,0, 1,0,0]);
      allverts = allverts.concat([0,0,0, 0,1,0, 1,1,0]);

      //top of the cube
      allverts = allverts.concat([0,1,0, 0,1,1, 1,1,1]);
      allverts = allverts.concat([0,1,0, 1,1,1, 1,1,0]);

      //right of the cube
      allverts = allverts.concat([1,1,0, 1,1,1, 1,0,0]);
      allverts = allverts.concat([1,0,0, 1,1,1, 1,0,1]);

      //left of the cube
      allverts = allverts.concat([0,1,0, 0,1,1, 0,0,0]);
      allverts = allverts.concat([0,0,0, 0,1,1, 0,0,1]);

      //bottom of the cube
      allverts = allverts.concat([0,0,0, 0,0,1, 1,0,1]);  
      allverts = allverts.concat([0,0,0, 1,0,1, 1,0,0]);

      //back of the cube
      allverts = allverts.concat([0,0,1, 1,1,1, 1,0,1]);
      allverts = allverts.concat([0,0,1, 0,1,1, 1,1,1]);

      drawTriangle3D(allverts);

    }
  
  renderfaster(){
    var rgba =this.color; 
    gl.uniform1i(u_whichTexture, -2);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    
    if(g_vertexBuffer == null){
      initTriangle3D();
    }

    //gl.buffer(gl.ARRAY_BUFFER, new Float32Array(this.cubVerts), gl.DYNAMIC_DRAW);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.cubeVerts), gl.DYNAMIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, 36)
  
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
  



// Vertex shader program h
var VSHADER_SOURCE =  `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ProjectionMatrix;
  uniform mat4 u_ViewMatrix;
  attribute vec3 a_Normal;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_NormalMatrix;

  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
   v_Normal = normalize(vec3(u_NormalMatrix *  vec4(a_Normal, 1.0))); 
    //v_Normal = normalize(vec3(u_ModelMatrix * vec4(a_Normal,1)));
    //v_Normal = a_Normal;
    
    v_VertPos = u_ModelMatrix * a_Position;
    }
`;



// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
  uniform sampler2D u_Sampler5;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform bool u_lightOn;
uniform vec3 u_cameraPos;
   void main() {
   if(u_whichTexture == -3) {
        gl_FragColor = vec4((v_Normal + 1.0) / 2.0, 1.0); // Normal debug color

}else if (u_whichTexture == -2) {
        gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) {
        gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else if (u_whichTexture == 0) {
        gl_FragColor = texture2D(u_Sampler0, v_UV); // Grass texture
    } else if (u_whichTexture == 1) {
        gl_FragColor = texture2D(u_Sampler1, v_UV); // Sky texture
    } else if (u_whichTexture == 2) {
    gl_FragColor = texture2D(u_Sampler2, v_UV); // Sheep texture
    } else if (u_whichTexture == 3) {
    gl_FragColor = texture2D(u_Sampler3, v_UV); // Wolf texture
      } else if (u_whichTexture == 4) {
    gl_FragColor = texture2D(u_Sampler4, v_UV);
  } else if (u_whichTexture == 5) {
    gl_FragColor = texture2D(u_Sampler5, v_UV);
} else if (u_whichTexture == 6) {
    gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0); // Default red color
}else {
        gl_FragColor = vec4(1,.2,.2, 1.0); // Default red color
      }

    vec3 lightVector = u_lightPos - vec3(v_VertPos);

    float r =length(lightVector);
    
   // if(r<1.0){
  //gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Black color if the distance is negative
 // } else if(r < 2.0){
   // gl_FragColor = vec4(0,1,0,1)
   
  //}
  //light falloff
 //gl_FragColor = vec4(vec3(gl_FragColor)/(r*r), 1.0); // Apply lighting effect  
  
  //N dot L
  vec3 N = normalize(v_Normal);
  vec3 L = normalize(lightVector);
  float nDotL = max(dot(N, L), 0.0);


  //Reflect
  vec3 R= reflect(-L, N);

  //Eye
  //vec3 eyePos = vec3(0.0, 0.0, 0.0); // in view space
  vec3 E = normalize(u_cameraPos - vec3(v_VertPos));


  //Specular
  float specular = pow(max(dot(E, R), 0.0), 64.0) *  1.8; // Shininess factor

// Diffuse and Ambient
vec3 diffuse = vec3(3.0, 3.0, 2.7) * vec3(gl_FragColor)* nDotL * .7;

vec3 ambient = vec3(gl_FragColor) * .5  ; // Ambient color




  
if(u_lightOn) {
    gl_FragColor = vec4((diffuse + ambient + specular) / (r * r) , 1.0); // Final color with lighting
   // vec3 finalColor = (diffuse + ambient + specular) / (r * r); // Apply attenuation

} else if (!u_lightOn ) {
   gl_FragColor = vec4(gl_FragColor.rgb, 1.0);
}


}
`;
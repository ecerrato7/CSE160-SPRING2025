// rotate.js

// Converts degrees to radians
export function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }
  
  // Rotates a point (x, y) around the origin by a given angle
  export function rotatePoint(x, y, angle) {
    let rad = degreesToRadians(angle);
    let cos = Math.cos(rad);
    let sin = Math.sin(rad);
    return [
      x * cos - y * sin, // Rotated x-coordinate
      x * sin + y * cos  // Rotated y-coordinate
    ];
  }
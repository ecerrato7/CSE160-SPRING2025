 
var canvas;
var ctx;

function handleDrawEvent() {
   
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Read the x and y coordinates for v1 from the input fields
  var x1 = parseFloat(document.getElementById('xInput1').value);
  var y1 = parseFloat(document.getElementById('yInput1').value);
  var v1 = new Vector3([x1, y1, 0]);

  // Read the x and y coordinates for v2 from the input fields
  var x2 = parseFloat(document.getElementById('xInput2').value);
  var y2 = parseFloat(document.getElementById('yInput2').value);
  var v2 = new Vector3([x2, y2, 0]);

  // Draw the vectors
  drawVector(v1, "red");
  drawVector(v2, "blue");
}

function drawVector(v, color) {
  // Set the color for the vector line
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  // Scale the vector's x and y coordinates by 20
  var scaledX = v.elements[0] * 20;
  var scaledY = v.elements[1] * 20;

  // Draw the vector
  ctx.beginPath();
  ctx.moveTo(200, 200);  
  ctx.lineTo(200 + scaledX, 200 - scaledY); 
  ctx.stroke();
}



function angleBetween(v1, v2) {
   
  const dotProduct = Vector3.dot(v1, v2);

  
  const magnitudeV1 = v1.magnitude();
  const magnitudeV2 = v2.magnitude();

   
  // cos(alpha) = dot(v1, v2) / (||v1|| * ||v2||)
  const cosAlpha = dotProduct / (magnitudeV1 * magnitudeV2);
  const angleRadians = Math.acos(Math.max(-1, Math.min(1, cosAlpha)));
  const angleDegrees = angleRadians * (180 / Math.PI);

  const angleRadiansRounded = angleRadians.toFixed(2);
  const angleDegreesRounded = angleDegrees.toFixed(2);
  
  document.getElementById('angleBetweenText').textContent = `Angle between V1 and V2: ${angleRadiansRounded} radians or ${angleDegreesRounded} degrees`;
  console.log(`Angle between vectors: ${angleRadiansRounded} radians, ${angleDegreesRounded} degrees`);

  return { radians: angleRadiansRounded, degrees: angleDegreesRounded };
}

function areaTriangle(v1, v2) {
  const crossProduct = Vector3.cross(v1, v2);
  const areaofParallelogram = crossProduct.magnitude();
  const areaOfTriangle = areaofParallelogram / 2;
  document.getElementById('areaText').textContent = `Area of v1 and v2:: ${areaOfTriangle.toFixed(2)} square units`;

  console.log("Area of the triangle:", areaOfTriangle);

  return areaOfTriangle;
}



function handleDrawOpertionEvent() {
   
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var x1 = parseFloat(document.getElementById('xInput1').value);
  var y1 = parseFloat(document.getElementById('yInput1').value);
  var v1 = new Vector3([x1, y1, 0]);

  var x2 = parseFloat(document.getElementById('xInput2').value);
  var y2 = parseFloat(document.getElementById('yInput2').value);
  var v2 = new Vector3([x2, y2, 0]);

  drawVector(v1, "red");
  drawVector(v2, "blue");

  var operation = document.getElementById('operation').value; // Note: id="operation" in HTML
  var scalar = parseFloat(document.getElementById('scalar').value);

  if (operation === "Add") {
    var result = new Vector3(v1.elements).add(v2);
    drawVector(result, "green");
  } else if (operation === "Sub") {
    var result = new Vector3(v1.elements).sub(v2);
    drawVector(result, "green");
  } else if (operation === "Mul") {
    var result1 = new Vector3(v1.elements).mul(scalar);
    var result2 = new Vector3(v2.elements).mul(scalar);
    drawVector(result1, "green");
    drawVector(result2, "yellow");
  } else if (operation === "Div") {
    if (scalar === 0) {
      console.error("Division by zero is not allowed.");
      return;
    }
    var result1 = new Vector3(v1.elements).div(scalar);
    var result2 = new Vector3(v2.elements).div(scalar);
    drawVector(result1, "green");
    drawVector(result2, "yellow");

  } else if (operation === "Magnitude") {
    console.log("Magnitude of v1:", v1.magnitude());
    console.log("Magnitude of v2:", v2.magnitude());
    var magnitudeV1 = v1.magnitude();   
    var magnitudeV2 = v2.magnitude();  
    
    // Update the webpage with the magnitudes
    document.getElementById('magnitudeV1').textContent = "Magnitude of V1: " + magnitudeV1.toFixed(2);  
    document.getElementById('magnitudeV2').textContent = "Magnitude of V2: " + magnitudeV2.toFixed(2); 
  
  } else if (operation === "Normalize") {
    v1.normalize();
    v2.normalize();
    drawVector(v1, "green");
    drawVector(v2, "green");
    console.log("Normalized v1:", v1.elements);
    console.log("Normalized v2:", v2.elements);

  } else if (operation === "Angle between") {
    // Compute the angle between vectors v1 and v2
    const angle = angleBetween(v1, v2);
    console.log("Angle between v1 and v2:", angle);

  }else if(operation === "Area"){
    const area = areaTriangle(v1, v2);
    console.log("Area", area);

  } else {
    console.error("Unsupported operation selected.");
  }

}

function main() {
   
  canvas = document.getElementById('example');
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element');
    return false;
  }
  ctx = canvas.getContext('2d');
   
  drawVector(new Vector3([2.25, 2.25, 0]), "red");
  document.getElementById('drawButton1').addEventListener('click', handleDrawEvent);
  document.getElementById('drawButton2').addEventListener('click', handleDrawOpertionEvent);
}



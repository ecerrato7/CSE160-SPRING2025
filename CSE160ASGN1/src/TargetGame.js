let g_target = {
  position: [0.0, 0.0],
  size: 20,
  color: [1.0, 0.0, 0.0, 1.0], 
};

let g_score = 0;
let gameStarted = false; 

// Set up the target game
function startTargetGame() {
  console.log("Game Started");
  g_score = 0;
  clearCanvas();
  spawnTarget();
  gameStarted = true;  
  renderAllShapes();  
}

// Spawn a new target at a random position
function spawnTarget() {
  const x = Math.random() * 2 - 1;   
  const y = Math.random() * 2 - 1;  

  g_target.position = [x, y];
  g_target.size = 20 + Math.random() * 30;  
}

// Check if click is inside the target
function isHit(x, y) {
  const dx = x - g_target.position[0];
  const dy = y - g_target.position[1];
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < (g_target.size / 200);  
}

// Handle click event during the target game
function clickTargetGame(ev) {
  let [x, y] = convertCoordinatesEventToGL(ev);

  if (isHit(x, y)) {
    g_score++;
    console.log("Hit! Score: " + g_score);
    spawnTarget();
    renderAllShapes();
  } else {
    console.log("Miss! Score: " + g_score);
  }
}
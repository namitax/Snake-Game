var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;

var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var foodX;
var foodY;

var velocityX = 0;
var velocityY = 0;

var snakeBody = [];

window.onload = function() {
  board = document.getElementById("board");
  board.height = rows * blockSize;
  board.width = cols * blockSize;
  context = board.getContext("2d");

  placeFood();
  document.addEventListener("keyup", changeDirection);
  setInterval(update, 1000 / 5);
};

function update() {
  // Clear board
  context.fillStyle = "red";
  context.fillRect(0, 0, board.width, board.height);

  // Update snake body: each segment takes the position of the one in front.
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  if (snakeBody.length > 0) {
    snakeBody[0] = [snakeX, snakeY];
  }

  // Move head
  snakeX += velocityX * blockSize;
  snakeY += velocityY * blockSize;

  // Eat food: add a new segment at the last segment's position (or at the head if no body exists)
  if (snakeX === foodX && snakeY === foodY) {
    if (snakeBody.length > 0) {
      let lastSegment = snakeBody[snakeBody.length - 1];
      snakeBody.push([lastSegment[0], lastSegment[1]]);
    } else {
      snakeBody.push([snakeX, snakeY]);
    }
    placeFood();
  }

  // Draw food
  context.fillStyle = "green";
  context.fillRect(foodX, foodY, blockSize, blockSize);

  // Draw head: yellow square with a black eye in the center.
  drawHead(snakeX, snakeY);

  // Draw body segments
  for (let i = 0; i < snakeBody.length; i++) {
    const [x, y] = snakeBody[i];
    drawBodySegment(x, y);
  }
}

function drawHead(x, y) {
  // Draw yellow square
  context.fillStyle = "yellow";
  context.fillRect(x, y, blockSize, blockSize);

  // Draw eye (black dot in center)
  context.fillStyle = "black";
  context.beginPath();
  context.arc(x + blockSize / 2, y + blockSize / 2, blockSize / 6, 0, 2 * Math.PI);
  context.fill();
}

function drawBodySegment(x, y) {
  // Draw yellow square
  context.fillStyle = "yellow";
  context.fillRect(x, y, blockSize, blockSize);

  // Draw triangle inside square with a green outline.
  // Use padding so that the triangle with its border is fully contained.
  const padding = 4; // adjust as needed
  const px = x + padding;
  const py = y + padding;
  const size = blockSize - padding * 2;

  context.beginPath();
  context.fillStyle = "black";
  context.strokeStyle = "green";
  context.lineWidth = 2.5;

  if (velocityY === 0) {
    // Moving left or right - triangle points down.
    context.moveTo(px, py);                   // top-left
    context.lineTo(px + size, py);              // top-right
    context.lineTo(px + size / 2, py + size);     // bottom-center
  } else if (velocityY === -1) {
    // Moving up - triangle points right.
    context.moveTo(px, py);                     // top-left
    context.lineTo(px + size, py + size / 2);      // middle-right
    context.lineTo(px, py + size);                // bottom-left
  } else if (velocityY === 1) {
    // Moving down - triangle points left.
    context.moveTo(px + size, py);                // top-right
    context.lineTo(px + size, py + size);           // bottom-right
    context.lineTo(px, py + size / 2);              // middle-left
  }

  context.closePath();
  context.fill();
  context.stroke();
}

function placeFood() {
  foodX = Math.floor(Math.random() * cols) * blockSize;
  foodY = Math.floor(Math.random() * rows) * blockSize;
}

function changeDirection(e) {
  if (e.code === "ArrowUp" && velocityY !== 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.code === "ArrowDown" && velocityY !== -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.code === "ArrowLeft" && velocityX !== 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.code === "ArrowRight" && velocityX !== -1) {
    velocityX = 1;
    velocityY = 0;
  }
}

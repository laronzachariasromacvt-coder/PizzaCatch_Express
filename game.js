const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let tray, toppings, score, gameOver, timeLeft, timer;

const images = {
  noob: new Image(),
  normal: new Image(),
  golden: new Image()
};
images.noob.src = "images/noob_pizza.png";
images.normal.src = "images/normal_pizza.png";
images.golden.src = "images/golden_pizza.png";

function initGame() {
  tray = { x: canvas.width / 2 - 40, y: canvas.height - 30, width: 80, height: 20 };
  toppings = [];
  score = 0;
  gameOver = false;
  timeLeft = 20;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("score").innerText = "Score: " + score + " | Time: " + timeLeft;
  document.getElementById("restartBtn").style.display = "none";
}

function createTopping() {
  const items = ["cheese", "pepperoni", "tomato", "olive"];
  let type = items[Math.floor(Math.random() * items.length)];
  return { 
    x: Math.random() * (canvas.width - 20), 
    y: 0, 
    width: 20, 
    height: 20, 
    speed: 4, 
    type: type 
  };
}

function drawTray() {
  ctx.fillStyle = "#ffcc00";
  ctx.fillRect(tray.x, tray.y, tray.width, tray.height);
}

function drawTopping(t) {
  if (t.type === "cheese") ctx.fillStyle = "yellow";
  else if (t.type === "pepperoni") ctx.fillStyle = "red";
  else if (t.type === "tomato") ctx.fillStyle = "orange";
  else ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.arc(t.x + 10, t.y + 10, 10, 0, Math.PI * 2);
  ctx.fill();
}

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (Math.random() < 0.05) toppings.push(createTopping());

  toppings.forEach(t => t.y += t.speed);

  toppings = toppings.filter(t => {
    if (t.y + t.height >= tray.y && t.x < tray.x + tray.width && t.x + t.width > tray.x) {
      score++;
      document.getElementById("score").innerText = "Score: " + score + " | Time: " + timeLeft;
      return false;
    }
    return t.y < canvas.height;
  });

  drawTray();
  toppings.forEach(drawTopping);

  requestAnimationFrame(update);
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && tray.x > 0) tray.x -= 20;
  if (e.key === "ArrowRight" && tray.x + tray.width < canvas.width) tray.x += 20;
});

function countdown() {
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("score").innerText = "Score: " + score + " | Time: " + timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameOver = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#000";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER!", canvas.width / 2, 80);

  if (score < 10) {
    ctx.drawImage(images.noob, 50, 150, 300, 300);
    ctx.fillText("Noob Pizza 😢", canvas.width / 2, 500);
  } else if (score < 25) {
    ctx.drawImage(images.normal, 50, 150, 300, 300);
    ctx.fillText("Normal Pizza 🍕", canvas.width / 2, 500);
  } else {
    ctx.drawImage(images.golden, 50, 150, 300, 300);
    ctx.fillText("Golden Pizza 🏆🍕", canvas.width / 2, 500);
  }

  document.getElementById("restartBtn").style.display = "inline-block";
}

// Start button logic
document.getElementById("startBtn").addEventListener("click", () => {
  initGame();
  update();
  countdown();
  document.getElementById("startBtn").style.display = "none";
});

// Restart button logic
document.getElementById("restartBtn").addEventListener("click", () => {
  initGame();
  update();
  countdown();
  document.getElementById("startBtn").style.display = "none";
});

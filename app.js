const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const unit = 20;
const column = canvas.width / unit - 1;
const row = canvas.height / unit - 1;
var Game = window.setInterval(moveSnake, 100);
var myScore = document.querySelector("#myScore");
var myMaxScore = document.querySelector("#maxScore");
//創建原始的貪吃蛇
var snake = [];
function origSnake() {
  snake[0] = {
    x: 40,
    y: 0,
  };
  snake[1] = {
    x: 20,
    y: 0,
  };
  snake[2] = {
    x: 0,
    y: 0,
  };
}
origSnake();

//設定果實的原始位置
var fruit = {
  x: Math.round(Math.random() * column) * unit,
  y: Math.round(Math.random() * row) * unit,
  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  },
  checkLocation() {
    let new_x;
    let new_y;
    for (n = 0; n < snake.length; n++) {
      if (this.x == snake[n] && this.y == snake[n]) {
        new_x = Math.round(Math.random() * column) * unit;
        new_y = Math.round(Math.random() * row) * unit;
        this.x = new_x;
        this.y = new_y;
      }
    }
  },
};

//設定分數
//儲存分數
var score = 0;
if (localStorage.maxScore == undefined) {
  var maxScore = 0;
} else {
  maxScore = JSON.parse(localStorage.getItem("maxScore"));
}
myScore.innerHTML = "當前分數 ：" + score;
myMaxScore.innerHTML = "歷史最高分數 ：" + maxScore;

//讓貪吃蛇動起來
//如果撞到牆壁，結束遊戲
let d = "right"; //d = direction
let myFruit = fruit;

window.addEventListener("keydown", changeDirection);
function moveSnake() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightblue";
    } else {
      ctx.fillStyle = "lightgreen";
    }
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeStyle = "white";
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
    myFruit.drawFruit();
    myFruit.checkLocation();
  }
  let HeadX = snake[0].x;
  let HeadY = snake[0].y;
  if (d == "right") {
    HeadX += unit;
  } else if (d == "down") {
    HeadY += unit;
  } else if (d == "left") {
    HeadX -= unit;
  } else if (d == "up") {
    HeadY -= unit;
  }
  let newHead = {
    x: HeadX,
    y: HeadY,
  };

  //吃掉果實後變更位置 + 更新分數
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    snake.unshift(newHead);
    window.addEventListener("keydown", changeDirection);
    myFruit.x = Math.round(Math.random() * column) * unit;
    myFruit.y = Math.round(Math.random() * row) * unit;
    myFruit.checkLocation();
    score++;
    myScore.innerHTML = "當前分數 ：" + score;
  } else {
    snake.unshift(newHead);
    snake.pop();
    window.addEventListener("keydown", changeDirection);
  }

  //變更歷史分數
  if (score > maxScore) {
    maxScore = score;
    myMaxScore.innerHTML = "歷史最高分數 ：" + maxScore;
  }

  //撞牆或碰到自己，結束遊戲
  if (
    snake[0].x < 0 ||
    snake[0].x > canvas.width - unit ||
    snake[0].y < 0 ||
    snake[0].y > canvas.height - unit
  ) {
    localStorage.setItem("maxScore", JSON.stringify(maxScore));
    clearInterval(Game);
    window.setTimeout('alert("遊戲結束")', 80);
  }
  for (i = 1; i < snake.length; i++) {
    if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
      localStorage.setItem("maxScore", JSON.stringify(maxScore));
      clearInterval(Game);
      window.setTimeout('alert("遊戲結束")', 80);
    }
  }
}

//重置歷史分數
var resetScore = document.querySelector("#resetScore");
resetScore.addEventListener("click", reset);

function reset() {
  localStorage.removeItem("maxScore");
}
function changeDirection(e) {
  if (e.key == "ArrowUp" && d != "down") {
    d = "up";
  } else if (e.key == "ArrowRight" && d != "left") {
    d = "right";
  } else if (e.key == "ArrowDown" && d != "up") {
    d = "down";
  } else if (e.key == "ArrowLeft" && d != "right") {
    d = "left";
  }
  //在每次按下上下左右鍵之後，在下一幀被畫出來之前，不接受任何keydown事件，可防止連續按鍵後出現180轉彎的情況
  window.removeEventListener("keydown", changeDirection);
}

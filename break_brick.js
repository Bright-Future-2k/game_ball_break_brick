let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");

let ball = {
    x: 20,
    y: 20,
    radius: 10,
    dx: 2,
    dy: 2,
};

let brickConfig = {
    offsetX: 25,
    offsetY: 25,
    margin: 25,
    width: 70,
    height: 15,
    totalRow: 3,
    totalCol: 5,
};

let brickList = [];
for (let i = 0; i < brickConfig.totalRow; i++) {
    for (let j = 0; j < brickConfig.totalCol; j++) {
        brickList.push({
            x: brickConfig.offsetX + j * (brickConfig.width + brickConfig.margin),
            y: brickConfig.offsetY + i * (brickConfig.height + brickConfig.margin),
            isBroke: false,
        })
    }
}

let paddle = {
    width: 105,
    height: 15,
    x: 0,
    y: canvas.height - 15,
    speed: 15,

    isMoveLeft: false,
    isMoveRight: false,
};

let isGameOver = false;
let isGameWin = false;
let userScore = 0;
let MaxScore = brickConfig.totalCol * brickConfig.totalRow;

document.addEventListener("keydown", function (event) {
    if (event.keyCode === 37) {
        paddle.isMoveLeft = true;
    } else if (event.keyCode === 39) {
        paddle.isMoveRight = true;
    }
});
document.addEventListener("keyup", function (event) {
    if (event.keyCode === 37) {
        paddle.isMoveLeft = false;
    } else if (event.keyCode === 39) {
        paddle.isMoveRight = false;
    }
});

function Ball() {

    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    context.fillStyle = "red";
    context.strokeStyle = "black";
    context.fill();
    context.closePath();
}

function Paddle() {
    context.beginPath();
    context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    context.fill();
    context.closePath();
}

// 2 * OFFSET + 5 * WIDTH + 4 * MARGIN = 500;
// OFFSET = căn 2 lề 2 bên;
// WIDTH = cột khoảng chiều rộng
// MARGIN = khoảng cách giữa các viên gạch
// OFFSET = MARGIN = 25;
// => WIDTH: 70;
// ROW = 3 HÀNG
// COL = 5 CỘT

function drawBrick() {
    brickList.forEach(function (b) {
        if (!b.isBroke) {
            context.beginPath();
            context.rect(b.x, b.y, brickConfig.width, brickConfig.height);
            // brickConfig.offsetX + j * (brickConfig.width + brickConfig.margin),
            // brickConfig.offsetY + i * (brickConfig.height + brickConfig.margin),
            // 70,
            // 15,
            context.fillStyle = "black";
            context.strokeStyle = "blue";
            context.fill();
            context.stroke();
            context.closePath();
        }
    })

}

function moveBall() {
    if (ball.x - ball.radius < 0 || ball.x > canvas.width - ball.radius) {
        ball.dx = -ball.dx;
    } else if (ball.y < ball.radius) {
        ball.dy = -ball.dy;
    }
}

function goBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function movePaddle() {
    if (paddle.isMoveLeft) {
        paddle.x -= paddle.speed;
    } else if (paddle.isMoveRight) {
        paddle.x += paddle.speed;
    }
    if (paddle.x < 0) {
        paddle.x = 0;
    } else if (paddle.x > canvas.width - paddle.width) {
        paddle.x = canvas.width - paddle.width;
    }
}

function ballConnectPaddle() {
    if (ball.x + ball.radius >= paddle.x && ball.x + ball.radius <= paddle.x + paddle.width && ball.y + ball.radius >= canvas.height - paddle.height) {
        ball.dy = -ball.dy;
    }
}

function ballBreakBrick() {
    brickList.forEach(function (b) {
        if (!b.isBroke) {
            if (ball.x >= b.x && ball.x <= b.x + brickConfig.width && ball.y + ball.radius >= b.y && ball.y + ball.radius <= b.y + brickConfig.height) {
                ball.dy = -ball.dy;
                b.isBroke = true;
                userScore += 1;
                if (userScore >= MaxScore) {
                    isGameOver = true;
                    isGameWin = true;
                }
            }
        }
    })
}

function checkGame() {
    if (ball.y > canvas.height - ball.radius) {
        isGameOver = true;
    }
}

function drawWin() {
    context.beginPath();
    context.font = "30px Arial";
    context.fillText("You win", canvas.width / 2, canvas.height / 2,);
    context.fillStyle = "red";
    context.strokeStyle = "black";
    context.fill();
    context.stroke();
    context.closePath();
}

function drawLose() {
    context.beginPath();
    context.font = "30px Arial";
    context.fillText("You Lose", canvas.width / 2, canvas.height / 2,);
    context.fillStyle = "red";
    context.strokeStyle = "black";
    context.fill();
    context.stroke();
    context.closePath();
}

function endGame() {
    if (isGameWin) {
        drawWin();
    } else {
        drawLose();
    }
}

function draw() {
    if (!isGameOver) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        Paddle();
        moveBall();
        drawBrick();
        movePaddle();
        ballConnectPaddle();
        goBall();
        Ball();
        ballBreakBrick();
        checkGame();

        requestAnimationFrame(draw, 200);
    } else {
        endGame();
    }
}

draw();


const bw = 600;
const bh = 600;
const snakeColour = 'lightgreen';
const snakeBorderColour = 'darkgreen';
let gameOva = document.getElementById("gameOver");
let startGamePage = document.getElementById("startGame");
let playGame = document.getElementsByTagName("button");

//first placement of snake
let snake = [
    {x:300, y:300},
    {x:280, y:300},
    {x:260, y:300},
    {x:240, y:300},
    {x:220, y:300}
]
//hides game over until EndGame
gameOva.style.display = "none";
//hides startGame this will change as i let start onLoad
startGamePage.style.display = "block";
//users score
let score = 0;
//when set to true the snake is changing direction
let changingDirection = false;
//Food x-coords
let foodX;
//Food y-coords
let foodY;
//horizontal velocity
let dx = 20;
//vertical veloctiy
let dy = 0;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//starts game
//function to react to the press play button
function readyToPlay() {
    startGamePage.style.display = "none";
    main();
}
//create the first food location
createFood();
//call changeDirection whenever a key is pressed
document.addEventListener("keydown", changeDirection);
//listens to the playGame Button
document.addEventListener("click", readyToPlay);
//this function moves constantly by recalling its movement.
function main() {
    if (didGameEnd()) return gameOva.style.display = "block";
    setTimeout(function onTick() {
        changingDirection = false      //fixes a bug when one click too quickly
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();
        main();
    }, 100);
}

// clears the canvas keeping in case of design change using the grid now to help visualize
function clearCanvas() {
    ctx.fillStyle = "#5b5a58";
    ctx.strokeStyle = "black";

    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function didGameEnd() {
    for (i = 4; i < snake.length; i++) {
        const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y
        if(didCollide) 
        return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > canvas.width - 20;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > canvas.height - 20;
    //reveals the Game Over div
    
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall 
}

//draws the food onto the canvas
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'darkred';
    ctx.fillRect(foodX, foodY, 20, 20);
    ctx.strokeRect(foodX, foodY, 20, 20);
}

//moves the head of my snake array and then lets the bottom follow
function advanceSnake() {
    //Create the new Snake's head
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    //add the new head to the start of snake body
    snake.unshift(head);
    //checks if the head at the food if true then creates food. else continues as normal.
    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        //increases score
        score += 10;
        //puts score on screen
        document.getElementById('score').innerHTML = "SCORE<br>" + score;
        createFood();
    } else {
        snake.pop();
    }
}

//creates a random number to help generate coordinates
function randomTen(min, max){
    return Math.round((Math.random() * (max-min) + min) / 20) * 20;
} 

//applies randomTen() to apply to coordinates
function createFood() {
    foodX = randomTen(0, canvas.width - 20);
    foodY = randomTen(0, canvas.height - 20);
    //checks to make sure food doesn't spawn on the snake
    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x == foodX && part.y == foodY
        if (foodIsOnSnake){
            createFood();
        }
    });
}
//allows the snake the be drawn on the canvas
function drawSnake() {
    snake.forEach(drawSnakePart);
}
//creates the snakes shape and colour
function drawSnakePart(snake) {
    //says what type of colour for part
    ctx.fillStyle = snakeColour;
    ctx.strokeStyle = snakeBorderColour;
//creates "rectangles" that hold the colours
    ctx.fillRect(snake.x, snake.y, 20, 20);
    ctx.strokeRect(snake.x, snake.y, 20, 20);
}

function changeDirection(event) {
    //these link wasd to a variable
    const lk = 65;
    const rk = 68;
    const uk = 87;
    const dk = 83;
    //for when someone clicks to quickly this helps check a space of movement before 100ms is done.
    if(changingDirection) return;
    changingDirection = true;

    //sets velocity to the keys clicked
    const keyPressed = event.keyCode;

    const goingUp = dy === -20;
    const goingDown = dy === 20;
    const goingRight = dx === 20;
    const goingLeft = dx === -20;
    //allows for no reverse snake & changes the velocity pattern
    if (keyPressed === lk && !goingRight) {
        dx = -20;
        dy = 0;
    }
    if (keyPressed === uk && !goingDown) {
        dx = 0;
        dy = -20;
    }
    if (keyPressed === rk && !goingLeft) {
        dx = 20;
        dy = 0;
    }
    if (keyPressed === dk && !goingUp) {
        dx = 0;
        dy = 20;
    }
}


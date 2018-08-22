const Brick = require('./brick');
const Ball = require('./ball');
const Paddle = require('./paddle');

class Game {
  constructor(canvas, ctx, canvasW, canvasH ){
    this.canvas = canvas;
    this.ctx = ctx;
    this.canvasW = canvasW;
    this.canvasH = canvasH;
    this.bricks = [];
    this.brickRowCount = 3;
    this.brickColumnCount = 8;
    this.brickPadding = 14.4;
    this.brickWidth = 74.4;
    this.brickHeight = 18;
    this.brickOffsetTop = 58;
    this.brickOffsetLeft= 38;

    this.paddle = new Paddle(ctx, canvasW, canvasH);
    this.x = canvasW/2;
    this.y = canvasH - 35;
    this.ball = new Ball(ctx, canvasW, canvasH, this.x, this.y);
    this.rightPressed = false;
    this.leftPressed = false;

    this.createBricks();
    this.paddleListeners();
    this.ball.createBall();
  }

  mouseMoveHandler(e) {
    let relativeX = e.clientX - this.canvas.offsetLeft;
    if ( relativeX > this.paddle.paddleWidth/2+ 3 && relativeX < this.paddle.canvasW - this.paddle.paddleWidth/2 - 3 ) {
      this.paddle.paddleX = relativeX - this.paddle.paddleWidth/2;
    }
  }
  keyDownHandler(e) {
    if (e.keyCode == 39) {
      this.rightPressed = true;
    } else if (e.keyCode == 37 ) {
      this.leftPressed = true;
    }
  }
  keyUpHandler(e) {
    if (e.keyCode == 39 ) {
      this.rightPressed = false;
    } else if (e.keyCode == 37 )  {
      this.leftPressed = false;
    }
  }
  paddleListeners() {
    document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
    document.addEventListener("keyup", this.keyUpHandler.bind(this), false);
    document.addEventListener("mousemove", this.mouseMoveHandler.bind(this), false);

}

  movePaddle(){
    if (this.paddle.paddleX > this.paddle.paddleWidth/2 && this.paddle.paddleX < this.canvasW - this.paddle.paddleWidth/2 ) {
      if ( this.rightPressed ) {
      this.paddle.paddleX+= 5;
      } else if ( this.leftPressed) {
      this.paddle.paddleX-= 5;
      }
    }
  }

  createBricks() {
    for( let c = 0; c < 3; c++ ) {
      for ( let r = 0; r < 8; r ++) {
        let x = this.brickOffsetLeft + (r * this.brickWidth) + (r * this.brickPadding);
        let y =this.brickOffsetTop + (c * this.brickHeight) + (c* this.brickPadding);
        let brick = new Brick(this.ctx, this.brickWidth, this.brickHeight, x, y);
        this.bricks.push(brick);
      }
    }

  }

  drawBricks(){
      this.bricks.forEach( brick => brick.drawBrick());
  }
  // moveBall() {
  //   if ( this.ball.x > 0 && this.ball.x < this.canvasW && this.ball.y < this.canvasH)
  //   this.ball.x += 2;
  //   this.ball.y += -2;
  // }
  drawBall(){
    this.ctx.drawImage( this.ball.image, this.ball.x-this.ball.ballRadius, this.ball.y+5, this.ball.ballWidth, this.ball.ballHeight);
    if ( this.ball.x > 0 && this.ball.x < this.canvasW && this.ball.y < this.canvasH)
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;
  }
  collisionDetection() {
    if (this.ball.x - this.ball.ballRadius <= 0 || this.ball.x + this.ball.ballWidth >= this.canvasW) {
      this.ball.dx = -this.ball.dx;
    }
    this.bricks.forEach( brick => {
      if (this.ball.y + this.ball.ballHeight >= brick.brickY && this.ball.y <= brick.brickY + brick.brickHeight
        && this.ball.x + this.ball.ballWidth >= brick.brickX && this.ball.x <= brick.brickX + brick.brickWidth) {
        brick.destroyed = true;
        // this.bricks.
        this.ball.dy = -this.ball.dy;
        console.log(this.ball.dy);
        this.animate();
      }
    }
  );
    if (this.ball.y + this.ball.ballHeight >= this.canvasH - this.paddle.paddleHeight && this.ball.x > this.paddle.paddleX && this.ball.x < this.paddle.paddleX+ this.paddle.paddleWidth) {
      this.ball.dy = -this.ball.dy;
      // this.ball.dy+=0.15;
      // if ( this.ball.dx > 0) {
      //   this.ball.dx+=0.15;
      // } else {
      //   this.ball.dx -=0.15;
      // }
    }
  }
  animate() {
    // console.log('log?',this.bricks);
    this.ctx.clearRect(0, 0, this.canvasW, this.canvasH);
    this.drawBricks();
    this.drawBall();
    this.paddle.drawPaddle();
    this.movePaddle();
    // this.ball.createBall();
    // this.moveBall();
    this.collisionDetection();
    requestAnimationFrame(this.animate.bind(this));
    // setTimeout(this.animate.bind(this), 100);
  }
}

module.exports = Game;
// export default Game;
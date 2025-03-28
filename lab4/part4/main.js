window.onload = function() {
    
  const para = document.querySelector('p');
  let count = 0;
  
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  
  function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  function random(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
  }
  
  function randomRGB() {
      return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
  }
  
  class Shape {
      constructor(x, y, velX, velY) {
          this.x = x;
          this.y = y;
          this.velX = velX;
          this.velY = velY;
      }
  }
  
  class Ball extends Shape {
      constructor(x, y, velX, velY, color, size) {
          super(x, y, velX, velY);
          this.color = color;
          this.size = size;
          this.exists = true;
      }
  
      draw() {
          ctx.beginPath();
          ctx.fillStyle = this.color;
          ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
          ctx.fill();
      }
  
      update() {
          if ((this.x + this.size) >= canvas.width || (this.x - this.size) <= 0) {
              this.velX = -this.velX;
          }
  
          if ((this.y + this.size) >= canvas.height || (this.y - this.size) <= 0) {
              this.velY = -this.velY;
          }
  
          this.x += this.velX;
          this.y += this.velY;
      }
  
      collisionDetect() {
          for (const ball of balls) {
              if (!(this === ball) && ball.exists) {
                  const dx = this.x - ball.x;
                  const dy = this.y - ball.y;
                  const distance = Math.sqrt(dx * dx + dy * dy);
  
                  if (distance < this.size + ball.size) {
                      ball.color = this.color = randomRGB();
                  }
              }
          }
      }
  }
  
  class EvilCircle extends Shape {
      constructor(x, y) {
          super(x, y, 20, 20);
          this.color = "white";
          this.size = 10;
  
          window.addEventListener('keydown', (e) => {
              switch(e.key) {
                  case 'a': this.x -= this.velX; break;
                  case 'd': this.x += this.velX; break;
                  case 'w': this.y -= this.velY; break;
                  case 's': this.y += this.velY; break;
              }
          });
      }
  
      draw() {
          ctx.beginPath();
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 3;
          ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
          ctx.stroke();
      }
  
      checkBounds() {
          if ((this.x + this.size) >= canvas.width) this.x -= this.size;
          if ((this.x - this.size) <= 0) this.x += this.size;
          if ((this.y + this.size) >= canvas.height) this.y -= this.size;
          if ((this.y - this.size) <= 0) this.y += this.size;
      }
  
      collisionDetect() {
          for (const ball of balls) {
              if (ball.exists) {
                  const dx = this.x - ball.x;
                  const dy = this.y - ball.y;
                  const distance = Math.sqrt(dx * dx + dy * dy);
  
                  if (distance < this.size + ball.size) {
                      ball.exists = false;
                      count--;
                      para.textContent = 'Ball count: ' + count;
                  }
              }
          }
      }
  }
  
  const balls = [];
  
  while (balls.length < 25) {
      const size = random(10, 20);
      const ball = new Ball(
          random(0 + size, canvas.width - size),
          random(0 + size, canvas.height - size),
          random(-7, 7),
          random(-7, 7),
          randomRGB(),
          size
      );
      balls.push(ball);
      count++;
      para.textContent = 'Ball count: ' + count;
  }
  
  const evilBall = new EvilCircle(random(0, canvas.width), random(0, canvas.height));
  
  function loop() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      for (const ball of balls) {
          if (ball.exists) {
              ball.draw();
              ball.update();
              ball.collisionDetect();
          }
      }
  
      evilBall.draw();
      evilBall.checkBounds();
      evilBall.collisionDetect();
  
      requestAnimationFrame(loop);
  }
  
  loop();
};

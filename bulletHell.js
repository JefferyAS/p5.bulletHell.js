function rectToRect(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
  if (r1x + r1w >= r2x && // r1 right edge past r2 left
    r1x <= r2x + r2w && // r1 left edge past r2 right
    r1y + r1h >= r2y && // r1 top edge past r2 bottom
    r1y <= r2y + r2h) { // r1 bottom edge past r2 top
    return true;
  }
  return false;
}

function circleRect(cx, cy, radius, rx, ry, rw, rh) {

  // temporary variables to set edges for testing
  testX = cx;
  testY = cy;

  // which edge is closest?
  if (cx < rx) testX = rx; // test left edge
  else if (cx > rx + rw) testX = rx + rw; // right edge
  if (cy < ry) testY = ry; // top edge
  else if (cy > ry + rh) testY = ry + rh; // bottom edge

  // get distance from closest edges
  distX = cx - testX;
  distY = cy - testY;
  distance = sqrt((distX * distX) + (distY * distY));

  // if the distance is less than the radius, collision!
  if (distance <= radius) {
    return true;
  }
  return false;
}

function setUpBullet(image, damage, speed, width, height) {
  return new bullet(false, image, damage, speed, width, height);
}

function setUpBullet(image, damage, speed, radius) {
  return new bullet(true, image, damage, speed, radius, radius);
}

function setUpPlayer(image, health, speed, width, height, startPosX, startPosY) {
  return new player(image, health, speed, width, height, startPosX, startPosY);
}
class bullet {
  //rect constructor
  constructor(isCircle, image, damage, speed, width, height) {
    this.image = image;
    this.posX = [];
    this.posY = [];
    this.isStart=false;
    this.speed=speed;
    this.isCircle=isCircle;
    if (isCircle) {
      this.radius = width;
    }
    this.width = width;
    this.height = height;
    this.damage=damage;

  }
  detectCollision(player) {
    if (this.isCircle) {
      for (let i = 0; i < this.posX.length; i++) {
        if (circleRect(this.posX[i], this.posY[i], this.radius, player.posX, player.posY, player.width, player.height)) {
          //console.log("Collide");
          player.loseHealth(this.damage);
          this.posX.splice(i, 1);
          this.posY.splice(i, 1);
        }
      }
    } else {
      for (let i = 0; i < this.posX.length; i++) {
        if (rectToRect(this.posX[i], this.posY[i], this.width, this.height, player.posX, player.posY, player.width, player.height)) {
          player.loseHealth(this.damage);
          this.posX.splice(i, 1);
          this.posY.splice(i, 1);
        }
      }
    }
  }
  move() {
    for (let i = 0; i < this.posX.length; i++) {
      this.posY[i] += this.speed;
      if (this.posY[i] > height) {
        this.posX.splice(i, 1);
        this.posY.splice(i, 1);
      }
    }
  }
  draw() {
    if(this.isCircle){imageMode(CENTER);}
    else{imageMode(CORNER);}
    for (let i = 0; i < this.posX.length; i++) {
      image(this.image, this.posX[i], this.posY[i], this.height, this.width);
    }
  }
  showCollider() {
    stroke(255, 0, 0);
    strokeWeight(3);
    noFill();
    for (let i = 0; i < this.posX.length; i++) {
      if (this.isCircle) {
        circle(this.posX[i], this.posY[i], this.radius);
      } else {
        rect(this.posX[i], this.posY[i], this.width, this.height);
      }
    }
  }
  test() {
    if (this.posX.length == 0) {
      this.posX.push(width / 2);
      this.posY.push(0);
    }
  }
  setGenerator(interval){
    this.interval=interval;
    this.timer=interval;
    this.min=0;
    this.max=width;
  }
  generate(){
    if(this.timer<=0){
      this.posX.push(random(this.min,this.max));
      this.posY.push(0);
      this.timer=this.interval;
    }
    else{
      this.timer-=deltaTime/1000;
    }
  }
  check(player){
    this.move();
    this.draw();
    this.detectCollision(player);
    if(this.isStart){
      this.generate();
    }
  }
  start(){
    this.isStart=true;
  }
  stop(){
    this.isStart=false;
  }
}
class player {
  constructor(image, health, speed, width, height, startPosX, startPosY) {
    this.image = image;
    this.health = health;
    this.speed = speed;
    this.width = width;
    this.height = height;
    this.posX = startPosX;
    this.posY = startPosY;
    this.setKey(87, 83, 65, 68, 32);
  }
  setKey(upKey, downKey, leftKey, rightKey, shootKey) {
    this.upKey = upKey;
    this.downKey = downKey;
    this.rightKey = rightKey;
    this.leftKey = leftKey;
    this.shootKey = shootKey;
  }
  move() {
    //move up
    if (keyIsDown(this.upKey)) {
      if (this.posY - this.speed > 0) {
        this.posY -= this.speed;
      }
    }
    if (keyIsDown(this.downKey)) {
      if (this.posY + this.speed < height - this.height) {
        this.posY += this.speed;
      }
    }
    if (keyIsDown(this.leftKey)) {
      if (this.posX - this.speed > 0) {
        this.posX -= this.speed;
      }
    }
    if (keyIsDown(this.rightKey)) {
      if (this.posX + this.speed < width - this.width) {
        this.posX += this.speed;
      }
    }
  }
  draw() {
    imageMode(CORNER);
    image(this.image, this.posX, this.posY, this.width, this.height);
  }
  showCollider() {
    stroke(255, 0, 0);
    strokeWeight(3);
    noFill();
    rect(this.posX, this.posY, this.width, this.height);
  }
  loseHealth(damage) {
    this.health -= damage;
  }
  check(){
    this.move();
    this.draw();
  }
}

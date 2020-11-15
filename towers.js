let liveTowers = [];
let liveBullets = [];
let selectedTower = 0;

class Tower {
  constructor(x, y, towerNum) {
    Object.assign(this, towerTypes[towerNum]);
    this.sprite = createSprite(x, y, 100);
    //this.sprite.debug = true;
    this.sprite.addImage(towerImg[this.id]);
    this.sprite.setCollider("circle", 0, 0, 20);
    this.sprite.rotateToDirecton = true;
    this.sellCost = round(this.towerCost * 0.7)
    this.shots = 0;
    this.clickBuffer = 100;
    this.timer = 0;
    this.currentTarget = 0;
    this.bullet;
    this.sprite.mouseActive = true;
  }

  //Occurs if player holds tower above areas where towers can't be placed
  cantPlace() {
    fill(255, 0, 0, 125);
    strokeWeight(2);
    circle(mouseX, mouseY, selectedTower.towerRange * 2);
    if (selectedTower.sprite.mouseIsPressed) {
      selectedTower.sprite.remove();
      selectedTower = 0;
    }
  }

  purchaseTower() {
    fill(0, 0, 0, 125);
    strokeWeight(2);
    circle(mouseX, mouseY, selectedTower.towerRange * 2);
    if (selectedTower.sprite.mouseIsPressed) {
      selectedTower.sprite.setCollider("circle", 0, 0, selectedTower.towerRange);
      selectedTower.isPurchased = true;
      game.playerMoney -= selectedTower.towerCost;
      liveTowers.push(selectedTower);
      selectedTower = 0;
      clicksound.play()
    }
  }

  showRange(r, g, b) {
    fill(r, g, b, 125);
    strokeWeight(2);
    circle(
      selectedTower.sprite.position.x,
      selectedTower.sprite.position.y,
      selectedTower.towerRange * 2
    );
  }

  selectPurchasedTower() {
    if (this.sprite.mouseIsOver) {
      console.log("Mouse is Over");
      this.d = dist(mouseX, mouseY, this.sprite.position.x, this.sprite.position.y);
      if (this.d < 25) {
        cursor(HAND);
        if (mouseWentUp()) {
          console.log("You clicked the centre");
          selectedTower = this;
          selectsound.play();
        }
      }
    }
  }

  shootEnemy() {
    this.bullet = new Bullet(
      this.sprite.position,
      this.bulletType,
      this.currentTarget.position,
      this.sprite, false
    );
    this.shots++
    if(this.towerBuffs.indexOf("doubleshot") == 0){
      this.bullet = new Bullet(this.sprite.position,
        this.bulletType,
        this.currentTarget.position,
        this.sprite,true)
      this.shots++
    }
      this.attackTimer = 0;
      this.canShoot = false;
  }
}

class Bullet {
  constructor(position, bulletNum, target, parent, delay) {
    this.parent = parent;
    this.sprite = createSprite(position.x, position.y, 10, 10);
    this.sprite.timer = 0
    this.sprite.delay = delay
    this.targetSet = false
    this.target = { x: target.x, y: target.y };
    Object.assign(this.sprite, bulletTypes[bulletNum]);
    this.sprite.scale = 1.5
    this.sprite.life = 45
    this.sprite.addImage(bulletImg[this.sprite.spriteIndex])
    this.sprite.attractionPoint(this.sprite.speed, target.x, target.y);
    bulletGroup.add(this.sprite);
    liveBullets.push(this);
  }
}

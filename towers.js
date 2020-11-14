let liveTowers = [];
let liveBullets = [];
let selectedTower = 0;

class Tower {
  constructor(x, y, towerNum) {
    Object.assign(this, towerTypes[towerNum]);
    this.sprite = createSprite(x, y, 100);
    this.sprite.debug = true;
    this.sprite.addImage(towerImg[this.id]);
    this.sprite.setCollider("circle", 0, 0, 20);
    this.sprite.rotateToDirecton = true;
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

  //Takes money from player and makes tower immovable
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
    }
  }

  //Shows range of tower
  showRange(r, g, b) {
    fill(r, g, b, 125);
    strokeWeight(2);
    circle(
      selectedTower.sprite.position.x,
      selectedTower.sprite.position.y,
      selectedTower.towerRange * 2
    );
  }

  //Selects a tower that you have placed down on the playing field with mouse
  selectPurchasedTower() {
    if (this.sprite.mouseIsOver) {
      console.log("Mouse is Over");
      this.d = dist(mouseX, mouseY, this.sprite.position.x, this.sprite.position.y);
      if (this.d < 25) {
        cursor(HAND);
        if (mouseWentUp()) {
          console.log("You clicked the centre");
          selectedTower = this;
          clicksound.play();
        }
      }
    }
  }

  //Creates new enemy at tower position
  shootEnemy() {
    this.bullet = new Bullet(
      this.sprite.position,
      this.bulletType,
      this.currentTarget.position,
      this.sprite
    );
    this.shots += 1;
  }
}

class Bullet {
  constructor(position, bulletNum, target, parent) {
    this.parent = parent;//Tower the bullet came from
    this.sprite = createSprite(position.x, position.y, 10, 10);
    this.sprite.target = { x: target.x, y: target.y };
    Object.assign(this.sprite, bulletTypes[bulletNum]);
    this.sprite.addImage(bulletImg[this.sprite.id])
    this.sprite.attractionPoint(15, target.x, target.y);
    bulletGroup.add(this.sprite);
    liveBullets.push(this);
  }
}

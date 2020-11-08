liveTowers = [];

class Tower {
  constructor(x, y, towerNum) {
    Object.assign(this, towerTypes[towerNum]);
    this.sprite = createSprite(x, y, 50, 50);
    this.sprite.debug = true;
    this.sprite.addImage(testSprite);
    this.sprite.scale = 2;
    this.sprite.setCollider("circle", 0, 0, 10);
    towerGroup.add(this.sprite);
    liveTowers.push(this);
  }

  purchaseTower() {}
}

let liveTowers = [];
let selectedTower = 0

class Tower {
  constructor(x, y, towerNum) {
    Object.assign(this, towerTypes[towerNum]);
    this.sprite = createSprite(x, y, 50, 50);
    this.sprite.debug = true;
    this.sprite.addImage(testSprite);
    this.sprite.scale = 2;
    this.sprite.mouseActive = true
    this.sprite.setCollider("circle", 0, 0, 10);
    this.clickBuffer = 100
    this.timer = 0
    this.currentTarget
  }

  //Occurs if player holds tower above areas where towers can't be placed
  cantPlace(){
    fill(255,0,0,125)
    strokeWeight(2)
    circle(mouseX,mouseY,selectedTower.towerRange*2)
    if(selectedTower.sprite.mouseIsPressed){
      selectedTower.sprite.remove()
      selectedTower = 0
    }
  }

  purchaseTower() {
    fill(0,0,0,125)
    strokeWeight(2)
    circle(mouseX,mouseY,selectedTower.towerRange*2)
    if(selectedTower.sprite.mouseIsPressed){
      selectedTower.sprite.setCollider("circle",0,0,selectedTower.towerRange/2)
      liveTowers.push(selectedTower)
      selectedTower = 0
    }
  }

  showRange(r,g,b){
    fill(r,g,b,125)
    strokeWeight(2)
    circle(mouseX,mouseY,selectedTower.towerRange*2)
  }
}

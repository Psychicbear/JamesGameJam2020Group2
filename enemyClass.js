let enemyTypes;
let pathChange = false
let liveEnemies = [];

class Enemy {
  constructor(enemyNum) {
    this.sprite = createSprite(W-48, H-16, 32, 32);
    //Merges JSON properties with enemyType properties
    Object.assign(this.sprite, enemyTypes[enemyNum]);
    this.sprite.addAnimation("default",enemyImg[this.sprite.spriteIndex])
    this.sprite.setCollider("circle",0,0,8)
    this.sprite.maxHealth = this.sprite.enemyHealth
    this.sprite.debug = true
    //Set pathing for enemy
    this.sprite.nextPoint = createVector(W-48,H-16)
    this.sprite.goal = createVector(20,50)
    this.sprite.pathIndex = 0
    this.sprite.scale = this.sprite.enemyScale
    this.sprite.pathEnd = false
    this.sprite.showHealthBar = function(){
      this.percent = this.enemyHealth / this.maxHealth
      fill(255,0,0)
      rect(this.position.x - 30,this.position.y-(15*this.enemyScale),60,7)
      fill(0,255,0)
      rect(this.position.x - 30,this.position.y-(15*this.enemyScale),lerp(0,60,this.percent),7)}
    this.sprite.path = pathfinding.findPath(this.sprite.nextPoint.x, this.sprite.nextPoint.y, this.sprite.goal.x, this.sprite.goal.y)
    //Adds object to trackable arrays
    enemyGroup.add(this.sprite)
    liveEnemies.push(this)
  }
}

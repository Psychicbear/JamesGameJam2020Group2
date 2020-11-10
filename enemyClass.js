let enemyTypes;
let liveEnemies = [];

class Enemy {
  constructor(enemyNum) {
    this.sprite = createSprite(W, H-40, 25, 25);
    //Merges JSON properties with enemyType properties
    Object.assign(this, enemyTypes[enemyNum]);
    this.sprite.addAnimation("default",enemyImg[0])
    //this.sprite.setAnimation("default")
    //Set pathing for enemy
    this.nextPoint = createVector(W,H-40)
    this.goal = createVector(20,50)
    this.pathIndex = 0
    this.sprite.scale = this.enemyScale
    //this.sprite.rotateToDirection = true
    this.path = pathfinding.findPath(this.nextPoint.x, this.nextPoint.y, this.goal.x, this.goal.y)
    //Adds object to trackable arrays
    enemyGroup.add(this.sprite)
    liveEnemies.push(this)
  }

  enemyMovement() {
    //If the sprite is alive, allow it to move along the path
    if (!this.sprite.removed) {
      if (
        Math.abs(this.sprite.position.x - this.nextPoint.x) +
          Math.abs(this.sprite.position.y - this.nextPoint.y) <
        10
      ) {
        this.pathIndex += 1;
        //Jf the sprite reaches the end, deduct health from player and remove the enemy from game
        if (this.pathIndex == this.path.length) {
          this.sprite.remove();
          this.liveIndex = liveEnemies.indexOf(this)
          liveEnemies.splice(this.liveIndex,1)
        } else {
          //next point is first index of array
          this.nextPoint = this.path[this.pathIndex];

          this.sprite.velocity.x = (this.nextPoint.x - this.sprite.position.x) / this.enemySpeed;
          this.sprite.velocity.y = (this.nextPoint.y - this.sprite.position.y) / this.enemySpeed;

          if (this.sprite.velocity.x > 0) {
            this.sprite.mirrorX(1);
          } else {
            this.sprite.mirrorX(-1);
          }
        }
      }
    }
  }
}

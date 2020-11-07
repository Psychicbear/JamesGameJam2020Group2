let enemyTypes;

class Enemy {
  constructor(enemyNum) {
    this.sprite = createSprite(1280, 680, 25, 25);
    Object.assign(this, enemyTypes[enemyNum]);
    this.sprite.addImage(testSprite)
    this.nextPoint = createVector(1280,680)
    this.goal = createVector(20,50)
    this.pathIndex = 0
    this.sprite.scale = 2
    this.sprite.rotateToDirection = true
    this.path = pathfinding.findPath(this.nextPoint.x, this.nextPoint.y, this.goal.x, this.goal.y)
    liveEnemies.push(this)
  }

  enemyMovement() {
    if (!this.sprite.removed) {
      if (
        Math.abs(this.sprite.position.x - this.nextPoint.x) +
          Math.abs(this.sprite.position.y - this.nextPoint.y) <
        10
      ) {
        this.pathIndex += 1;

        if (this.pathIndex == this.path.length) {
          //this means we have reached the end
          //generate a new random goal for our knight to get to.
          //goal.x = Math.random() * 800;
          //goal.y = Math.random() * 600;
          //
          ////calculate path to new goal
          //path = pathfinding.findPath(this.sprite.position.x, this.sprite.position.y, goal.x, goal.y);
          //pathIndex = 0;
          //
          //nextPoint.x = this.sprite.position.x;
          //nextPoint.y = this.sprite.position.y;
          this.sprite.remove();
          this.liveIndex = liveEnemies.indexOf(this)
          liveEnemies.splice(this.liveIndex,1)
        } else {
          //next point is first index of array
          this.nextPoint = this.path[this.pathIndex];

          this.sprite.velocity.x = (this.nextPoint.x - this.sprite.position.x) / 5;
          this.sprite.velocity.y = (this.nextPoint.y - this.sprite.position.y) / 5;

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

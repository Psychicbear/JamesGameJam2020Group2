let enemyTypes

class Enemy {
    constructor(enemyNum) {
        this.sprite = createSprite(1280,620,25,25);
        this.sprite = Object.assign(this.sprite, enemyTypes[enemyNum])
    }

    enemyMovement(){
        if(!this.sprite.removed){
            if (Math.abs(this.sprite.position.x - nextPoint.x) + Math.abs(this.sprite.position.y - nextPoint.y) < 10) {
                
                pathIndex += 1;
                
                if (pathIndex == path.length) { //this means we have reached the end
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
                    this.sprite.remove()
                    
                } else {
                    //next point is first index of array
                    nextPoint = path[pathIndex];
                    
                    this.sprite.velocity.x = (nextPoint.x - this.sprite.position.x) / 5;
                    this.sprite.velocity.y = (nextPoint.y - this.sprite.position.y) / 5;
                    
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
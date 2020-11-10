let waves = []
let test
class WaveManager{
    constructor(data){
        this.nextWave = false
        this.currentWave = 0
        this.currentEnemy = 0
        this.spawnTimer = 0
        this.spawnAt = 200
        this.spawnEnemy
        this.waves = data
    }

    spawnWave(){
        if(this.currentEnemy < this.waves[this.currentWave].length){
            if(this.spawnTimer >= this.spawnAt){
                this.spawnEnemy = new Enemy(this.waves[this.currentWave][this.currentEnemy])
                this.currentEnemy += 1
                this.spawnTimer = 0
                console.log(this.currentEnemy)

            } else {this.spawnTimer += deltaTime}
        } else {
            this.nextWave = false
            this.currentWave += 1
            this.currentEnemy = 0
        }
    }
}
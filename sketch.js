let currentScene;
let LOADING = 0;
let MAIN_MENU = 1;
let PLAY = 2;
let LEADEROARD = 3;
let INTRUCTIONS = 4;
const W = 1280;
const H = 720;
let quickSwitch = false;
let pathFile;
let nextWave = false
let pathGrid = [];
let pathIndex = 0;
let gameInit = false

function preload() {
  //towerImg = [loadImage("assets/tower1"), loadImage("assets/tower2")]
  //enemyImg = [loadImage("assets/enemy1"), loadImage("assets/enemy2")]
  //bulletImg = [loadImage("assets/bullet1"), loadImage("assets/bullet2")]
  //mapFile =  loadStrings("map.txt")
  //baseImg = loadImage("assets/base.png")
  enemyImg = [loadAnimation("Sprites/whiteright0001.png","Sprites/whiteright0003.png"),loadAnimation("Sprites/whiteup0001.png","Sprites/whiteup0003.png")]
  gameData = loadJSON("data.JSON");
  pathFile = loadStrings("track.txt", splitStrings)
  waveFile = loadStrings("waves.txt", splitWaves)
  testSprite = loadImage("Sprites/health.png")
}

function setup() {
  createCanvas(W, H);
  currentScene = 2;
  towerGroup = new Group()
  enemyGroup = new Group()
  grassGroup = new Group()
  shopGroup = new Group()
  enemyTypes = gameData.enemies;
  towerTypes = gameData.towers
  console.log(enemyTypes);
}

function draw() {
  background(170);
  
  //Switch to change game states
  switch (currentScene) {
    case LOADING:
      drawLoadingScreen();
      break;
    case MAIN_MENU:
      drawMainMenuScreen();
      break;
    case PLAY:
      drawPlayScreen();
      break;
    case LEADERBOARD:
      drawLeaderboardScreen();
      break;
    case INSTRUCTIONS:
      drawControlsScreen();
      break;
  }
  fill(0)
  textSize(20)
  text("FPS: " + round(frameRate()), 50,50)
}

function drawLoadingScreen() {}

function drawMainMenuScreen() {}

function drawPlayScreen() {
  drawSprites(grassGroup)
  //Commands that run once at the beginning of the play screen
  if(!gameInit){
    pathfinding = new Pathfinding();
    pathfinding.loadGrid(pathGrid, 20, 20, 1280, 680, true);
    grassTest = createSprite(W/2,H/2,W,H)
    grassGroup.add(grassTest)
    //tower = new Tower(W/3, 100,0)
    game = new WaveManager(waves)
    shop = new Shop()
    garbage = createSprite(W - 50,H - 50, 50,50)
    gameInit = true
  }
  
  shopTowers.forEach(function(tower){
    //tower.sprite.mouseUpdate()
    if(tower.sprite.mouseIsPressed){
      selectedTower = new Tower(mouseX,mouseY,tower.id)
      towerGroup.add(selectedTower.sprite)
    }
  })

  if(selectedTower != 0){
    if(!selectedTower.isPurchased){
      selectedTower.sprite.mouseUpdate()
      selectedTower.sprite.position.x = mouseX
      selectedTower.sprite.position.y = mouseY
      drawSprite(garbage)
      shop.isOpen = false
      if(selectedTower.timer >= selectedTower.clickBuffer){
        if(selectedTower.sprite.overlap(garbage)){
          selectedTower.cantPlace()
        } else if(!selectedTower.sprite.overlap(grassGroup)){
          selectedTower.cantPlace()
        } else{
          selectedTower.purchaseTower()
        }
      }
    }

    
    selectedTower.timer += deltaTime
  }
  strokeWeight(1)
  //Debug to spawn enemy on spacebar press
  if(keyWentUp(32)){
    game.nextWave = true;
  }

  //If nextWave button is presesed, start next wave
  if(game.nextWave){
    game.spawnWave()
  }

  //Displays level that player is on
  fill(0)
  text("Wave Number:" + (game.currentWave+1),W/2,H/3)

  //All enemies that are alive will move along a set path
  liveEnemies.forEach(function (enemy) {
    enemy.enemyMovement();
  });
  
  //Pathing debugging
  drawGrid(pathfinding, false);
  drawSprites(towerGroup)
  drawSprites(enemyGroup)
  shop.drawShop()
  drawSprites(shopGroup)
  shop.shopButton()
  //drawPath(liveEnemies[0].path);
}

function drawLeaderboardScreen() {}

function drawInstructionsScreen() {}

//Splits map file
function splitStrings(stringFile) {
  stringFile.forEach(function (line) {
    newLine = line.split(" ");
    pathGrid.push(newLine);
  });
}

//Splits wave file
function splitWaves(){
  waveFile.forEach(function(wave){
    newWave = wave.split(" ")
    waves.push(newWave)
  })
}

//Debug option which draws pathing grid
function drawGrid(grid, showConnections) {
  fill(255, 255, 255);
  stroke(0, 0, 0);

  let nodes = grid.nodes;
  for (let i = 0; i < nodes.length; i++) {
    circle(nodes[i].x, nodes[i].y, 15);
    if (showConnections) {
      let cons = nodes[i].connections;
      for (let j = 0; j < cons.length; j++) {
        line(nodes[i].x, nodes[i].y, cons[j].x, cons[j].y);
      }
    }
  }
}

//Debug option which draws specific enemy path, redundant as all enemies are forced to take same path
function drawPath(path) {
  fill(255, 0, 0);
  stroke(255, 0, 0);

  for (let i = 0; i < path.length; i++) {
    circle(path[i].x, path[i].y, 10);
    if (i > 0) {
      line(path[i].x, path[i].y, path[i - 1].x, path[i - 1].y);
    }
  }
}

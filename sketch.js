let currentScene;
let LOADING = 0;
let MAIN_MENU = 1;
let PLAY = 2;
let LEADEROARD = 3;
let INTRUCTIONS = 4;
const W = 1280;
const H = 736;
let quickSwitch = false;
let pathFile;
let nextWave = false;
let pathIndex = 0;
let gameInit = false;
let clickTimer = 0;
let bulletTypes = []
let activeElement = {}

function preload() {
  towerImg = [loadImage("Sprites/tower1.png"), loadImage("Sprites/tower2.png"), loadImage("Sprites/tower3.png")]
  //bulletImg = [loadImage("assets/bullet1"), loadImage("assets/bullet2")]
  enemyImg = [
    loadAnimation("Sprites/tile0001.png", "Sprites/tile0003.png"),
    loadAnimation("Sprites/whiteup0001.png", "Sprites/whiteup0003.png"),
  ];
  tileImg = [
    loadImage("Sprites/tiles0.png"),
    loadImage("Sprites/tiles1.png"),
    loadImage("Sprites/tiles2.png"),
    loadImage("Sprites/tiles3.png"),
    loadImage("Sprites/tiles4.png"),
    loadImage("Sprites/tiles5.png"),
    loadImage("Sprites/tiles6.png"),
    loadImage("Sprites/tiles7.png"),
  ];
  gameData = loadJSON("data.JSON");
  mapFile = loadStrings("map.txt");
  pathFile = loadStrings("track.txt");
  waveFile = loadStrings("waves.txt");
  testSprite = loadImage("Sprites/health.png");
}

function setup() {
  createCanvas(W, H);
  angleMode(DEGREES)
  useQuadTree(true);
  currentScene = 2;
  pathFile = convertToArray(pathFile)
  mapFile = convertToArray(mapFile)
  waveFile = convertToArray(waveFile)
  towerGroup = new Group();
  enemyGroup = new Group();
  grassGroup = new Group();
  shopGroup = new Group();
  pathGroup = new Group();
  bulletGroup = new Group()
  enemyTypes = gameData.enemies;
  towerTypes = gameData.towers;
  bulletTypes = gameData.bullets
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
  fill(0);
  textSize(20);
  text("FPS: " + round(frameRate()), 50, 50);
}

function drawLoadingScreen() {}

function drawMainMenuScreen() {}

function drawPlayScreen() {
  cursor(ARROW)
  //Commands that run once at the beginning of the play screen
  if (!gameInit) {
    pathfinding = new Pathfinding();
    pathfinding.loadGrid(pathFile, 16, 16, W, H, false);
    game = new WaveManager(waveFile);
    shop = new Shop();
    garbage = createSprite(W - 50, H - 50, 50, 50);
    inactive = createSprite(-1,-1,1,1)
    activeElement.sprite = inactive
    gameInit = true;
    pg = createGraphics(W,H)
    createMap()
  }

  //Draws background tiles
  image(pg,0,0)
  drawSprites(pathGroup);

  //Debug: draws enemy path
  drawGrid(pathfinding, false);

  //Checks live towers for enemies in their radius
  liveTowers.forEach(function (tower) {
    tower.selectPurchasedTower()
    tower.sprite.overlap(enemyGroup, function(spriteA, enemy){
      if (tower.currentTarget == 0) {
        tower.currentTarget = enemy;
      } else {
        tower.sprite.rotation = -atan2(tower.sprite.position.x - tower.currentTarget.position.x, tower.sprite.position.y - tower.currentTarget.position.y)
        if(tower.canShoot && !tower.currentTarget.removed){
          tower.shootEnemy()
          tower.attackTimer = 0
          tower.canShoot = false
        } else {tower.currentTarget = 0}
      }
    });
    if(tower.attackTimer > tower.attackSpeed){
        tower.canShoot = true
    } else{tower.attackTimer += deltaTime}
  });
  
  //Checks bullet collision
  liveBullets.forEach(function(bullet){
    bullet.sprite.overlap(enemyGroup, enemyDamage)
    if(!bullet.sprite.overlap(bullet.parent)){//If bullet leaves tower radius
      bullet.sprite.remove()
      bulletIndex = liveBullets.indexOf(bullet)
      liveBullets.splice(bulletIndex,1)
    }
  })

  //Selects tower from tower shop
  shopTowers.forEach(function (tower) {
    if (tower.sprite.mouseIsOver) {
      if (tower.towerCost <= game.playerMoney){
        cursor(HAND)
        if(mouseWentUp()){
          selectedTower = new Tower(mouseX, mouseY, tower.id);
          towerGroup.add(selectedTower.sprite);
        }
      }
      mouseOverSprite(tower);
    }
  });

  //Decides whether or not tower will be placed
  if (selectedTower != 0) {
    if (!selectedTower.isPurchased) {
      cursor("grab")
      selectedTower.sprite.position.x = mouseX;
      selectedTower.sprite.position.y = mouseY;
      drawSprite(garbage);
      shop.isOpen = false;
      if (selectedTower.timer >= selectedTower.clickBuffer) {
        if (selectedTower.sprite.overlap(garbage)) {
          selectedTower.cantPlace();
        } else if (selectedTower.sprite.overlap(pathGroup)) {
          selectedTower.cantPlace();
        } else {
          selectedTower.purchaseTower();
        }
      }
    } else{
      if(!selectedTower.mouseIsOver && mouseWentDown()){
        selectedTower = 0
      } else{selectedTower.showRange(0,0,0)}
    }
    selectedTower.timer += deltaTime;
  }

  strokeWeight(1);
  //Debug: spawn enemy on spacebar press
  if (keyWentUp(32)) {
    game.waveActive = true;
    shop.isOpen = false
  }

  //If nextWave button is presesed, start next wave
  if (game.waveActive) {
    game.spawnWave();
  } else{liveEnemies = []}

  //Displays level that player is on
  textStyle(BOLD);
  fill(0);
  textSize(20);
  text("Level: " + (game.currentWave + 1), W * 0.9, H * 0.15);
  text("$$$: " + game.playerMoney, W * 0.9, H * 0.19);
  text("HP: " + game.playerHealth, W * 0.9, H * 0.23);

  //All enemies that are alive will move along a set path
  enemyGroup.forEach(function (enemy) {
    enemyMovement(enemy);
  });

  drawSprites(towerGroup);
  drawSprites(enemyGroup);
  shop.drawShop();
  drawSprites(shopGroup);
  shop.shopButton();
  drawSprites(bulletGroup)
  if(!activeElement.sprite.mouseIsOver){
    activeElement = {}
    activeElement.sprite = inactive
  }
  game.isInfoShown()
  console.log(activeElement)
}

function drawLeaderboardScreen() {}

function drawInstructionsScreen() {}

//Converts loaded strings to readable arrays
function convertToArray(file){
  buffer = []
  file.forEach(function(line){
    newLine = line.split("")
    buffer.push(newLine)
  })
  return buffer
}

//Creates the background map
function createMap() {
  i = 0;
  x = 16;
  y = 16;
  mapFile.forEach(function (line) {
    j = 0;
    line.forEach(function (char) {
      tileIndex = parseInt(char);
      if (tileIndex == 0) {
        chooseTile = round(random(0,1))
        if(chooseTile == 0){
          pg.image(tileImg[0],x-16,y-16)
        } else {pg.image(tileImg[7],x-16,y-16)}
      } else {
        sprite = createSprite(x, y, 32, 32);
        sprite.addImage(tileImg[tileIndex]);
        pathGroup.add(sprite);
      }

      x += 32;
      j++;
    });
    i++;
    x = 16;
    y += 32;
  });
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

function targetSelect(spriteA,enemy) {
  if (tower.currentTarget == 0) {
    tower.currentTarget = enemy;
  } else {
    tower.sprite.attractionPoint(
      0,
      tower.currentTarget.sprite.position.x,
      tower.currentTarget.sprite.position.y
    );
  }
}

function enemyDamage(bullet,enemy){
  enemy.enemyHealth -= bullet.damage
  if(enemy.enemyHealth <= 0){
    enemy.life = 1
    game.playerMoney += enemy.enemyValue
    liveIndex = liveEnemies.indexOf(enemy)
    liveEnemies.splice(liveIndex,1)
  }
  bullet.remove()
  liveIndex = liveBullets.indexOf(bullet)
  liveBullets.indexOf(bullet)
}

//I wanted to attach this to enemy class however it caused pathing errors
function enemyMovement(enemy) {
  //If the sprite is alive, allow it to move along the path
  if (!enemy.removed) {
    if (
      Math.abs(enemy.position.x - enemy.nextPoint.x) +
        Math.abs(enemy.position.y - enemy.nextPoint.y) <
      10
    ) {
      enemy.pathIndex += 1;
      //if the sprite reaches the end, deduct health from player and remove the enemy from game
      if (enemy.pathIndex == enemy.path.length) {
        enemy.life = 1
        game.playerHealth -= enemy.enemyDamage
      } else {
        //next point is first index of array
        enemy.nextPoint = enemy.path[enemy.pathIndex];

        enemy.velocity.x = (enemy.nextPoint.x - enemy.position.x) / enemy.enemySpeed;
        enemy.velocity.y = (enemy.nextPoint.y - enemy.position.y) / enemy.enemySpeed;

        if (enemy.velocity.x > 0) {
          enemy.mirrorX(1);
        } else {
          enemy.mirrorX(-1);
        }
      }
    }
  }
}

function mouseOverSprite(sprite){
  activeElement = sprite
}
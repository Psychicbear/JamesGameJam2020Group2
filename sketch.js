let LOADING = 0;
let MAIN_MENU = 1;
let PLAY = 2;
let CREDITS = 3;
let INSTRUCTIONS = 4;
const W = 1280;
const H = 736;
let quickSwitch = false;
let pathFile;
let nextWave = false;
let pathIndex = 0;
let gameInit = false;
let clickTimer = 0;
let bulletTypes = [];
let activeElement = {};
let waveOverride = false;
let instructPage = 0;
let creditsPos = H;
let menuInit = false
let paused = false

function preload() {
  mainScreenSong = loadSound("otherassets/mainscreensong.mp3");
  playScreenSong = loadSound("otherassets/playscreensong.mp3");
  crunch = loadSound("otherassets/crunch.wav");
  shopclick = loadSound("otherassets/shopclick.wav");
  menuselect = loadSound("otherassets/menuselect.wav");
  clicksound = loadSound("otherassets/placetower.wav");
  selectsound = loadSound("otherassets/selectTower.wav")
  sell = loadSound("otherassets/sell.wav")
  hiss = loadSound("otherassets/hiss.wav");
  instructiondoc = loadStrings("instructions.txt");
  creditsdoc = loadStrings("credits.txt");
  newFont = loadFont("Minecraft.ttf");
  pauseImg = loadImage("otherassets/pause.png");
  yarnballImg = loadImage("Sprites/yarnball.png.png");
  waterTowerIcon = loadImage("Sprites/watertowericon.png");
  biscuitFactoryIcon = loadImage("otherassets/biccyFactory.png");
  towerImg = [
    loadImage("Sprites/tower1.png"),
    loadImage("Sprites/doubletower.png"),
    loadImage("Sprites/watertower.png"),
    loadImage("Sprites/sniper.png"),
    loadImage("Sprites/tower3.png"),
  ];
  towerbase = [loadImage("Sprites/towerbase.png")]
  bulletImg = [loadImage("Sprites/bullet1.png"), loadImage("Sprites/bullet1.png")]
  enemyImg = [
    loadAnimation("Sprites/white0001.png", "Sprites/white0003.png"),
    loadAnimation("Sprites/brown0001.png", "Sprites/brown0003.png"),
    loadAnimation("Sprites/orange0001.png", "Sprites/orange0003.png"),
    loadAnimation("Sprites/black0001.png", "Sprites/black0003.png"),
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
  mainmenuImg = [
    loadImage("Sprites/menu1.png"),
    loadImage("Sprites/menu2.png"),
    loadImage("Sprites/menu3.png"),
  ];
}

function setup() {
  slider = createSlider(0, 1, 1, 0.1);
  slider.position(100, 800);
  createCanvas(W, H);
  angleMode(DEGREES);
  useQuadTree(true);
  currentScene = 0;
  pathFile = convertToArray(pathFile);
  mapFile = convertToArray(mapFile);
  waveFile = convertToArray(waveFile);
  towerGroup = new Group();
  enemyGroup = new Group();
  grassGroup = new Group();
  shopGroup = new Group();
  pathGroup = new Group();
  bulletGroup = new Group();
  mainmenuGroup = new Group();
  enemyTypes = gameData.enemies;
  towerTypes = gameData.towers;
  bulletTypes = gameData.bullets;
  loadingStart = millis();
  crunch.setVolume(0.2)
  hiss.setVolume(0.2)

  // vid.size(200, 100);
}

function draw() {
  background(170);
  volumeLevel = slider.value();
  masterVolume(volumeLevel);
  //Switch to change game states
  switch (currentScene) {
    case LOADING:
      drawLoadingScreen(1);
      break;
    case MAIN_MENU:
      drawMainMenuScreen();
      break;
    case PLAY:
      drawPlayScreen();
      break;
    case INSTRUCTIONS:
      drawInstructionsScreen();
      break;
    case CREDITS:
      drawCreditsScreen();
      break;
  }
  //Show Framerate
  // fill(0);
  // textSize(20);
  // text("FPS: " + round(frameRate()), 50, 50);
}

function drawLoadingScreen(screenNumber) {
  textFont(newFont);
  background(0);
  stroke(255, 0, 0);
  strokeWeight(10);

  x = map(millis(), loadingStart, loadingStart + 5000, 0, width);
  fill(255, 0, 0);
  line(0 - width * 4, 5, x, 5);

  if (x > 1500) {
    currentScene = screenNumber;
  }
  noStroke();
  textSize(32);

  fill("red");
  text("Loading...", width / 2.4, height / 2.1);
}

function drawMainMenuScreen() {
  textFont(newFont);
  frameRate(60);
  background(0);

  if(!menuInit){
    yarnball = createSprite(width / 5.5, height / 3.15, 50, 50);
    yarnball.addImage(yarnballImg);
    yarnball2 = createSprite(width / 1.32, height / 3.15, 50, 50);
    yarnball2.addImage(yarnballImg);
    mainScreenSong.setVolume(0.05);
    mainScreenSong.play();
    menuInit = true
  }
  textSize(32);
  fill("red");
  text("CATASTROPHE: DEFENDERS OF THE YARN", width / 5, height / 3);

  textSize(32);
  fill(0);

  fill("green");
  text("[Enter] To Play!", width / 8, height / 1.6);

  fill("yellow");
  text("[I] For Instructions Menu!", width / 1.9, height / 1.6);

  fill("blue");
  text("[C] For Credits!", width / 8, height / 1.4);

  // fill("red");
  // text("[S] For Backstory!", width / 1.9, height / 1.4);

  drawSprites();
}

function drawPlayScreen() {
  cursor(ARROW);
  //Commands that run once at the beginning of the play screen
  if (!gameInit) {
    pathfinding = new Pathfinding();
    pathfinding.loadGrid(pathFile, 16, 16, W, H, false);
    game = new WaveManager(waveFile);
    shop = new Shop();
    garbage = createSprite(W - 50, H - 50, 50, 50);
    inactive = createSprite(-1, -1, 1, 1);
    activeElement.sprite = inactive;
    gameInit = true;
    pg = createGraphics(W, H);
    createMap();
    playScreenSong.setVolume(0.05);
    playScreenSong.loop();
    selectsound.setVolume(0.15)
  }

  //Draws background tiles
  image(pg, 0, 0);
  drawSprites(pathGroup);

  //Debug: draws enemy path
  //drawGrid(pathfinding, false);

  //Checks live towers for enemies in their radius
  liveTowers.forEach(function (tower) {
    tower.selectPurchasedTower();
    if(tower.isPurchased){
      image(towerbase[0],tower.sprite.position.x-28,tower.sprite.position.y-28,56,56)
    }
    tower.sprite.overlap(enemyGroup, function (spriteA, enemy) {
      if (tower.currentTarget == 0) {
        tower.currentTarget = enemy;
      } else {
        tower.sprite.rotation = -atan2(
          tower.sprite.position.x - tower.currentTarget.position.x,
          tower.sprite.position.y - tower.currentTarget.position.y
        );
        if (tower.canShoot && !tower.currentTarget.removed) {
          tower.shootEnemy()
        } else {
          tower.currentTarget = 0;
        }
      }
    });
    if (tower.attackTimer > tower.attackSpeed) {
      tower.canShoot = true;
    } else {
      tower.attackTimer += deltaTime;
    }
  });

  //Checks bullet collision
  liveBullets.forEach(function (bullet) {
    if(bullet.sprite.delay){
      if(bullet.sprite.timer >= 200){
        bullet.sprite.delay = false
      } else{bullet.sprite.timer += deltaTime}
    } else if(!bullet.targetSet){
      bullet.sprite.attractionPoint(bullet.sprite.speed, bullet.target.x, bullet.target.y)
    }
    bullet.sprite.overlap(enemyGroup, enemyDamage);
    if (!bullet.sprite.overlap(bullet.parent)) {
      //If bullet leaves tower radius
      bullet.sprite.remove();
      bulletIndex = liveBullets.indexOf(bullet);
      liveBullets.splice(bulletIndex, 1);
    }
  });

  //Selects tower from tower shop
  shopTowers.forEach(function (tower) {
    if (tower.sprite.mouseIsOver) {
      if (tower.towerCost <= game.playerMoney) {
        cursor(HAND);
        if (mouseWentUp()) {
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
      cursor("grab");
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
    } else {
      if (!selectedTower.mouseIsOver && mouseWentDown()) {
        selectedTower = 0;
      } else {
        selectedTower.showRange(0, 0, 0);
        if(keyWentUp(83)){
          game.playerMoney += selectedTower.sellCost
          selectedTower.sprite.remove()
          liveIndex = liveTowers.indexOf(selectedTower);
          liveTowers.splice(liveIndex, 1)
          selectedTower = 0
          sell.play()
        }
      }
    }
    selectedTower.timer += deltaTime;
  }

  strokeWeight(1);
  //Debug: spawn enemy on spacebar press
  if (keyWentUp(32)) {
    game.waveActive = true;
  }

  

  //All enemies that are alive will move along a set path
  enemyGroup.forEach(function (enemy) {
    enemyMovement(enemy);
    enemy.showHealthBar()
    if(enemy.position.x < 0 || enemy.position.x > W){
      enemy.remove()
      liveIndex = liveEnemies.indexOf(enemy);
      liveEnemies.splice(liveIndex, 1);
    }
  });

  drawSprites(bulletGroup);
  drawSprites(towerGroup);
  drawSprites(enemyGroup);
  shop.drawShop();
  drawSprites(shopGroup);
  shop.shopButton();
  if (!activeElement.sprite.mouseIsOver) {
    activeElement = {};
    activeElement.sprite = inactive;
  }
  game.isInfoShown();
  
  //Displays level that player is on
  textAlign(LEFT)
  textStyle(BOLD);
  fill(255);
  textSize(20);
  textFont(newFont);
  text("[P] to pause", W * 0.9, H * 0.11)
  text("Level : " + (game.currentWave + 1), W * 0.92, H * 0.15);
  text("$$$ : " + game.playerMoney, W * 0.91, H * 0.19);
  text("HP : " + game.playerHealth, W * 0.92, H * 0.23);
  if(game.gameWon){
    textAlign(CENTER)
    textSize(30)
    console.log("You won")
    text("YOU WON!\n You defended yourself against the grand army of cats\n Press [Space] to continue", W/2, H/2)
    if(keyCode == 32){window.location.reload()}
  } else if(game.gameOver){
    textAlign(CENTER)
    textSize(30)
    console.log("You lost")
    text("YOU LOST!\n Unfortunately you failed to defend against the onslaught of cats\n Press [Space] to continue", W/2, H/2)
    if(keyCode == 32){window.location.reload()}
  } else  if (game.waveActive) {
    game.spawnWave();
  } else {
    liveEnemies = [];
    textAlign(CENTER)
    text("[Space] to start the next wave",W/2,50)
    if(game.currentWave == 0){
      text("Enemies attacking from here! >>>>",W*.8,H-20)
    }
  }

  //If nextWave button is pressed, start next wave
 
  // console.log(activeElement);
}

// Instructions Screen!
function drawInstructionsScreen() {
  background(0);
  fill(255);
  textSize(32);
  textFont(newFont);
  text(
    instructiondoc[instructPage],
    width / 4.1,
    height / 2.5,
    width / 2.1,
    height / 1.5
  );

  textSize(14);
  fill("red");
  text("<Press [Esc] for Main Menu>", 10, 10, 100, 100);
  fill("green");
  text("<Press [Enter] to Play!>", 10, 80, 100, 100);

  // displays images depending on what page you're on
  if (instructPage === 7) {
    image(biscuitFactoryIcon, width - 300, height / 2.5, 200, 200);
  } else if (instructPage === 8) {
    image(biscuitFactoryIcon, width - 300, height / 2.5, 200, 200);
  } else if (instructPage === 9) {
    image(waterTowerIcon, width - 300, height / 2.5, 200, 200);
  } else if (instructPage === 10) {
    image(towerImg[4], width - 300, height / 2.5, 200, 200);
  }
  // reverts page back to beginning if finishes and stops player from going backwards
  if (instructPage === 13) {
    instructPage = 0;
  } else if (instructPage === -1) {
    instructPage = 0;
  }
  // displays page number
  fill("white");
  text("Page Number: " + (instructPage + 1) + "/13", width - 150, height - 45, 150, 50);

  fill("white");
  text("Use Left and Right arrow keys to change pages!", 25, height - 45, 300, 50);
}

function drawCreditsScreen() {
  background(0);
  fill(255);
  textSize(64);
  textFont(newFont);
  text(creditsdoc, 150, creditsPos, width - 250, height * 10);
  creditsPos -= 1.5;
  if (creditsPos <= -3700) {
    currentScene = 1;
  }
  textFont(newFont);
  textSize(14);
  text("<[Enter] to skip>", 10, 20);
  console.log(creditsPos)
}

//Converts loaded strings to readable arrays
function convertToArray(file) {
  buffer = [];
  file.forEach(function (line) {
    newLine = line.split("");
    buffer.push(newLine);
  });
  return buffer;
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
        chooseTile = round(random(0, 1));
        if (chooseTile == 0) {
          pg.image(tileImg[0], x - 16, y - 16);
        } else {
          pg.image(tileImg[7], x - 16, y - 16);
        }
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

function targetSelect(spriteA, enemy) {
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

function enemyDamage(bullet, enemy) {
  enemy.enemyHealth -= bullet.damage;
  if (enemy.enemyHealth <= 0) {
    
    enemy.enemyHealth = 0
    enemy.life = 1;
    game.playerMoney += round(random(enemy.enemyValue*.8,enemy.enemyValue*1.5));
    liveIndex = liveEnemies.indexOf(enemy);
    liveEnemies.splice(liveIndex, 1);
  }
if (bullet.id == 1) {
    chance = random(0,1)
    console.log(chance)
    if(chance <= 0.2){
      hiss.play();
      if(enemy.pathIndex <= 10) {
        enemy.pathIndex = 0
      } else {enemy.pathIndex -= 10}
    }
  } else{crunch.play();}
  bullet.remove();
  liveIndex = liveBullets.indexOf(bullet);
  liveBullets.indexOf(bullet);
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
        enemy.life = 1;
        game.playerHealth -= enemy.enemyDamage;
        liveIndex = liveEnemies.indexOf(enemy);
        liveEnemies.splice(liveIndex, 1);
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

function mouseOverSprite(sprite) {
  activeElement = sprite;
}

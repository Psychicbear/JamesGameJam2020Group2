let currentScene
let LOADING = 0
let MAIN_MENU = 1
let PLAY = 2
let LEADEROARD = 3
let INTRUCTIONS = 4
const W = 1280
const H = 720
let quickSwitch = false
let pathFile
let pathGrid = []
let nextPoint = {x: 1280, y: 620};
let goal = {x: 20, y: 50};
let pathIndex = 0;

function preload() {
  //towerImg = [loadImage("assets/tower1"), loadImage("assets/tower2")]
  //enemyImg = [loadImage("assets/enemy1"), loadImage("assets/enemy2")]
  //bulletImg = [loadImage("assets/bullet1"), loadImage("assets/bullet2")]
  //mapFile =  loadStrings("map.txt")
  //baseImg = loadImage("assets/base.png")
  gameData = loadJSON("data.JSON")
  pathFile = loadStrings("track.txt", splitStrings)
}

function setup() {
  createCanvas(W,H)
  currentScene = 2
  enemyTypes = gameData.enemies
  splitStrings()
  pathfinding = new Pathfinding();
  pathfinding.loadGrid(pathGrid, 25, 25, 1280, 720, false);
  path = pathfinding.findPath(nextPoint.x, nextPoint.y, goal.x, goal.y)
  console.log(enemyTypes)
}

function draw() {
  background(170)
  drawSprites()
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
}

function drawLoadingScreen(){

}

function drawMainMenuScreen(){

}

function drawPlayScreen(){
  if(!quickSwitch){
    enemy = new Enemy(1)
    quickSwitch = true
    console.log(enemy)
  }
  enemy.enemyMovement()
  drawGrid(pathfinding, false);
	drawPath(path);
	
	fill(0,255,0);
	circle(nextPoint.x, nextPoint.y, 10);
	fill(255,255,0);
	circle(goal.x, goal.y, 20);
}

function drawLeaderboardScreen(){

}

function drawInstructionsScreen(){
  
}

function splitStrings(){
  pathFile.forEach(function(line){
    newLine = line.split(" ")
    pathGrid.push(newLine)
  })
}

function drawGrid(grid, showConnections) {
	fill(255,255,255);
	stroke(0,0,0);
	
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

function drawPath(path) {
	fill(255,0,0);
	stroke(255,0,0);
	
	for (let i = 0; i < path.length; i++) {
		circle(path[i].x, path[i].y, 10);
		if (i > 0) {
			line(path[i].x, path[i].y, path[i-1].x, path[i-1].y);
		}
	}
}
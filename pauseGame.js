function pauseGame() {
  //pauses the game
  paused = true;
  playScreenSong.pause();
  pauseSpr = createSprite(width / 2, height / 2, 100, 100);
  pauseSpr.addImage(pauseImg);
  pauseSpr.life = 1;
  pauseSpr.scale = 10;
  textSize(30)
  textAlign(CENTER)
  textFont(newFont)
  fill(255)
  text("[P] Again to resume game", W*.5,H*.75)
  drawSprite(pauseSpr);
  frameRate(0);
}

function unpauseGame() {
  // unpauses the game
  paused = false;
  frameRate(60);
  textAlign(LEFT)
  textSize(20)
  playScreenSong.play();
  if (pauseSpr.life != 0) {
    menuselect.play();
  }
  pauseSpr.life = 0;
}

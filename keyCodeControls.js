function keyPressed() {
  if (currentScene === 1 && keyCode === 13) {//Enter key
    currentScene = 2;
    menuselect.play();
    mainScreenSong.stop();
  } else if (currentScene === 2 && keyCode === 80) {//P key
    //pauseGame();
    menuselect.play();
    if(!paused){
      pauseGame()
    } else{unpauseGame()}
  } else if (currentScene === 1 && keyCode === 73) {//I key
    currentScene = 4;
    menuselect.play();
  } else if (currentScene === 4 && keyCode === 27) {//Esc key
    currentScene = 1;
    menuselect.play();
  } else if (currentScene === 4 && keyCode === RIGHT_ARROW) {
    background(0);
    instructPage++;
    menuselect.play();
  } else if (currentScene === 4 && keyCode === LEFT_ARROW) {
    background(0);
    instructPage -= 1;
    menuselect.play();
  } else if (currentScene === 4 && keyCode === 13) {//Enter key
    currentScene = 2;
    menuselect.play();
    mainScreenSong.stop();
  } else if (currentScene === 1 && keyCode === 67) {//C key
    background(0);
    currentScene = 3;
    menuselect.play();
  } else if (currentScene === 3 && keyCode === 13) {//Enter key
    background(0);
    currentScene = 1;
    menuselect.play();
  }
}

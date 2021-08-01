var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided, mario_walk;
var ground, invisibleGround, groundImage;
var backgroundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;

var lifeCount = 0;
var lifeCounter = 3;
var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  mario_running =   loadImage("images/running.png");
  //mario_collided = loadAnimation("images/marioUp.png");
 
  
  groundImage = loadImage("images/ground.png");
  backgroundImage = loadImage("images/night.jpg");
  
  cloudImage = loadImage("images/cloud.png");
  
  obstacle1 = loadImage("images/pipe.png");
  //obstacle2 = loadImage("images/flowerPipe.png");
  //obstacle3 = loadImage("images/mushroom.png");
  
  gameOverImg = loadImage("images/gameOverText.png");
  restartImg = loadImage("images/restart.png");
}

function setup() {
  createCanvas(displayWidth - 20, displayHeight-120);
  
  
  mario = createSprite(100,150 ,20,50);
  
  //mario.addAnimation("running", mario_running);

  mario.addImage("running", mario_running);
  mario.scale = 0.10;
  
  ground = createSprite(200,180,700,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  realGround = createSprite(200,180,2000,10);
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  textSize(18);

  textFont("Georgia");
  textStyle(BOLD);
  fill("white");
  score = 0;
}

function draw() {
  
  camera.x = mario.x;
  camera.y = mario.y;
  ground.visible = false;
  realGround.shapeColor = "blue";
  gameOver.position.x = restart.position.x = camera.x
  realGround.depth = mario.depth;
  mario.depth = mario.depth+1;
  background(backgroundImage);
  
  textAlign(RIGHT, TOP);
  text("Score: "+ score, 600,5);
  fill("Lime");
  text("Lives: "+ lifeCounter,600,30)
 
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3/100);
    

    if(keyDown("space") && mario.y >= 159) {
      mario.velocityY = -12;
    }
   
    
    mario.velocityY = mario.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/3;
    }
  
    mario.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
  if(obstaclesGroup.isTouching(mario)){
    lifeCount = lifeCount-1;
    console.log(lifeCount);
}
if(lifeCount < -37){
  gameState = END;
  fill("black");
  
}
  }
if(lifeCount < 0){
  lifeCounter = 2;
  fill("yellow");
  
}

if(lifeCount < -14){
  lifeCounter = 1;
  fill("orange");
  
}

if(lifeCount < -28){
  lifeCounter = 0;
  fill("red");
  
}

  text("Lives: "+ lifeCounter,600,30)

     
    if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the mario animation
  
    mario.changeAnimation("collided",mario_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }


  }
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(camera.x+width/2,165,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3 /100);
    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle1);
              break;
      case 3: obstacle.addImage(obstacle1);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  lifeCount = 0;
  lifeCounter = 3;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  //mario.changeAnimation("running",mario_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}
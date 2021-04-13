let fs;
let back;
let poseNet;
let poses = [];
let keypointX = [];
let keypointY = [];
let video;
let videoSize = {w: 1280, h: 960};
let mirror = false;
let mirrorImg;
let egg = new Array(5);
let trash = new Array(5);
let brick;
let penguin;
let hit = false;
let score = 0;
let sound0;
let sound1;
let bgm;

function preload(){
  slide = loadImage('image/slide11.png');
  brick = loadImage('image/box.png');
  back = loadImage('image/backimg.png');
  sound0 = loadSound('sound0.mp3');
  sound1 = loadSound('sound1.mp3');
  bgm = loadSound('babyshark.mp3');
  for(let i=0; i<egg.length; i++){
    egg[i] = new Egg(i);
  }
  for(let i=0; i<trash.length; i++){
    trash[i] = new Trash(i);
  }
  penguin = new Penguin();
}

function setup(){
  screen();
  displayDensity(1);
  createCanvas(displayWidth, displayHeight);
  mirrorImg = createImage(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  bgm.loop(true);
  bgm.setVolume(0.2);
  poseNet = ml5.poseNet(video, 'single');
  poseNet.on('pose', gotResult);
}

function draw(){
  clear();
  image(slide, 0, 0);
  mirrorCam();
  image(mirrorImg, 34, 37, mirrorImg.width*2, mirrorImg.height*2);
  fill(255, backSlider.value());
  rect(34, 37, videoSize.w, videoSize.h);
  image(back, 34, 450);
  fs = fullscreen();
  if(!fs){
    image(brick, -brick.width/2, videoSize.h-brick.height*1.7);
    image(brick, videoSize.w-brick.width/2, videoSize.h-brick.height*1.7);
  }else{
    image(brick, -brick.width/2, videoSize.h-brick.height*0.7);
    image(brick, videoSize.w-brick.width/2, videoSize.h-brick.height*0.7);    
  }
  for(let i = 0; i < poses.length; i++){
    if(mirror){
      keypointX[i]=round(video.width-poses[i].position.x)*2;
      keypointY[i]=round(poses[i].position.y*2);
    }else{
      keypointX[i]=round(poses[i].position.x*2);
      keypointY[i]=round(poses[i].position.y*2);
    }
  }
  penguin.move();
  for(let i=0; i<egg.length; i++){
    egg[i].show();
    egg[i].move();
    hit = collideCircleCircle(penguin.x, penguin.y, penguin.w, egg[i].x, egg[i].y, egg[i].w);
    if(hit){
      score += 10;
      egg[i].y = height+100;
      sound0.play();
    }
    penguin.show(hit);
  }
  for(let i=0; i<trash.length; i++){
    trash[i].show();
    trash[i].move();
    hit = collideCircleCircle(penguin.x, penguin.y, penguin.w, trash[i].x, trash[i].y, trash[i].w);
    if(hit){
      score -= 10;
      trash[i].y = height+100;
      sound1.play();
    }
    penguin.show(hit);
  }
  stroke('#FFFF00');
  strokeWeight(6);
  fill(0);
  textSize(60);
  textAlign(LEFT);
  text('SCORE : '+score, 45, 90);
  noStroke();
  strokeWeight(1);
  if(score >= 150){
    textSize(127);
    textAlign(CENTER, CENTER);
    strokeWeight(10);
    stroke(255);
    fill('#00FF00');
    text('미션 클리어 !!!!', videoSize.w/2+34, videoSize.h/2+37);
    bgm.stop();
    noLoop();
  }else if(score <= -30){
    textSize(127);
    strokeWeight(10);
    stroke(255);
    fill('#FF0000');
    textAlign(CENTER, CENTER);
    text('미션 실패 !!!!', videoSize.w/2+34, videoSize.h/2+37);
    bgm.stop();
    noLoop();
  }
  
}

function gotResult(results){
  if(results.length > 0){
    poses = results[0].pose.keypoints;
    skeletons = results[0].skeleton;
  }
}

function mirrorCam(){
  mirrorImg.loadPixels();
  video.loadPixels();

  if(mirror){
    for(let y = 0; y < video.height; y++){
      for(let x = 0; x < video.width; x++){
        let index0 = (x + y*video.width)*4;
        let index1 = (video.width-x+1+(y*video.width))*4;
        mirrorImg.pixels[index1+0] = video.pixels[index0+0];
        mirrorImg.pixels[index1+1] = video.pixels[index0+1];
        mirrorImg.pixels[index1+2] = video.pixels[index0+2];
        mirrorImg.pixels[index1+3] = 255;
      }
    }
  }else{
    for(let y = 0; y < video.height; y++){
      for(let x = 0; x < video.width; x++){
        let index = (x + y*video.width)*4;
        mirrorImg.pixels[index+0] = video.pixels[index+0];
        mirrorImg.pixels[index+1] = video.pixels[index+1];
        mirrorImg.pixels[index+2] = video.pixels[index+2];
        mirrorImg.pixels[index+3] = 255;
      }
    }
  }
  mirrorImg.updatePixels();
}

function screen(){
  screenBtn = createButton(' 전체화면 ');
  mirrorBtn = createButton(' 화면반전 ');
  newBtn = createButton(' 새게임 ');
  stopBtn = createButton(' 게임중지 ');
  backSlider = createSlider(0, 255, 0, 5);
  screenBtn.position(1400, 230);
  mirrorBtn.position(1505, 230);
  newBtn.position(1610, 230);
  stopBtn.position(1715, 230);
  backSlider.position(1470, 280);
  screenBtn.size(100, 30);
  mirrorBtn.size(100, 30);
  newBtn.size(100, 30);
  stopBtn.size(100, 30);
  backSlider.size(300);
  screenBtn. mousePressed(() => {
    fs = fullscreen();
    fullscreen(!fs);

    if (!fs) {
      screenBtn.html(' 전체화면 취소 ');
    } else { 
      screenBtn.html(' 전체화면');
    }
  });
  mirrorBtn.mousePressed(() => {mirror=~mirror;});
  newBtn.mousePressed(() => {
    score = 0;  
    bgm.play();
    loop();
  });
  stopBtn.mousePressed(() => {
    score = 0;  
    bgm.stop();
    noLoop();
  });
}

function wait(){
  penguin.hits = false;
}
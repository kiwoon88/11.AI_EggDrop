let fs;
let logo;
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

function preload(){
  logo = loadImage('image/logo.png');
  slide = loadImage('image/slide03.png');
  brick = loadImage('image/box.png');
  back = loadImage('image/backimg.png');

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
  poseNet = ml5.poseNet(video);
  poseNet.on('pose', gotResult);
}

function draw(){
  clear();
  image(slide, videoSize.w, 0);
  mirrorCam();
  image(mirrorImg, 0, 0, mirrorImg.width*2, mirrorImg.height*2);
  fill(255, backSlider.value());
  rect(0, 0, videoSize.w, videoSize.h);
  noStroke();
  fill(255, backSlider.value());
  rect(0, 0, videoSize.w, videoSize.h);
  fill('#1F1F1FA0');
  fs = fullscreen();
  if(!fs){
    image(back, 0, 300);
    rect(0, 850, mirrorImg.width*2, height);
    image(logo, 0, 770);
    image(brick, -brick.width/2, videoSize.h-brick.height*1.7);
    image(brick, videoSize.w-brick.width/2, videoSize.h-brick.height*1.7);
  }else{
    image(back, 0, 400);
    rect(0, 950, mirrorImg.width*2, height);
    image(logo, 0, 880);
    image(brick, -brick.width/2, videoSize.h-brick.height);
    image(brick, videoSize.w-brick.width/2, videoSize.h-brick.height);    
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
    }
    penguin.show(hit);
  }
  fill(0);
  textSize(50);
  text('SCORE : '+score, 0, 50);
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
  backSlider = createSlider(0, 255, 200, 5);
  screenBtn.position(1400, 200);
  mirrorBtn.position(1555, 200);
  backSlider.position(1400, 250);
  screenBtn.size(150, 30);
  mirrorBtn.size(150, 30);
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
}

function wait(){
  penguin.hits = false;
}
class Egg {
  constructor(a){
    this.img = loadImage('image/egg'+a+'.png');
    this.x = random(50, 1100);
    this.y = -floor(random(100, 600));
    this.s = random(0.4, 1.3);
    this.w = floor(this.img.width*this.s);
    this.h = floor(this.img.height*this.s);
    this.speed = floor(random(1, 6));    
    this.fs = fullscreen();
  }

  move(){
    this.y += this.speed;
    if(this.y > height-this.h){
      this.x = floor(random(50, 1100));
      this.y = -floor(random(100, 400));
      this.s = random(0.4, 1.3);
      this.w = floor(this.img.width*this.s);
      this.h = floor(this.img.height*this.s);
    }
  }

  show(){
    push();
    imageMode(CENTER);
    image(this.img, this.x, this.y, this.w, this.h);
    pop();
  }
}

class Trash {
  constructor(a){
    this.img = loadImage('image/trash'+a+'.png');
    this.x = random(50, 1100);
    this.y = -floor(random(100, 500));
    this.s = random(0.4, 1.3);
    this.w = floor(this.img.width*this.s);
    this.h = floor(this.img.height*this.s);
    this.speed = floor(random(1, 6));    
    this.fs = fullscreen();
  }

  move(){
    this.y += this.speed;
    if(this.y > height-this.h){
      this.x = floor(random(50, 1100));
      this.y = -floor(random(100, 400));
      this.s = random(0.4, 1.3);
      this.w = floor(this.img.width*this.s);
      this.h = floor(this.img.height*this.s);
    }
  }

  show(){
    push();
    imageMode(CENTER);
    image(this.img, this.x, this.y, this.w, this.h);
    pop();
  }
}



class Penguin {
  constructor(){
    this.img0 = loadImage('image/penguin0.png');
    this.img1 = loadImage('image/penguin1.png');
    this.x = 500;
    this.y = 960-this.img0.height;
    this.w = 150;
    this.h = 166;
    this.fs = fullscreen();
    this.hits = false;
  }

  move(){
    this.x = keypointX[0];
    if(this.x > 1160) this.x = 1160;
    else if(this.x < this.img0.width/2+50) this.x = this.img0.width/2+50;
    this.fs = fullscreen();
    if(!this.fs){
      this.y = 960-this.img0.height;
    }else{
      this.y = 1060-this.img0.height;
    }
  }

  wait(){
    this.hits = false;
  }

  show(a){
    push();
    imageMode(CENTER);
    if(!a && !this.hits){
      this.hits = false;
      image(this.img0, this.x, this.y);
    }else{
      image(this.img1, this.x, this.y, this.w*2, this.h*2);
      this.hits = true;
      setTimeout(wait, 200);
    }
    pop();
  }
}
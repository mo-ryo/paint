var ColorPicker = (function(){
  const CIRCLE_OUTSIDE_SIZE = 170;
  const CIRCLE_INSIDE_SIZE = 120;
  const INNER_RECT_SIZE = 70;

  const CENTER_X = CIRCLE_OUTSIDE_SIZE / 2;
  const CENTER_Y = CIRCLE_OUTSIDE_SIZE / 2;
  const CIRCLE_OUTSIDE_NORM = Math.pow(CIRCLE_OUTSIDE_SIZE / 2,2);
  const CIRCLE_INSIDE_NORM = Math.pow(CIRCLE_INSIDE_SIZE / 2,2);
  const CIRCLE_CURSOR_RADIUS = (CIRCLE_OUTSIDE_SIZE / 2 + CIRCLE_INSIDE_SIZE / 2) / 2;

  /*public
  -------------------------------------------------*/
  function ColorPicker(parent){
    this.colorCircle = document.createElement('canvas');
    this.ctx = this.colorCircle.getContext('2d');
    this.cursorCanvas = document.createElement('canvas');
    this.cursorCtx = this.cursorCanvas.getContext('2d');

    this.colorView = document.createElement('div');
    this.opacitySlider = document.createElement('input');

    this.SVCursor = {x:0,y:0};
    this.hueCursor = {x:0,y:0};
    this.dragHueCursor = false;
    this.dragSVCursor = false;

    this.color = {r:0,g:0,b:0};
    this.hue = {r:255,g:0,b:0};

    this.colorCircle.width = CIRCLE_OUTSIDE_SIZE;
    this.colorCircle.height = CIRCLE_OUTSIDE_SIZE;
    this.colorCircle.style.top = 0;
    this.colorCircle.style.left = 0;
    parent.appendChild(this.colorCircle);

    this.cursorCanvas.width = CIRCLE_OUTSIDE_SIZE;
    this.cursorCanvas.height = CIRCLE_OUTSIDE_SIZE;
    this.cursorCanvas.style.top = 0;
    this.cursorCanvas.style.left = 0;
    this.cursorCanvas.style.position = 'absolute';
    parent.appendChild(this.cursorCanvas);

    this.colorView.style.width = `${CIRCLE_OUTSIDE_SIZE}px`;
    this.colorView.style.height = `15px`;
    this.colorView.style.borderRadius = '15px';
    this.colorView.style.backgroundColor = 'rgb(0,0,0)';
    this.colorView.style.border = '1px solid rgb(150,150,150)';
    parent.appendChild(this.colorView);

    this.opacitySlider.type = 'range';
    this.opacitySlider.style.width = `${CIRCLE_OUTSIDE_SIZE}px`;
    this.opacitySlider.step = 0.01;
    this.opacitySlider.min = 0;
    this.opacitySlider.max = 1;
    this.opacitySlider.value = 1;
    parent.appendChild(this.opacitySlider);

    this.initEventListener()
    this.drawColorCircle();
    this.drawSVPallet();
    this.setColor(0,0,0);
    this.changeColor();
  }

  ColorPicker.prototype.getColorCode = function(){
    return `rgba(${this.color.r},${this.color.g},${this.color.b},${this.opacitySlider.value})`;
  }

  ColorPicker.prototype.setColor = function(r,g,b){
    var h,s,v;
    var min = Math.min(r,Math.min(g,b));
    var max = Math.max(r,Math.max(g,b));
    var oneThird = Math.PI / 3;

    if(r == g && g == b)h = 0;
    else if(r > g && r >= b)h = oneThird * ((g - b) / (max - min));
    else if(g >- r && g > b)h = oneThird * ((b - r) / (max - min)) + oneThird * 2;
    else if(b > r && b >= g)h = oneThird * ((r - g) / (max - min)) + oneThird * 4;

    var hx = -Math.sin(h) * 10;
    var hy = -Math.cos(h) * 10;

    s = max == 0 ? 1 : (max - min) / max;
    v = (255 - max) / 255;

    var half = INNER_RECT_SIZE / 2;
    var svx = INNER_RECT_SIZE * s - half;
    var svy = INNER_RECT_SIZE * v - half;

    this.setHueCursor(hx,hy);
    this.setSVCursor(svx ,svy);
    this.changeColor();
  }

  /*private
  -------------------------------------------------*/
  ColorPicker.prototype.drawColorCircle = function(){

    for(var i = 0;i < CIRCLE_OUTSIDE_SIZE;i++){
      for(var j = 0;j < CIRCLE_OUTSIDE_SIZE;j++){
        var x = j - CENTER_X;
        var y = i - CENTER_Y;
        var norm = x * x + y * y;
        if(CIRCLE_INSIDE_NORM <= norm && norm <= CIRCLE_OUTSIDE_NORM){
          this.ctx.fillStyle = this.calcHue(Math.atan2(x,y));
          this.ctx.fillRect(j,i,1,1);
        }
      }
    }

    //円の縁のアンチエイリアス
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = 'rgb(70,70,70)';
    this.ctx.beginPath();
    this.ctx.arc(CENTER_X,CENTER_Y,CIRCLE_OUTSIDE_SIZE / 2,Math.PI * 2,0,false);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(CENTER_X,CENTER_Y,CIRCLE_INSIDE_SIZE / 2,Math.PI * 2,0,false);
    this.ctx.stroke();
  }

  ColorPicker.prototype.calcHue = function(rad){
    rad += Math.PI;
    var r = 0;
    var g = 0;
    var b = 0;
    var x = (255 * 6) * (rad / (Math.PI * 2));

    if(x < 255){
      r = 255;
      g = x;
    }else if(x < 255 * 2){
      r = 255 * 2 - x;
      g = 255;
    }else if(x < 255 * 3){
      g = 255;
      b = x - 255 * 2;
    }else if(x < 255 * 4){
      g = 255 * 4 - x;
      b = 255;
    }else if(x < 255 * 5){
      r = x - 255 * 4;
      b = 255;
    }else{
      r = 255
      b = 255 * 6 - x;
    }

    return `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`;
  }

  ColorPicker.prototype.drawSVPallet = function(){
    var half = INNER_RECT_SIZE / 2;
    var addX = CIRCLE_OUTSIDE_SIZE / 2 - half;
    var addY = CIRCLE_OUTSIDE_SIZE / 2 - half;

    for(var i = 0;i < INNER_RECT_SIZE;i++){
      for(var j = 0;j < INNER_RECT_SIZE;j++){
        var x = j + addX;
        var y = i + addY;
        this.ctx.fillStyle = this.calcSV(j,i);
        this.ctx.fillRect(x,y,1,1);
      }
    }
  }

  ColorPicker.prototype.calcSV = function(x,y){
    var r = this.hue.r;
    var g = this.hue.g;
    var b = this.hue.b;

    var saturation = (INNER_RECT_SIZE - x) / INNER_RECT_SIZE;
    r = Math.min(255,r + (255 - r) * saturation);
    g = Math.min(255,g + (255 - g) * saturation);
    b = Math.min(255,b + (255 - b) * saturation);

    var brightness = (INNER_RECT_SIZE - y) / INNER_RECT_SIZE;
    var r = r * brightness;
    var g = g * brightness;
    var b = b * brightness;

    return `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`;
  }

  ColorPicker.prototype.setHueCursor = function(x,y){
    var dist = Math.sqrt(x * x + y * y);
    if(dist == 0)return;
    var unitX = x / dist;
    var unitY = y / dist;
    x = unitX * CIRCLE_CURSOR_RADIUS + CENTER_X;
    y = unitY * CIRCLE_CURSOR_RADIUS + CENTER_Y;

    this.hue = this.getPixelColor(x,y);

    this.hueCursor.x = x;
    this.hueCursor.y = y;

    this.drawSVPallet();
    this.color = this.getPixelColor(this.SVCursor.x,this.SVCursor.y);
    this.drawCursor();
  }

  ColorPicker.prototype.setSVCursor = function(x,y){
    var half = INNER_RECT_SIZE / 2;
    x = Math.min(half - 1,Math.max(-half,x)) + CENTER_X;
    y = Math.min(half - 1,Math.max(-half,y)) + CENTER_Y;

    this.color = this.getPixelColor(x,y);

    this.SVCursor.x = x;
    this.SVCursor.y = y;

    this.drawCursor();
  }

  ColorPicker.prototype.drawCursor = function(){
    this.cursorCtx.clearRect(0,0,CIRCLE_OUTSIDE_SIZE,CIRCLE_OUTSIDE_SIZE);

    var draw = (p,r,c) =>{
      this.cursorCtx.beginPath();
      this.cursorCtx.strokeStyle = c;
      this.cursorCtx.arc(p.x,p.y,r,0,Math.PI * 2,false);
      this.cursorCtx.stroke();
    }

    draw(this.hueCursor,8,'rgb(0,0,0)');
    draw(this.hueCursor,7,'rgb(255,255,255)');
    draw(this.SVCursor,8,'rgb(0,0,0)');
    draw(this.SVCursor,7,'rgb(255,255,255)');
  }

  ColorPicker.prototype.getPixelColor = function(x,y){
    var pixel = this.ctx.getImageData(x,y,1,1);
    return {r:pixel.data[0],g:pixel.data[1],b:pixel.data[2]};
  }

  ColorPicker.prototype.changeColor = function(){
    this.colorView.style.backgroundColor = `rgba(
      ${this.color.r},${this.color.g},${this.color.b},${this.opacitySlider.value}
    )`;
  }

  ColorPicker.prototype.initEventListener = function(){

    this.cursorCanvas.addEventListener('mousedown',(e) =>{
      var rect = this.cursorCanvas.getBoundingClientRect();
      var x = e.clientX - rect.left - CENTER_X;
      var y = e.clientY - rect.top - CENTER_Y;
      var norm = x * x + y * y;

      if(CIRCLE_INSIDE_NORM <= norm && norm <= CIRCLE_OUTSIDE_NORM){
        this.dragHueCursor = true;
        this.setHueCursor(x,y);
      }
      if(Math.abs(x) < INNER_RECT_SIZE / 2 && Math.abs(y) < INNER_RECT_SIZE / 2){
        this.dragSVCursor = true;
        this.setSVCursor(x,y);
      }
    });

    this.cursorCanvas.addEventListener('mouseup',(e) =>{
      this.dragHueCursor = false;
      this.dragSVCursor = false;
      this.changeColor();
    });

    this.cursorCanvas.addEventListener('mousemove',(e) =>{
      var rect = this.cursorCanvas.getBoundingClientRect();
      var x = e.clientX - rect.left - CENTER_X;
      var y = e.clientY - rect.top - CENTER_Y;

      if(this.dragHueCursor)this.setHueCursor(x,y);
      if(this.dragSVCursor)this.setSVCursor(x,y);
    });

    this.opacitySlider.addEventListener('change',(e) =>{
      this.changeColor();
    });

    this.cursorCanvas.addEventListener('mouseout',(e) =>{
      this.dragHueCursor = false;
      this.dragSVCursor = false;
      this.changeColor();
    });
  }


  return ColorPicker;
})();

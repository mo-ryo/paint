var FillOperation = (function(){
    /*public
    -------------------------------------------------*/
    function FillOperation(ctx,w,h,color){
      this.color = this.colorConvert(color);
      this.ctx = ctx;
      this.w = w;
      this.h = h;
      this.x;
      this.y;
      this.time = 0;
    }

    FillOperation.prototype.begin = function(x,y){

    }

    FillOperation.prototype.end = function(x,y){
      var start = new Date().getTime();
      this.x = x;
      this.y = y;
      this.fill(x,y);
      this.time = new Date().getTime() - start;
    }

    FillOperation.prototype.plot = function(x,y){
    }

    FillOperation.prototype.draw = function(){
      this.fill(this.x,this.y);
    }

    FillOperation.prototype.getOperationTime = function(){
      return this.time;
    }

    /*private
    -------------------------------------------------*/
    FillOperation.prototype.getColor = function(img,x,y){
      var pos = (y * this.w + x) * 4;
      return (
        (img.data[pos + 0] << 8 * 3) |
        (img.data[pos + 1] << 8 * 2) |
        (img.data[pos + 2] << 8 * 1) |
        (img.data[pos + 3] << 8 * 0)
      ) >>> 0;
    }

    FillOperation.prototype.setColor = function(img,x,y,color){
      var pos = (y * this.w + x) * 4;
      img.data[pos + 0] = (color >> 8 * 3) & 0xFF;
      img.data[pos + 1] = (color >> 8 * 2) & 0xFF;
      img.data[pos + 2] = (color >> 8 * 1) & 0xFF;
      img.data[pos + 3] = (color >> 8 * 0) & 0xFF;
    }

    FillOperation.prototype.fill = function(x,y){
      var img = this.ctx.getImageData(0,0,this.w,this.h);
      var seedColor = this.getColor(img,x,y);
      var seeds = [{x:x,y:y}];

      if(seedColor == this.color)return;

      while(seeds.length > 0){
        this.fillSeed(img,seeds,seedColor);
      }

      this.ctx.putImageData(img,0,0);
    }

    FillOperation.prototype.fillSeed = function(img,seeds,seedColor){
      var seed = seeds.shift();
      var left = seed.x;
      var right = seed.x + 1;

      while(left >= 0){
        if(this.getColor(img,left,seed.y) == seedColor){
          this.setColor(img,left,seed.y,this.color);
          left--;
        }else{
          break;
        }
      }
      while(right < this.w){
        if(this.getColor(img,right,seed.y) == seedColor){
          this.setColor(img,right,seed.y,this.color);
          right++;
        }else{
          break;
        }
      }

      if(seed.y - 1 >= 0)     this.findSeed(img,seeds,seedColor,left,right,seed.y - 1);
      if(seed.y + 1 < this.h) this.findSeed(img,seeds,seedColor,left,right,seed.y + 1);
    }

    FillOperation.prototype.findSeed = function(img,seeds,seedColor,left,right,y){
      var find = false;
      for(var x = left + 1;x < right;x++){
        if(this.getColor(img,x,y) == seedColor){
          if(!find)seeds.push({x:x,y:y});
          find = true;
        }else{
          find = false;
        }
      }
    }

    FillOperation.prototype.colorConvert = function(code){
      var ex = /^rgba?\((.*),(.*),(.*),(.*)\)/
      var res = code.match(ex);
      return (
        (res[1] << 8 * 3) |
        (res[2] << 8 * 2) |
        (res[3] << 8 * 1) |
        (Math.floor(res[4] * 255) << 8 * 0)
      )>>>0;
    }

    return FillOperation;
})();

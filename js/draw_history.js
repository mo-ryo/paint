var DrawHistory = (function(){
  const PREV_IMG_MAX_NUM = 20;
  const PREV_IMG_INTERVAL = 300;

  /*public
  -------------------------------------------------*/
  function DrawHistory(ctx,w,h){
    this.initialImg = ctx.getImageData(0,0,w,h);
    this.ctx = ctx;
    this.w = w;
    this.h = h;

    this.elapsedTime = 0;
    this.prevImgs = [];
    this.currentPos = -1;
    this.operations = [];
  }

  DrawHistory.prototype.back = function(){
    if(this.currentPos < 0)return;
    this.currentPos--;
    this.drawUpToCurrentPos();
  }

  DrawHistory.prototype.forward = function(){
    if(this.currentPos >= this.operations.length - 1)return;
    this.currentPos++;
    this.operations[this.currentPos].draw();
  }

  DrawHistory.prototype.add = function(operation){
    //現在地点より先の履歴を消す
    if(this.currentPos < this.operations.length - 1){
      this.operations = this.operations.slice(0,this.currentPos + 1);
    }
    for(var i = 0;i < this.prevImgs.length;i++){
      if(this.prevImgs[i].pos > this.currentPos){
        this.prevImgs.splice(i,this.prevImgs.length - i);
        break;
      }
    }

    this.operations.push(operation);
    this.currentPos++;
    this.addTime(operation);
  }

  /*private
  -------------------------------------------------*/
  DrawHistory.prototype.drawUpToCurrentPos = function(){
    var img = this.initialImg;
    var pos = 0

    //最も近い画像から先を描画する
    for(var i = this.prevImgs.length - 1;i >= 0;i--){
      if(this.prevImgs[i].pos <= this.currentPos){
        img = this.prevImgs[i].img;
        pos = this.prevImgs[i].pos;
        break;
      }
    }

    this.ctx.putImageData(img,0,0);
    for(var i = pos;i <= this.currentPos;i++){
      this.operations[i].draw();
    }
  }

  DrawHistory.prototype.addTime = function(operation){
    //処理の時間が一定を超えたとき画像を保存する
    this.elapsedTime += operation.getOperationTime();
    if(this.elapsedTime > PREV_IMG_INTERVAL){
      this.prevImgs.push({img:this.ctx.getImageData(0,0,this.w,this.h),pos:this.currentPos});
      this.elapsedTime = 0;

      if(this.prevImgs.length > PREV_IMG_MAX_NUM)this.prevImgs.shift();
    }
  }

  return DrawHistory;
})();

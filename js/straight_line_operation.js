var StraightLineOperation = (function(){
  /*public
  -------------------------------------------------*/
  function StraightLineOperation(ctx,tempCtx,w,h,brushSize,color){
    this.brushSize = brushSize;
    this.color = color;
    this.ctx = ctx;
    this.tempCtx = tempCtx;
    this.w = w;
    this.h = h;

    this.beginX;
    this.beginY;
    this.endX;
    this.endY;

    this.time = 0;
  }

  StraightLineOperation.prototype.begin = function(x,y){
    this.beginX = x;
    this.beginY = y;

    this.tempCtx.strokeStyle = this.color;
    this.tempCtx.lineWidth = this.brushSize;
    this.tempCtx.beginPath();
  }

  StraightLineOperation.prototype.end = function(x,y){
    this.tempCtx.clearRect(0,0,this.w,this.h);
    this.endX = x;
    this.endY = y;
    this.draw();
  }

  StraightLineOperation.prototype.plot = function(x,y){
    this.tempCtx.clearRect(0,0,this.w,this.h);
    this.tempCtx.beginPath();
    this.tempCtx.moveTo(this.beginX,this.beginY);
    this.tempCtx.lineTo(x,y);
    this.tempCtx.stroke();
  }

  StraightLineOperation.prototype.draw = function(){
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.brushSize;
    this.ctx.beginPath();
    this.ctx.moveTo(this.beginX,this.beginY);
    this.ctx.lineTo(this.endX,this.endY);
    this.ctx.stroke();
  }

  StraightLineOperation.prototype.getOperationTime = function(){
    return this.time;
  }

  return StraightLineOperation;
})();

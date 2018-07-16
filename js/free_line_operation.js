var FreeLineOperation = (function(){

  /*public
  -------------------------------------------------*/
  function FreeLineOperation(ctx,tempCtx,w,h,brushSize,color){
    this.brushSize = brushSize;
    this.color = color;
    this.pointsX = [];
    this.pointsY = [];
    this.ctx = ctx;
    this.tempCtx = tempCtx;
    this.w = w;
    this.h = h;
    this.time = 0;
  }

  FreeLineOperation.prototype.begin = function(x,y){
    this.pointsX.push(x);
    this.pointsY.push(y);

    this.tempCtx.strokeStyle = this.color;
    this.tempCtx.lineWidth = this.brushSize;
    this.tempCtx.beginPath();
  }

  FreeLineOperation.prototype.end = function(x,y){
    this.tempCtx.clearRect(0,0,this.w,this.h);
    this.draw();
  }

  FreeLineOperation.prototype.plot = function(x,y){
    var prevX = this.pointsX[this.pointsX.length - 1];
    var prevY = this.pointsY[this.pointsY.length - 1];
    this.pointsX.push(x);
    this.pointsY.push(y);

    this.tempCtx.moveTo(prevX,prevY);
    this.tempCtx.lineTo(x,y);
    this.tempCtx.stroke();
  }

  FreeLineOperation.prototype.draw = function(){
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.brushSize;
    this.ctx.beginPath();
    this.ctx.moveTo(this.pointsX[0],this.pointsY[0]);
    for(var i = 1;i < this.pointsX.length;i++){
      this.ctx.lineTo(this.pointsX[i],this.pointsY[i]);
    }
    this.ctx.stroke();
  }

  FreeLineOperation.prototype.getOperationTime = function(){
    return this.time;
  }

  return FreeLineOperation;
})();

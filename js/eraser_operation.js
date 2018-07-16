var EraserOperation = (function(){
  /*public
  -------------------------------------------------*/
  function EraserOperation(ctx,w,h,brushSize){
    this.brushSize = brushSize;
    this.pointsX = [];
    this.pointsY = [];
    this.ctx = ctx;
    this.w = w;
    this.h = h;
    this.time = 0;
  }

  EraserOperation.prototype.begin = function(x,y){
    this.pointsX.push(x);
    this.pointsY.push(y);

    this.ctx.strokeStyle = 'rgb(255,255,255)';
    this.ctx.lineWidth = this.brushSize;
    this.ctx.beginPath();
  }

  EraserOperation.prototype.end = function(x,y){
  }

  EraserOperation.prototype.plot = function(x,y){
    var prevX = this.pointsX[this.pointsX.length - 1];
    var prevY = this.pointsY[this.pointsY.length - 1];
    this.pointsX.push(x);
    this.pointsY.push(y);

    this.ctx.moveTo(prevX,prevY);
    this.ctx.lineTo(x,y);
    this.ctx.stroke();
  }

  EraserOperation.prototype.draw = function(){
    this.ctx.strokeStyle = 'rgb(255,255,255)';
    this.ctx.lineWidth = this.brushSize;
    this.ctx.beginPath();
    this.ctx.moveTo(this.pointsX[0],this.pointsY[0]);
    for(var i = 1;i < this.pointsX.length;i++){
      this.ctx.lineTo(this.pointsX[i],this.pointsY[i]);
    }
    this.ctx.stroke();
  }

  EraserOperation.prototype.getOperationTime = function(){
    return this.time;
  }


  /*private
  -------------------------------------------------*/


  return EraserOperation;
})();

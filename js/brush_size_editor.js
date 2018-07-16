var BrushSizeEditor = (function(){
  const EDITOR_SIZE = 150;
  const CENTER_X = EDITOR_SIZE / 2;
  const CENTER_Y = EDITOR_SIZE / 2;
  const MAX_RADIUS = 120;

  /*public
  -------------------------------------------------*/
  function BrushSizeEditor(parent){
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.brushSize = 20;
    this.isMouseDown = false;

    this.canvas.width = EDITOR_SIZE;
    this.canvas.height = EDITOR_SIZE;
    parent.appendChild(this.canvas);

    this.initEventListener();
    this.drawEditor();
  }

  BrushSizeEditor.prototype.getBrushSize = function(){
    return this.brushSize;
  }

  /*private
  -------------------------------------------------*/
  BrushSizeEditor.prototype.drawEditor = function(){
    this.ctx.clearRect(0,0,EDITOR_SIZE,EDITOR_SIZE);
    this.ctx.beginPath();
    this.ctx.arc(CENTER_X,CENTER_Y,this.brushSize / 2,0,Math.PI * 2,false);

    this.ctx.font = "18px 'Times New Roman'";
    this.ctx.textAlign = 'center';
    this.ctx.textBaseLine = 'bottom';
    this.ctx.fillText(`${this.brushSize}px`,EDITOR_SIZE / 2,EDITOR_SIZE - 5);

    this.ctx.stroke();
  }

  BrushSizeEditor.prototype.initEventListener = function(){
    var setSize = (e) =>{
      var rect = e.target.getBoundingClientRect();
      var x = Math.abs(e.clientX - rect.left - CENTER_X);
      var y = Math.abs(e.clientY - rect.top - CENTER_Y);
      var dist = Math.min(MAX_RADIUS ,Math.max(1,Math.sqrt(x * x + y * y) * 2));
      this.brushSize = Math.floor(dist);
      this.drawEditor();
    }

    this.canvas.addEventListener('mousedown',(e) =>{
      this.isMouseDown = true;
      setSize(e);
    });

    this.canvas.addEventListener('mouseup',(e) =>{
      if(this.isMouseDown){
        this.isMouseDown = false;
        setSize(e)
      }
    });

    this.canvas.addEventListener('mousemove',(e) =>{
      if(this.isMouseDown)setSize(e);
    });

    this.canvas.addEventListener('mouseout',(e) =>{
      this.isMouseDown = false;
    });
  }

  return BrushSizeEditor;
})();

var PaintTool = (function () {
  /*public
  -------------------------------------------------*/
  function PaintTool(parent, colorPicker, brushSizeEditor) {
    this.displayCanvas = document.createElement('canvas');
    this.displayCtx = this.displayCanvas.getContext('2d');
    this.imgCanvas = document.createElement('canvas');
    this.imgCtx = this.imgCanvas.getContext('2d');
    this.tempCanvas = document.createElement('canvas');
    this.tempCtx = this.tempCanvas.getContext('2d');

    parent.appendChild(this.displayCanvas);

    this.w = 0;
    this.h = 0;
    this.scale;
    this.operationType = 'free_line';

    this.colorPicker = colorPicker;
    this.brushSizeEditor = brushSizeEditor;
    this.paintOperation = null;
    this.drawHistory;
    this.drawText = 'text';

    this.initEventListener();
    this.createNewImg(900, 900);
  }

  PaintTool.prototype.createNewImg = function (w, h) {
    this.imgCanvas.width = w;
    this.imgCanvas.height = h;
    this.imgCtx.lineCap = 'round';
    this.imgCtx.lineJoin = 'round';
    this.imgCtx.fillStyle = 'rgb(255,255,255)';
    this.imgCtx.fillRect(0, 0, w, h);

    this.tempCanvas.width = w;
    this.tempCanvas.height = h;
    this.tempCtx.lineCap = 'round';
    this.tempCtx.lineJoin = 'round';
    this.tempCtx.globalCompositeOperation = 'copy';
    this.tempCtx.clearRect(0, 0, w, h);

    this.w = w;
    this.h = h;

    this.drawHistory = new DrawHistory(this.imgCtx, this.w, this.h);

    this.setScale(1);
    this.drawCanvas();
  }

  PaintTool.prototype.drawCanvas = function () {
    this.displayCtx.clearRect(0, 0, this.w, this.h);
    this.displayCtx.drawImage(this.imgCanvas, 0, 0);
    this.displayCtx.drawImage(this.tempCanvas, 0, 0);
  }

  PaintTool.prototype.setScale = function (scale) {
    this.scale = scale;
    this.displayCanvas.width = this.imgCanvas.width * this.scale;
    this.displayCanvas.height = this.imgCanvas.height * this.scale;
    this.displayCtx.scale(this.scale, this.scale);
    this.drawCanvas();
  }

  PaintTool.prototype.setOperationType = function (type) {
    this.operationType = type;
  }

  PaintTool.prototype.back = function () {
    this.drawHistory.back();
    this.drawCanvas();
  }

  PaintTool.prototype.forward = function () {
    this.drawHistory.forward();
    this.drawCanvas();
  }

  PaintTool.prototype.setImg = function (img, w, h) {
    this.createNewImg(w, h);
    this.imgCtx.drawImage(img, 0, 0);
    this.drawHistory = new DrawHistory(this.imgCtx, w, h);
    this.drawCanvas();
  }

  PaintTool.prototype.getCanvas = function () {
    return this.imgCanvas;
  }
  /*private
  -------------------------------------------------*/
  PaintTool.prototype.createOperation = function () {
    switch (this.operationType) {
      case 'free_line':
        return new FreeLineOperation(
          this.imgCtx, this.tempCtx,
          this.w, this.h,
          this.brushSizeEditor.getBrushSize(),
          this.colorPicker.getColorCode()
        );

      case 'straight_line':
        return new StraightLineOperation(
          this.imgCtx, this.tempCtx,
          this.w, this.h,
          this.brushSizeEditor.getBrushSize(),
          this.colorPicker.getColorCode()
        )

      case 'eraser':
        return new EraserOperation(
          this.imgCtx,
          this.w, this.h,
          this.brushSizeEditor.getBrushSize()
        );

      case 'fill':
        return new FillOperation(
          this.imgCtx,
          this.w, this.h,
          this.colorPicker.getColorCode()
        )

      case 'text':
        return new TextOperation(
          this.imgCtx,
          this.tempCtx,
          this.w, this.h,
          this.drawText,
          this.brushSizeEditor.getBrushSize(),
          this.colorPicker.getColorCode()
        )

    }
    return null;
  }

  PaintTool.prototype.canvasPosToImgPos = function (x, y) {
    var p = { x: 0, y: 0 };
    var rect = this.displayCanvas.getBoundingClientRect();
    p.x = Math.floor((x - rect.left) / this.scale);
    p.y = Math.floor((y - rect.top) / this.scale);
    return p;
  }

  PaintTool.prototype.initEventListener = function () {
    this.displayCanvas.addEventListener('mousedown', (e) => {
      var p = this.canvasPosToImgPos(e.clientX, e.clientY);

      //右クリック時はスポイト処理
      if (e.button == 2) {
        var pixel = this.imgCtx.getImageData(p.x, p.y, 1, 1);
        this.colorPicker.setColor(pixel.data[0], pixel.data[1], pixel.data[2]);
        return;
      }

      if (this.paintOperation === null) {
        this.paintOperation = this.createOperation();
        this.paintOperation.begin(p.x, p.y);
        this.drawCanvas();
      }
    });

    this.displayCanvas.addEventListener('mouseup', (e) => {
      if (this.paintOperation !== null) {
        var p = this.canvasPosToImgPos(e.clientX, e.clientY);

        this.paintOperation.end(p.x, p.y);
        this.drawHistory.add(this.paintOperation);
        this.paintOperation = null;
        this.drawCanvas();
      }
    });

    this.displayCanvas.addEventListener('mousemove', (e) => {
      if (this.paintOperation !== null) {
        var p = this.canvasPosToImgPos(e.clientX, e.clientY);

        this.paintOperation.plot(p.x, p.y);
        this.drawCanvas();
      }
    });

    this.displayCanvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    this.displayCanvas.addEventListener('mouseout', (e) => {
      if (this.paintOperation !== null) {
        var p = this.canvasPosToImgPos(e.clientX, e.clientY);

        this.paintOperation.end(p.x, p.y);
        this.drawHistory.add(this.paintOperation);
        this.paintOperation = null;
        this.drawCanvas();
      }
    });
  }

  return PaintTool;
})();

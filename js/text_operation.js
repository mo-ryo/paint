var TextOperation = (function () {

    /*public
    -------------------------------------------------*/
    function TextOperation(ctx, tempCtx, w, h, text, textSize, color) {
        this.textSize = textSize;
        this.ctx = ctx;
        this.tempCtx = tempCtx;
        this.w = w;
        this.h = h;
        this.color = color;
        this.text = text;
        this.x = 0;
        this.y = 0;
        this.time = 0;
    }

    TextOperation.prototype.begin = function (x, y) {
        this.plot(x,y);
    }

    TextOperation.prototype.end = function (x, y) {
        this.tempCtx.clearRect(0, 0, this.w, this.h);
        this.draw();
    }

    TextOperation.prototype.plot = function (x, y) {
        this.x = x;
        this.y = y;
        this.tempCtx.clearRect(0,0,this.w,this.h);
        this.tempCtx.fillStyle = this.color;
        this.tempCtx.font = this.textSize + "px 'Times New Roman'";
        this.tempCtx.fillText(this.text,this.x,this.y);
    }

    TextOperation.prototype.draw = function () {
        this.ctx.fillStyle = this.color;
        this.ctx.font = this.textSize + "px 'Times New Roman'";
        this.ctx.fillText(this.text,this.x,this.y);
    }

    TextOperation.prototype.getOperationTime = function () {
        return this.time;
    }

    return TextOperation;
})();

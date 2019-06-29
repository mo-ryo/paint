(function(){
  var paintTool;
  var colorPicker;
  var brushSizeEditor;

  /*init
  -------------------------------------------------*/
  (function(){
    colorPicker = new ColorPicker(document.getElementById('color_picker'));
    brushSizeEditor = new BrushSizeEditor(document.getElementById('brush_size_editor'));
    paintTool = new PaintTool(document.getElementById('canvas_frame'),colorPicker,brushSizeEditor);
  })();

  /*change text
  -------------------------------------------------*/
  document.getElementById('draw_text').addEventListener('change',function(e){
    paintTool.drawText = e.target.value;
  });

  /*zoom
  -------------------------------------------------*/
  document.getElementById('zoom_value').addEventListener('change',function(e){
    var value = Math.max(10,Math.min(300,e.target.value));

    document.getElementById('zoom_value').value = value;
    document.getElementById('zoom_slider').value = value;
    paintTool.setScale(e.target.value / 100);
  });
  document.getElementById('zoom_slider').addEventListener('change',function(e){
    document.getElementById('zoom_value').value = e.target.value;
    paintTool.setScale(e.target.value / 100);
  });

  /*back and forward
  -------------------------------------------------*/
  document.getElementById('back_button').addEventListener('click',function(e){
    paintTool.back();
  });

  document.getElementById('forward_button').addEventListener('click',function(e){
    paintTool.forward();
  });

  /*tool tool select
  -------------------------------------------------*/
  document.getElementById('tool_selector').addEventListener('change',function(e){
    paintTool.setOperationType(e.target.value);
  })

  /*import and export
  -------------------------------------------------*/
  document.getElementById('import_button').addEventListener('change',function(e){
    var file = e.target.files;
    var reader =  new FileReader();

    reader.readAsDataURL(file[0]);
    reader.onload = function(){
      var img = new Image();
      img.src = reader.result;
      img.onload = function(){
        paintTool.setImg(img,img.naturalWidth,img.naturalHeight);
      }
    }
  });

  document.getElementById('export_button').addEventListener('click',function(e){
    var a = document.createElement('a');

    a.href = paintTool.getCanvas().toDataURL('image/bmp');
    a.download = 'image';
    a.click();
  });

  /*create New
  -------------------------------------------------*/
  document.getElementById('create_new_button').addEventListener('click',function(e){
    var size = window.prompt('please enter new image size','h=900 w=900');
    if(size == null)return;

    var res = size.match(/h=([0-9]+)\s*w=([0-9]+)/);
    if(res == null)return;

    var h = res[1] - 0;
    var w = res[2] - 0;
    if(h <= 0 || w <= 0)return;

    paintTool.createNewImg(w,h);
  });

})();

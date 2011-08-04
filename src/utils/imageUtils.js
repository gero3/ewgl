(function(global){
  
  global.utils = global.utils || {};
    
  var canvas1 = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  
  global.utils.getImageData = function(img){
    var img = args.image;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
      
    return ctx.getImageData(0,0,img.width,img.height);
  };
    
}());
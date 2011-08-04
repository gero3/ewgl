(function(global){
  
  var loader = global.loader;
  var replacementImage = new Image();
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  
  var imageDataLoader = function(args){
    
    var arg = {};
    arg.url = args.url;
    
    
    arg.onComplete = createOnCompleteCallback(args.onComplete);
    arg.onError = createOnErrorCallback(args.onError);
    loader.loadImage(arg);
    
    return [];
  };
  
  var createOnCompleteCallback = function(onComplete){
    return function(args){
      var img = args.image;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      var imgdata = ctx.getImageData(0,0,img.width,img.height);
      
      if (onComplete){
        onComplete({"imageData": imgdata,"image":img});
      }
    }; 
  };
  
  var createOnErrorCallback = function(onError){
    return function(args){
      if (onError){
        onError(args);
      }
    };
  };
  
  loader.loadImageData = function(args){
    return imageDataLoader(args);
  };
  
  loader.addLoader({  "loader" : imageDataLoader});
  
}(EWGL));
(function(global){
  
  var loader = global.loader;
  var Texture = global.texture;
  var replacementImage = new Image();
  
  var textureLoader = function(args){
    
    var texture = new Texture();
    var arg = {};
    arg.url = args.url;
    arg.onComplete = createOnCompleteCallback(args.onComplete,{"texture": texture});
    arg.onError = createOnErrorCallback(args.onError,{"texture": texture});
    texture.image = loader.loadImage(arg);
    
    return texture;
  };
  
  var createOnCompleteCallback = function(onComplete,args){
    return function(){
      if (onComplete){
        onComplete(args);
      }
      args.texture.flags.imageLoaded = true;
    }; 
  };
  
  var createOnErrorCallback = function(onError,args){
    return function(){
      if (onError){
        onError(args);
      }
      loader.counter -= 1;
    };
  };
  
  loader.loadTexture = function(args){
    return textureLoader(args);
  };
  
  loader.addLoader({  "loader" : textureLoader});
  
}(EWGL));
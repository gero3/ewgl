(function(global){
  
  var loader = global.loader;
  
  var loading = [];
  
  var imageLoader = function(args){
    loader.counter += 1;
    
    args = args || {};
    
    var img = args.image || new Image();
    var argsToSent = {"image":img};
    img.onload = createOnCompleteCallback(args.onComplete,argsToSent);
    img.onerror =  createOnErrorCallback(args.onError,argsToSent);
    img.src = args.url;
    return img;
  };
  
  var createOnCompleteCallback = function(onComplete,args){
    return function(){
      if (onComplete){
        onComplete(args);
      } else {
        loader.onComplete(args);
      }
      loader.counter -= 1;
    }; 
  };
  
  var createOnErrorCallback = function(onError,args){
    return function(){
      if (onError){
        onError(args);
      } else {
        loader.onError(args);
      }
      loader.counter -= 1;
    };
  };
  
  loader.loadImage = function(args){
    return imageLoader(args);
  };
  
  loader.addLoader({  "loader" : imageLoader,
                      "extensions": ["JPG","PNG","GIF"]
                  });
  
}(EWGL));
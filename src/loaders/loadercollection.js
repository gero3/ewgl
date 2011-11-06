(function(global){
  var undef;
  
  var loaderCollection = {
    "loaders": []
  };
  loaderCollection.addLoader = function(loader, options){
    loaderCollection.loaders.push(loader);
    
    if (options.property){
      loaderCollection[options.property] = function(args){
        return new loader(args);
      };
    }
  };
     
  global.loaderCollection = loaderCollection;  
  
  
}(EWGL));
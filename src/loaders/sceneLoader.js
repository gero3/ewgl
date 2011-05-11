(function(global){
  
  var loader = global.loader;
  
  
  var sceneLoader = function(args){
    
    
  };
  
  loader.loadscene = function(args){
    return sceneLoader(args);
  };
  
  loader.addLoader({  "loader" : sceneLoader,
                      "extensions": ["scene"]
                  });
  
}(EWGL));
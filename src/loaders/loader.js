(function(global){
  var undef;
  
  var loader = {
    "loaders": [],
    "extensions" : {},
    "specialCases" : [],
    "defaultLoader" : undef,
    "onLoadedCompleted":function(){}
  };
  
  Object.defineProperties(loader,{
    "_counter" :{
      "value":0,
      "configurable" : true,   
      "writable": true
    },
    "counter": {
      "get": function(){
        return loader._counter;
      },
      "set":function(value){
        loader._counter = value;
        if (loader._counter === 0){
          loadingCompleted();
        }
      }
    }
  });

  loader.addLoader = function(args){
    var i,l;
    loader.loaders.push(args.loader);
    if (args.extensions){
      l = args.extensions.length;
      if (l !== undef){
        for(i=0;i<l;i++){
          loader.extensions[args.extensions[i].toUpperCase()] = args.loader;
        }
      } else {
        loader.extensions[args.extensions.toUpperCase()] = args.loader;
      }
    }
    if (args.specialCases){
      l = args.specialCases.length;
      if (l !== undef){
        for(i=0;i<l;i++){
          loader.specialCases.push({"evaluate":args.specialCases[i],"loader":args.loader});
        }
      } else {
        loader.specialCases.push({"evaluate":args.specialCases[i],"loader":args.loader});
      }
    }
  };
  
  loader.load = function(args){
    var i,l,extension;
    l = loader.specialCases.length;
    for(i=0;i<l;i++){
      if (loader.specialCases[i].evaluate(args)){
        return loader.load(args);
      }
    }
    i = args.url.lastIndexOf(".");
    l = args.url.substring(i+1).toUpperCase();
    if (loader.extensions[l]){
      return loader.extensions[l](args);
    }
    return loader.defaultLoader(args);
  };
    
    
  loader.onComplete = function(ex){
    console.log("test");
  };
  
  
  loader.onError = function(ex){
    throw "Something Not loaded correctly.";
  };
  
  var loadingCompleted = function(){
    loader.onLoadedCompleted();
  };
     
  global.loader = loader;  
  
  
}(EWGL));
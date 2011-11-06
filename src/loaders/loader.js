(function(global){


  var loader = function(){
  };
  
  loader.prototype.onLoadStart = function(){};
  loader.prototype.onDownloadStart = function(){};
  loader.prototype.onDownloadComplete = function(){};
  loader.prototype.onLoadComplete = function(){};
  
  loader.prototype.busy = false;
  
  loader.prototype.load = function(){};
  
  global.loader = loader;
}(EWGL));
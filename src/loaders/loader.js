(function(global){


  var loader = function(args){
    if (args){
    
      if (args.onLoadStart){
        this.onLoadStart = args.onLoadStart;
      }
      
      if (args.onDownloadStart){
        this.onDownloadStart = args.onDownloadStart;
      }
      
      if (args.onDownloadComplete){
        this.onDownloadComplete = args.onDownloadComplete;
      }
      
      if (args.onLoadComplete){
        this.onLoadComplete = args.onLoadComplete;
      }
      
      if (args.onError){
        this.onError = args.onError;
      }
    }
    
    this.load(args);
    
  };
  
  loader.prototype.onLoadStart = function(){};
  loader.prototype.onDownloadStart = function(){};
  loader.prototype.onDownloadComplete = function(){};
  loader.prototype.onLoadComplete = function(){};
  loader.prototype.onError = function(){};
  
  //loader.prototype.busy = false;
  
  loader.prototype.load = function(){};
  
  global.loader = loader;
}(EWGL));
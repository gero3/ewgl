(function(global){
  
  var loader = global.loader;
  var loaderCollection = global.loaderCollection;
  
  var webworkerLoader = function(args){
    loader.call(this,args);
  };
  global.inherit(loader,webworkerLoader);
    
  webworkerLoader.prototype.load = function(args){
    var self = this;
    var url = args.url;
    
    self.onLoadStart(url);
    
    worker = new Worker( url );
    
    worker.onmessage = function(event){
      self.onDownloadComplete(event.data);
      self.onLoadComplete(event.data);
    };
    
    worker.onerror = function(ex){
      self.onError(ex);
    };
    
    self.onDownloadStart(url);
    worker.postMessage();
  };
  

  
  var options = {};
  options.property = "loadWebworker";
  loaderCollection.addLoader(webworkerLoader,options);
  
}(EWGL));
(function(global){
  
  var loader = global.loader;
  var loaderCollection = global.loaderCollection;
  
  var imageLoader = function(args){
    loader.call(this,args);
  };
  
  global.inherit(loader,imageLoader);
  
  imageLoader.prototype.load = function(args){
    var self = this;
    var url = args.url;
    
    self.onLoadStart(url);
    
    var img = args.img || new Image();
    if (url.indexOf("http") !== -1) {
      img.crossOrigin = '';
    }
    
    img.onload = function(){
      self.onDownloadComplete(img);
      self.onLoadComplete(img);
    };
    
    img.onerror = function(){
      self.onError();
    };
    
    self.onDownloadStart(url);
    img.src = url;

  };
  

  
  var options = {};
  options.property = "loadImage";
  loaderCollection.addLoader(imageLoader,options);
  
  
}(EWGL));
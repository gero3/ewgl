(function(global){
  
    
  var loader = global.loader;
  var loaderCollection = global.loaderCollection;
  
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  
  var imageDataLoader = function(args){
    loader.call(this,args);
  };
  
  global.inherit(loader,imageDataLoader);
  
  imageDataLoader.prototype.load = function(args){
    var self = this;
    self.onLoadStart();
    
    var onLoadComplete = function(img){
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      var imgdata = ctx.getImageData(0,0,img.width,img.height);
      
      self.onLoadComplete(imgdata);
    };
                    
    var options = { "url":args.url,
                    "onDownloadStart": args.onDownloadStart,
                    "onDownloadComplete": args.onDownloadComplete,
                    "onLoadComplete": onLoadComplete,
                    "onError" :args.onError};
                    
    loaderCollection.loadImage(options);
    
    
  };
  
  var options = {};
  options.property = "loadImageData";
  loaderCollection.addLoader(imageDataLoader,options);
  
}(EWGL));
(function(global){
  
  var loader = global.loader;
  var loaderCollection = global.loaderCollection;
  var Texture = global.texture;
  
  var textureLoader = function(args){
    loader.call(this,args);
  };
  
  global.inherit(loader,textureLoader);
  
  textureLoader.prototype.load = function(args){
    var self = this;
    self.onLoadStart();
    var texture = new Texture();
    
    var onLoadComplete = function(img){
      texture.image = img;
      texture.flags.imageLoaded = true;
      self.onLoadComplete(texture);
    };
                    
    var options = { "url":args.url,
                    "onDownloadStart": args.onDownloadStart,
                    "onDownloadComplete": args.onDownloadComplete,                    
                    "onLoadComplete": onLoadComplete,
                    "onError" :args.onError};
    loaderCollection.loadImage(options);
  };

  
  var options = {};
  options.property = "loadTexture";
  loaderCollection.addLoader(textureLoader,options);
  
}(EWGL));
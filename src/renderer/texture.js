(function(global){
  var undef;
  
  
  var texture = function(args){
    var self = this;
    this.texture = undef;
    this.flags = {};
    this.image = global.loader.load({ "url":args.url,
                                    "onComplete":onload(self),
                                    "onError":onerror(self)
                                  });
  };
  
  var onload = function (self) {
    return function(){
      handleLoadedTexture(self);
    };
  };
  
  var onerror = function (self) {
    return function(){
      self.image.src ="http://media.tojicode.com/q3bsp/demo_baseq3/webgl/no-shader.png";
    };
  };
  
  var handleLoadedTexture = function(tex){
    tex.flags.imageLoaded = true;
  };
  
  global.texture = texture;
}(EWGL));
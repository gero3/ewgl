(function(global){
  var undef;
  var texture = function(args){
    var self = this;
    this.texture = undef;
    this.flags = {};
    this.image = new Image();
    this.image.onload = function () {
      handleLoadedTexture(self)
    };
    this.image.src = args.url;
  };
  
  var handleLoadedTexture = function(tex){
    tex.flags.imageLoaded = true;
  };
  
  global.texture = texture;
}(window));
(function(global){
  var undef;
  var replacementImage = new Image();
  
  
  var texture = function(args){
    args = args || {};
    this.texture = undef;
    this.flags = {};
    this.image = args.img || undef;
  };
  
  global.texture = texture;
}(EWGL));
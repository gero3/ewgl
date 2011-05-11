(function(global){
  
  var node = global.node;
  var lights = global.lights;
  
  var undef;
  var light = function light(args){
    //important to keep the prototypal chain clean
    node.call(this,args);
    lights.addLight(this);
    return this;
  };
  
  light.prototype = new node();

  light.prototype.setTransformFlag = function(){
    lights.flags.changedLights = true;
    node.prototype.setTransformFlag.apply(this);
  };
  
  light.types = [];
  
  global.light = light;
  
}(EWGL));
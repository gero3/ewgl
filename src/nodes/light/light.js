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
  
  global.light = light;
  
}(EWGL));
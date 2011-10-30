(function(global){
  
  var light = global.light;
  var lights = global.lights;
  var node = global.node;
  
  var ambientLight = function ambientLight(args){
    //important to keep the prototypal chain clean
    light.call(this,args);
    this.color = args.color || vec3.create([1,1,1]);
    return this;
  };
  
  global.inherit(light,ambientLight);
  
  ambientLight.prototype.type = lights.types.ambientLight;
  
  node.prototype.attachNewAmbientLight = function(args){
    args = args || {};
    args.parent = this;
    return new ambientLight(args);
  };
  
  global.ambientLight = ambientLight;
  
}(EWGL));
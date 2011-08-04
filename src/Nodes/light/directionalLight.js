(function(global){
  
  var light = global.light;
  var lights = global.lights;
  var node = global.node;
  
  var undef;
  
  var directionalLight = function directionalLight(args){
    
    //important to keep the prototypal chain clean
    light.call(this,args);
    
    this.color = args.color || vec3.create([1,1,1]);
    this.direction = args.direction || vec3.create([1,1,0]);
    
    return this;
  };
  
  directionalLight.prototype = new light();
  directionalLight.prototype.type = lights.types.directionalLight;
  
  node.prototype.attachNewDirectionalLight = function(args){
    args = args || {};
    args.parent = this;
    return new directionalLight(args);
  };
  
  global.directionalLight = directionalLight;
  
}(EWGL));
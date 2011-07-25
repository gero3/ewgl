(function(global){
  
  var light = global.light;
  var lights = global.lights;
  
  var ambientLight = function ambientLight(args){
    //important to keep the prototypal chain clean
    light.call(this,args);
    this.color = args.color || vec3.create([1,1,1]);
    return this;
  };
  
  ambientLight.prototype = new light();
  ambientLight.prototype.type = lights.types.ambientLight;
  
  global.ambientLight = ambientLight;
  
}(EWGL));
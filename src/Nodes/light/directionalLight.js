(function(global){
  
  var light = global.light;
  var lights = global.lights;
  
  var undef;
  
  var directionalLight = function directionalLight(args){
    
    //important to keep the prototypal chain clean
    light.call(this,args);
    
    this.color = args.scale || vec3.create([1,1,1]);
    
    return this;
  };
  
  directionalLight.prototype = new light();
  
  global.directionalLight = directionalLight;
  
}(EWGL));
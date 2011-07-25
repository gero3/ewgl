(function(global){
  
  var lights = {
    lights : [],
    flags : {},
    types : {
      ambientLight: 1,
      directionalLight: 2
    },
    usedLights : {}
    
    
  };
  
  lights.addLight = function(light){
    lights.lights.push(light);
    lights.flags.changedLights = true;
  };
  
  global.lights = lights;
  
  
}(EWGL));
(function(global){
  
  var lights = {
    lights : [],
    flags : {},
    types : []
    
  };
  
  lights.addLight = function(light){
    lights.lights.push(light);
    lights.flags.changedLights = true;
  };
  
  
  
}(EWGL));
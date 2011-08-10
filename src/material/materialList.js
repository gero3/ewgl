(function(global){
  var undef;
  var materialList = {
    
    "materials" : [],
    "baseMaterial" : undef
    
  };
  
  materialList.registerMaterial = function(material){
    if (materialList.materials.length === 0 ){
      materialList.baseMaterial = material;
    }
    if (materialList.materials.indexOf(material)){
      materialList.materials.push(material);
    };
  };
  
  
  materialList.render = function(info){
    
    update(info);
    
    var i,l = materialList.materials.length;
    global.renderer.clear();
    for(i = 0;i<l;i++){
      if (info.counter === materialList.materials[i].lastUpdate){
        materialList.materials[i].render(info);
      }
    }
  };
  
  var update = function(info){
    var lights = global.lights,AllLights,light;
    if (lights){
      AllLights =lights.lights;
      lights.usedLights = {};
      for(var j = 0;j< AllLights.length;j++){
        light = AllLights[j];
        if (light.lastUpdate === info.counter){
          lights.usedLights[light.type] = lights.usedLights[light.type] || [];
          lights.usedLights[light.type].push(light);
        };
      };
    };
    
  };
  
  
  global.materialList = materialList;
  
  
  
}(EWGL));
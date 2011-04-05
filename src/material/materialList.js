(function(global){
  var undef;
  var materialList = {
    
    "materials" : [],
    "CustomShaderScripts" : [],
    "baseMaterial" : undef
    
  };
  
  materialList.registerMaterial = function(material){
    if (materialList.materials.length === 0 ){
      materialList.baseMaterial = material;
    }; 
    materialList.materials.push(material);
  };
  
  
  materialList.render = function(info){
    var i,l = materialList.materials.length;
    global.renderer.clear();
    for(var i = 0;i<l;i++){
      if (info.counter === materialList.materials[i].lastUpdate){
        materialList.materials[i].render(info);
      };
    };
    
  };
  
  global.materialList = materialList;
  
  
  
}(EWGL));
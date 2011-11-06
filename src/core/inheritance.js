(function(global) {
  
  
  global.defineProperty = function(obj, prop, descriptor){
    var desc2 = {};
    if (!descriptor.hasOwnProperty("get") && 
        !descriptor.hasOwnProperty("set") &&
        (descriptor.writable === undefined || descriptor.writable === true) &&
        (descriptor.enumerable === undefined || descriptor.enumerable === true) &&
        (descriptor.configurable === undefined || descriptor.configurable === true)){
          
      obj[prop] = descriptor.value;
    } else {
      if (descriptor.hasOwnProperty("get") || descriptor.hasOwnProperty("set")){
        //accessor can't have writeable 
       
        desc2["get"] = descriptor["get"];
        desc2["set"] = descriptor["set"];
       
      } else {
        desc2.value = descriptor.value;
        if (descriptor.writable === undefined){
          desc2.writable = true;
        } else {
          desc2.writable = descriptor.writable;
        }
      }   
      
      if (descriptor.enumerable === undefined){
        desc2.enumerable = true;
      } else {
        desc2.enumerable = descriptor.enumerable;
      }
      
      if (descriptor.configurable === undefined){
        desc2.configurable = true;
      } else {
        desc2.configurable = descriptor.configurable;
      }
      
      Object.defineProperty(obj, prop,desc2);
    }
  };
  
  global.defineProperties = function(obj,descriptors){
    
    for (var name in descriptors){
      if (descriptors.hasOwnProperty(name)){
        
        global.defineProperty(obj,name,descriptors[name]);
        
      }
    }
    
  };
  
  global.extend = function(obj,extendables){
  
    for(var name in extendables){
      if (extendables.hasOwnProperty(name)){
        obj[name] = extendables[name];
      }
    }
  };

  global.inherit = function(superObj,childObj){
    

    var fn = function(){};
    fn.prototype = superObj.prototype;
    childObj.prototype = new fn();
    
    
    var props = Object.getOwnPropertyNames(superObj.prototype);
    var length = props.length;
    for(var i = 0;i<length;i++){
      var name = props[i];
      if (superObj.prototype.hasOwnProperty(name) && !childObj.prototype.hasOwnProperty(name)){
        global.defineProperty(childObj.prototype, name, Object.getOwnPropertyDescriptor(superObj.prototype , name));
      }
    }
    
  };
    
})(EWGL);
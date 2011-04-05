(function(global){
  var undef,counter = 0;
  
  var inputmanager = {
    "mappings" : {},
    "updateCallbacks" : []
  };
  
  inputmanager.addMapping = function(name,func){
    inputmanager.mappings[name] = inputmanager.mappings[name] || [];
    inputmanager.mappings[name].push(func);
  };   
  
  inputmanager.update = function(info){
    var i, l = inputmanager.updateCallbacks.length;
    for (i= 0;i<l;i++){
      inputmanager.updateCallbacks[i](info);
    };
  };  
  
  inputmanager.createAddHandler = function(buffer){
    return function(args){
      var func,name,i,l,keyname;
      
      if (!args.func && !args.name){
        throw "there should always be a function mapped to the key:{" + keyname + " : " + name + "};";
      };
      func = args.func;
      name = args.name || (Handler + (counter++));
      keyname = args.keyName || 0;
      
      if (func){
        inputmanager.addMapping(name,func);
      }
      
      buffer[keyname] = buffer[keyname] || [];  
      buffer[keyname].push({"name": name});
    };
  };
  
  inputmanager.activateAction = function(name,args){
    var i,l,mapped;
    if (inputmanager.mappings[name]){
      mapped = inputmanager.mappings[name];
      l = mapped.length;
      for (i=0;i<l;i++){
        mapped[i](args);
      };
    }; 
  };
    
  
  
  global.inputManager = inputmanager;
  
}(EWGL));

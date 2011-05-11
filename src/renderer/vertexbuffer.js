(function(global){
  var undef;
  
  
  var vertexbufferType ={};
  vertexbufferType.position = "position";
  vertexbufferType.color    = "color";
  vertexbufferType.texture  = "texture";
  vertexbufferType.indices  = "indices";
  

  var vertexbuffer = function(args){
    var data;
    if (!args){
      throw "Always create a vertexbuffer with at least some args";
      
    }
    this.flags = {};
    this.type = args.type;
    this.glObject = undef;
    this.size = 0;
    
    
    this.setData = function(dataObject){
      data = dataObject;
      this.flags.dataChanged = true;
    };
    
    this.getData = function(){
      return data;
    };
    
    this.setData(args.data || []);
    
  };
  
  global.vertexbuffer = vertexbuffer;
  global.vertexbufferType = vertexbufferType;
  
  
  
  
  

}(EWGL));
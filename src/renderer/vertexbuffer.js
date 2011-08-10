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
    this.listeners = [];
    
    
    this.setData = function(dataObject){
      data = dataObject;
      this.size = data.length;
      this.flags.dataChanged = true;
      if (this.listeners.length > 0){
        this.sentToListeners();
      }
    };
    
    this.getData = function(){
      return data;
    };
    
    this.setData(args.data || []);
    
  };
  
  vertexbuffer.prototype.sentToListeners = function(){
    var list = this.listeners,l = list.length;
    for (var i = 0; i<l;i++){
      list[i](this.type);
    }
  };
  
  global.vertexbuffer = vertexbuffer;
  global.vertexbufferType = vertexbufferType;
  
  
  
  
  

}(EWGL));
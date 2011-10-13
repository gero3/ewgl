(function(global){

  var undef;
  var counterId = 0;
  
  var mesh = function(){
    this.meshId = "mesh" + (counterId++);
    this.flags = {};
    this.vertexbuffers = {};
  };
  
  mesh.prototype.addNewVertexbuffer = function(args){
    if (!args){
      throw "Always create a vertexbuffer with at least some args";
    }
    args.mesh = this;
    var buffer = new vertexbuffer(args);
    this.vertexbuffers[args.type] = buffer;
    
  };  
  
  var vertexbuffer = function(args){
    var data;

    this.flags = {};
    this.type = args.type;
    this._mesh = args.mesh;
    this.glObject = undef;
    this.size = 0;
    this.listeners = [];
    
    
    this.setData = function(dataObject){
      var flagsToset = mesh.flagsToSet[this.type];
      
      data = dataObject;
      this.size = data.length;
      this.flags.dataChanged = true;

      if(flagsToset){
        for(var i = 0,l =flagsToset.length;i<l;i++){
          this._mesh.flags[flagsToset[i]] = true;
        }
      }
    };
    
    this.getData = function(){
      return data;
    };
    
    this.setData(args.data || []);
    
  };
  
    
  var vertexbufferType ={};
  vertexbufferType.position = "position";
  vertexbufferType.color    = "color";
  vertexbufferType.texture  = "texture";
  vertexbufferType.indices  = "indices";
  
  
  mesh.flagsToSet = {};
  global.mesh = mesh;
  global.vertexbufferType = vertexbufferType;
  
}(EWGL));
(function(global){

  var mesh = function(){
    this.flags = {};
    this.vertexbuffers = {};
  };
  
  mesh.prototype.addVertexbuffer = function(buffer){
    this.vertexbuffers[buffer.type] = buffer;
    if (mesh.flagsToSet[buffer.type]){
      buffer.listeners.push(this.vertexBufferChanged);
      this.vertexBufferChanged(buffer.type);
    }
  };
  mesh.prototype.vertexBufferChanged = function(type){
    var flagsToset = mesh.flagsToSet[type];
    if(flagsToset){
      for(var i = 0,l =flagsToset.length;i<l;i++){
        this.flags[flagsToset[i]] = true;
      }
    }
  };
  
  mesh.flagsToSet = {};
  global.mesh = mesh;
  
}(EWGL));
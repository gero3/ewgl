(function(global){

  var mesh = function(){
    this.flags = {};
    this.vertexbuffers = {};
  };
  
  mesh.prototype.addVertexbuffer = function(buffer){
    this.vertexbuffers[buffer.type] = buffer;
  };
  
  global.mesh = mesh;
  
}(EWGL));
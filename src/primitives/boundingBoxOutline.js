(function(global){
  var undef;
    
  var node = global.node;  
  var geometry = global.geometry;
  var vertexbuffer = global.vertexbuffer;
  
  var boundingBoxOutline = function(args){
    geometry.call(this,args);

    var data =     [-1,-1,-1,
                    -1,-1,1,
                    
                    -1,1,-1,
                    -1,1,1,
                    
                    1,-1,-1,
                    1,-1,1,
                    
                    1,1,-1,
                    1,1,1];
        
    this.mesh.addNewVertexbuffer({"type" : "position",
                                  "data" : data});
                                  
    this.mesh.addNewVertexbuffer({"type" : "indices",
                                  "data" : [  0,1,
                                              0,2,
                                              0,4,
                                              1,3,
                                              1,5,
                                              2,3,
                                              2,6,
                                              3,7,
                                              4,5,
                                              4,6,
                                              5,7,
                                              6,7]});
             
             
    this.flags.NoBoundingBox = true;     
    this.material = global.debugBoundingBoxesMaterial;
  };
  
  
  
  boundingBoxOutline.prototype = new geometry();
  boundingBoxOutline.prototype.material = global.debugBoundingBoxesMaterial;
  
  
  boundingBoxOutline.prototype.update = function(info){
    var bdata = this.parent.boundingBox;
    var data = [bdata.minX,bdata.minY,bdata.minZ,
                bdata.minX,bdata.minY,bdata.plusZ,
                
                bdata.minX,bdata.plusY,bdata.minZ,
                bdata.minX,bdata.plusY,bdata.plusZ,
                
                bdata.plusX,bdata.minY,bdata.minZ,
                bdata.plusX,bdata.minY,bdata.plusZ,
                
                bdata.plusX,bdata.plusY,bdata.minZ,
                bdata.plusX,bdata.plusY,bdata.plusZ];
    this.mesh.vertexbuffers.position.setData(data);
    this.lastUpdate = info.counter;
    this.material.lastUpdate = info.counter;
  };
  
  node.prototype.attachNewBoundingBoxOutline = function(args){ 
    var t = new boundingBoxOutline(args);
    this.addChildren(t);
    return t;
  };                                                       
  
  global.boundingBoxOutline = boundingBoxOutline;
}(EWGL));
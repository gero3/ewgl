(function(global){
  var undef;
    
  var node = global.node;  
  var geometry = global.geometry;
  var vertexbuffer = global.vertexbuffer;
  
  var Quad = function(args){
    geometry.call(this,args);
    this.mesh.addNewVertexbuffer({"type" :"position",
                                  "data" :[ 0.5,  0.5,  0.0, 
                                           -0.5, -0.5,  0.0,                                                          
                                            0.5, -0.5,  0.0,
                                           -0.5,  0.5,  0.0]
                                });
    this.mesh.addNewVertexbuffer({"type" :"color",
                                  "data" :[ 1.0,  1.0,  1.0,  1.0, 
                                            1.0,  1.0,  1.0,  1.0, 
                                            1.0,  1.0,  1.0,  1.0,
                                            1.0,  1.0,  1.0,  1.0]
                                });
    this.mesh.addNewVertexbuffer({"type" : "indices",
                                  "data" : [ 0,  2,  1,
                                             0,  1,  3]
                                }); 
    this.mesh.addNewVertexbuffer({"type" : "texture",
                                  "data" : [ 0,  0,
                                             1,  1,
                                             0,  1,
                                             1,  0]
                                });                                                        
                                                           
  };
  
  
  global.inherit(geometry,Quad);
  
  node.prototype.attachNewQuad = function(args){ 
    var t = new Quad(args);
    this.addChildren(t);
    return t;
  };                                                       
  
  global.quad = Quad;
}(EWGL));
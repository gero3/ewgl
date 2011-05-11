(function(global){
  var undef;
    
  var node = global.node;  
  var geometry = global.geometry;
  var vertexbuffer = global.vertexbuffer;
  
  var Quad = function(args){
    geometry.call(this,args);
    this.mesh.addVertexbuffer(new vertexbuffer({"type" :"position",
                                                "data" :[  1.0,  1.0,  0.0, 
                                                          -1.0, -1.0,  0.0,                                                          
                                                           1.0, -1.0,  0.0,
                                                          -1.0,  1.0,  0.0]
                                               })
                             );
    this.mesh.addVertexbuffer(new vertexbuffer({"type" :"color",
                                                "data" :[ 1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0,
                                                          1.0,  1.0,  1.0,  1.0]
                                               })
                             );
    this.mesh.addVertexbuffer(new vertexbuffer({"type" : "indices",
                                                "data" : [ 0,  1,  2,
                                                           0,  1,  3]
                                               })
                             ); 
    this.mesh.addVertexbuffer(new vertexbuffer({"type" : "texture",
                                                "data" : [ 0,  0,
                                                           1,  1,
                                                           0,  1,
                                                           1,  0]
                                               })
                             );                                                        
                                                           
  };
  
  Quad.prototype = new geometry();
  Quad.prototype.material = undef;
  
  node.prototype.attachNewQuad = function(args){ 
    var t = new Quad(args);
    this.addChildren(t);
    return t;
  };                                                       
  
  global.quad = Quad;
}(EWGL));
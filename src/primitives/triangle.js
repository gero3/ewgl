(function(global){
  var undef;
  var triangle = function(args){
    geometry.call(this,args);
    this.mesh.addVertexbuffer(new vertexbuffer({"type" :"position",
                                                "data" :[  0.0,  1.0,  0.0, 
                                                          -1.0, -1.0,  0.0,                                                          
                                                           1.0, -1.0,  0.0]
                                               })
                             );
    this.mesh.addVertexbuffer(new vertexbuffer({"type" :"color",
                                                "data" :[ 1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0]
                                               })
                             );
    this.mesh.addVertexbuffer(new vertexbuffer({"type" : "indices",
                                                "data" : [ 0,  1,  2]
                                               })
                             ); 
                                                           
  };
  
  triangle.prototype = new geometry();
  triangle.prototype.material = undef;
  node.prototype.attachNewTriangle = function(args){ 
    var t = new triangle(args);
    this.addChildren(t);
    return t;
  };                                                       
  
  global.triangle = triangle;
}(window));






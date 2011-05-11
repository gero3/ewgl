(function(global){
  var undef;
    
  var node = global.node;  
  var geometry = global.geometry;
  var vertexbuffer = global.vertexbuffer;
  
  var Cube = function(args){
    geometry.call(this,args);
    this.mesh.addVertexbuffer(new vertexbuffer({"type" :"position",
                                                "data" :[  //back side
                                                           1.0,  1.0, -1.0, 
                                                          -1.0, -1.0, -1.0,                                                          
                                                           1.0, -1.0, -1.0,
                                                          -1.0,  1.0, -1.0,
                                                          
                                                          // front side
                                                           1.0,  1.0,  1.0,
                                                          -1.0, -1.0,  1.0,                                                          
                                                           1.0, -1.0,  1.0,
                                                          -1.0,  1.0,  1.0,
                                                          
                                                          //up side
                                                           1.0,  1.0,   1.0,
                                                          -1.0,  1.0,  -1.0,                                                          
                                                           1.0,  1.0,  -1.0,
                                                          -1.0,  1.0,   1.0,
                                                          
                                                          //down side
                                                           1.0, -1.0,   1.0,
                                                          -1.0, -1.0,  -1.0,                                                          
                                                           1.0, -1.0,  -1.0,
                                                          -1.0, -1.0,   1.0,
                                                          
                                                          //right side
                                                           1.0,  1.0,   1.0,
                                                           1.0, -1.0,  -1.0,                                                          
                                                           1.0,  1.0,  -1.0,
                                                           1.0, -1.0,   1.0,
                                                          
                                                          //left side
                                                          -1.0,  1.0,   1.0,
                                                          -1.0, -1.0,  -1.0,                                                          
                                                          -1.0,  1.0,  -1.0,
                                                          -1.0, -1.0,   1.0]
                                               })
                             );
    this.mesh.addVertexbuffer(new vertexbuffer({"type" :"color",
                                                "data" :[ 1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0,
                                                          1.0,  1.0,  1.0,  1.0,
                                                          
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0,
                                                          1.0,  1.0,  1.0,  1.0,
                                                          
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0,
                                                          1.0,  1.0,  1.0,  1.0,
                                                          
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0,
                                                          1.0,  1.0,  1.0,  1.0,
                                                          
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0,
                                                          1.0,  1.0,  1.0,  1.0,
                                                          
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0,
                                                          1.0,  1.0,  1.0,  1.0]
                                               })
                             );
    this.mesh.addVertexbuffer(new vertexbuffer({"type" : "indices",
                                                "data" : [ 0, 1, 2,
                                                           0, 1, 3,
                                                           
                                                           4, 5, 6,
                                                           4, 5, 7,
                                                           
                                                           8, 9, 10,
                                                           8, 9, 11,
                                                           
                                                           12, 13, 14,
                                                           12, 13, 15,
                                                           
                                                           16, 17, 18,
                                                           16, 17, 19,
                                                           
                                                           20, 21, 22,
                                                           20, 21, 23]
                                               })
                             ); 
    this.mesh.addVertexbuffer(new vertexbuffer({"type" : "texture",
                                                "data" : [ 0,  0,
                                                           1,  1,
                                                           0,  1,
                                                           1,  0,
                                                           
                                                           0,  0,
                                                           1,  1,
                                                           0,  1,
                                                           1,  0,
                                                           
                                                           0,  0,
                                                           1,  1,
                                                           0,  1,
                                                           1,  0,
                                                           
                                                           0,  0,
                                                           1,  1,
                                                           0,  1,
                                                           1,  0,
                                                           
                                                           0,  0,
                                                           1,  1,
                                                           0,  1,
                                                           1,  0,
                                                           
                                                           0,  0,
                                                           1,  1,
                                                           0,  1,
                                                           1,  0]
                                               })
                             );                                                        
                                                           
  };
  
  Cube.prototype = new geometry();
  Cube.prototype.material = undef;
  
  node.prototype.attachNewCube = function(args){ 
    var t = new Cube(args);
    this.addChildren(t);
    return t;
  };                                                       
  
  global.cube = Cube;
}(EWGL));
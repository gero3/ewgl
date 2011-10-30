(function(global){
  var undef;
    
  var node = global.node;  
  var geometry = global.geometry;
  var vertexbuffer = global.vertexbuffer;
  
  var sphere = function(args){
    geometry.call(this,args);
    
    args = args ||{};
    var latitudeBands = args.latitudeBands || 30;
    var longitudeBands = args.longitudeBands || 30;
    var radius = args.radius || 1;
    
    var vertexPositionData = [];
    var normalData = [];
    var textureCoordData = [];
    var colors = [];
    for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
      var theta = latNumber * Math.PI / latitudeBands;
      var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);
      
      for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
        var phi = longNumber * 2 * Math.PI / longitudeBands;
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);
        
        var x = cosPhi * sinTheta;
        var y = cosTheta;
        var z = sinPhi * sinTheta;
        var u = 1 - (longNumber / longitudeBands);
        var v = 1 - (latNumber / latitudeBands);
        
        normalData.push(x);
        normalData.push(y);
        normalData.push(z);
        textureCoordData.push(u);
        textureCoordData.push(v);
        vertexPositionData.push(radius * x);
        vertexPositionData.push(radius * y);
        vertexPositionData.push(radius * z);
        colors.push(1.0);
        colors.push(1.0);
        colors.push(1.0);
        colors.push(1.0);
      }
    }
    
    var indexData = [];
    for (var latNumber=0; latNumber < latitudeBands; latNumber++) {
      for (var longNumber=0; longNumber < longitudeBands; longNumber++) {
        var first = (latNumber * (longitudeBands + 1)) + longNumber;
        var second = first + longitudeBands + 1;
        indexData.push(first);
        indexData.push(first + 1);
        indexData.push(second);

        
        indexData.push(second);
        indexData.push(first + 1);
        indexData.push(second + 1);

      }
    }
    
    
    this.mesh.addNewVertexbuffer({"type" : "position",
                                  "data" : vertexPositionData});
    /*                              
    this.mesh.addNewVertexbuffer({"type" : "normal",
                                  "data" : normalData});
     */                             
    this.mesh.addNewVertexbuffer({"type" : "color",
                                  "data" : colors});
                                  
    this.mesh.addNewVertexbuffer({"type" : "indices",
                                  "data" : indexData}); 
                                  
    this.mesh.addNewVertexbuffer({"type" : "texture",
                                  "data" : textureCoordData});                                                        
    
  };
    
  global.inherit(geometry,sphere);
  
  node.prototype.attachNewSphere = function(args){ 
    var t = new sphere(args);
    this.addChildren(t);
    return t;
  };                                                       
  
  global.sphere = sphere;
}(EWGL));
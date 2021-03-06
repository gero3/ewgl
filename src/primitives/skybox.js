(function(global){
  
  var node = global.node;
  
  var undef;
  var skybox = function skybox(args){
    //important to keep the prototypal chain clean
    node.call(this,args);
    
    this.attachNewQuad({"material":global.skyboxMaterial,"translation":[-0.5, 0, 0],"rotation":[0.7071,0,-0.7071,0],"materialOptions":{"texture":args.left}});
    this.attachNewQuad({"material":global.skyboxMaterial,"translation":[ 0.5, 0, 0],"rotation":[0.7071,0,0.7071,0],"materialOptions":{"texture":args.right}});
    this.attachNewQuad({"material":global.skyboxMaterial,"translation":[ 0, 0,-0.5],"rotation":[1,0,0,0],"materialOptions":{"texture":args.front}});
    this.attachNewQuad({"material":global.skyboxMaterial,"translation":[ 0, 0, 0.5],"rotation":[0,0,1,0],"materialOptions":{"texture":args.back}});
    this.attachNewQuad({"material":global.skyboxMaterial,"translation":[ 0, 0.5, 0],"rotation":[0,0.7071,0.7071,0],"materialOptions":{"texture":args.top}});
    this.attachNewQuad({"material":global.skyboxMaterial,"translation":[ 0,-0.5, 0],"rotation":[-0.7071,0,0,0.7071],"materialOptions":{"texture":args.bottom}});
    
    return this;
  };
  
  
  global.inherit(node,skybox);
  
  node.prototype.attachNewSkybox = function(args){
    var t = new skybox(args);
    this.addChildren(t);
    return t;
  };
  
  global.skybox = skybox;
  
}(EWGL));
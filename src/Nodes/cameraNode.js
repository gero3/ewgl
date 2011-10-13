(function(global){
  
  var node = global.node;
  
  var undef;
  var cameraNode = function cameraNode(args){
    //important to keep the prototypal chain clean
    node.call(this,args);
    
    this._perspective = mat4.create();
    this._inverseMatrix = mat4.create(); 
    return this;
  };
  
  
  
  cameraNode.prototype = new node();
  
  Object.defineProperties(cameraNode.prototype,{
    "_fovy" : {
      "value": 45,
      "configurable" : true,   
      "writable": true
    },
    "fovy" : {
      "get" : function(){
        return this._fovy;
      },
      "set" : function(value){
        this._fovy  = value;
        setperspective(this);
      }
    },
    
    "_aspect": {
      "value" : 1,
      "configurable" : true,   
      "writable": true
    },
    "aspect": {
      "get" : function(){
        return this._aspect;
      },
      "set" : function(value){
        this._aspect = value;
        setperspective(this);
      }
    },
    
    "_near": {
      "value" : 0.1,
      "configurable" : true,   
      "writable": true
    },
    "near": {
      "get" : function(){
        return this._near;
      },
      "set" : function(value){
        this._near = value;
        setperspective(this);
      }
    },
    
    "_far": {
      "value" : 10000,
      "configurable" : true,   
      "writable": true
    },
    "far": {
      "get" : function(){
        return this._far;
      },
      "set" : function(value){
        this._far = value;
        setperspective(this);
      }
    },
    
    "_perspective": {
      "value" : mat4.create(),
      "configurable" : true,   
      "writable": true
    },
    "perspective": {
      "get" : function(){
        return this._perspective;
      }
    },
    
    "_inverseMatrix": {
      "value" : mat4.create(),
      "configurable" : true,   
      "writable": true
    },
    "inverseMatrix": {
      "get" : function(){
        if (this.flags.UpdateMatrix || this.flags.MatrixUpdated){
          updateInverseMatrix(this);
        }
        return this._inverseMatrix;
      }
    }
  });
  
  var setperspective = function(cameraToSet){ 
    mat4.perspective(cameraToSet.fovy, cameraToSet.aspect, cameraToSet.near, cameraToSet.far, cameraToSet._perspective);
  };
  
  
  cameraNode.prototype.updateView = function(canvas){
    if (canvas){
      this.aspect = canvas.width/canvas.height;
    } else { 
      this.aspect = 1;
    }
  };
  
  var updateInverseMatrix = function(node1){
    mat4.inverse(node1.matrix,node1._inverseMatrix);
    node1.flags.MatrixUpdated = false;
  };
  
  global.cameraNode = cameraNode;
  
}(EWGL));
  
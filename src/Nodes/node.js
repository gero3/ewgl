(function(global){
  var counterid = 0;
  var undef,p;
  var node = function(argus){
    
    var args = argus || {};

    this.name = args.name;
    this.id = "node" + (counterid++);
    
    this.flags = {};
    this.controllers = [];
    
    this.rotation = args.rotation || quat4.create([0,0,0,1]);
    this.translation = args.translation || vec3.create();
    this.scale = args.scale || vec3.create([1,1,1]);
    
    this._worldRotation = quat4.create([0,0,0,1]);
    this._worldTranslation = vec3.create();
    this._worldScale = vec3.create([1,1,1]);
    this._matrix = mat4.create();
    
    this._boundingBox = new EWGL.boundingBox();
    
    
    this.parent = args.parent || undef;
    this.children = args.children || [];
    
    return this;
  };
  
  Object.defineProperties(node.prototype,{
    "_name": { 
      "value" : undef,
      "configurable" : true,   
      "writable": true
    },
    "name": {
      "get" : function(){
        return this._name;
      },
      "set" : function(name){
        if (name){
          if (name === this._name){
            return;
          } else if(!node.Nodes[name]){
            if (node.Nodes[this._name]){
              node.Nodes[this._name] = undef;
            }
            this._name = name;
            node.Nodes[name] = this;
          } else {
            throw "All Nodes need a different name : " + name +" is at least added twice.";
          }
        } else{
          if (node.Nodes[this._name]){
            node.Nodes[this._name] = undef;
          }
          this._name = undef;
        }
      }
    },
    
    "_id": { 
      "value" : undef,
      "configurable" : true,   
      "writable": true
    },
    "id": {
      "get" : function(){
        return this._id;
      },
      "set" : function(id){
        if (id){
          if (id === this._id){
            return;
          } else if(!node.NodesById[id]){
            if (node.NodesById[this._id]){
              node.NodesById[this._id] = undef;
            }
            this._id= id;
            node.NodesById[id] = this;
          } else {
            throw "All Nodes need a different id: " + id+" is at least added twice.";
          }
        } else {
          throw "All Nodes need at least One Id.";
        }        
      }
    },
    "_rotation": { 
      "value" : quat4.create([0,0,0,1]),
      "configurable" : true,   
      "writable": true
    },
    "rotation": {
      "get" : function(){
        return this._rotation;
      },
      "set" : function(rot){
          this._rotation = rot;
          this.setUpdateMatrixFlag();
          this.setUpdateBoundingBoxFlag();
      }
    },
    
    "_translation":{
      "value":vec3.create(),
      "configurable" : true,   
      "writable": true
    },
    "translation": {
      "get" : function(){
        return this._translation;
      },
      "set" : function(pos){
          this._translation = pos;
          this.setUpdateMatrixFlag();
          this.setUpdateBoundingBoxFlag();
      }
    },
    
    "_scale":{
      "value":vec3.create(),
      "configurable" : true,   
      "writable": true
    },
    "scale": {
      "get" : function(){
        return this._scale;
      },
      "set" : function(scale){
          if (!scale.length){
            scale = [scale,scale,scale];
          }
          this._scale= scale;
          this.setUpdateMatrixFlag();
          this.setUpdateBoundingBoxFlag();
      }
    },
    
    "flags":{
      "value":{},
      "configurable" : true,   
      "writable": true
    },
    
    "_children" : {
      "value" :[],
      "configurable" : true,   
      "writable": true
    },
    "children" : {
      "get" : function(){
        return this._children;
      },
      "set" : function(children){
        if (this._children !== children){ 
          removeAllChildren(this);
          addChildren(this,children);
        };
      }
    },
    
    "_parent" : {
      "value" : undef,
      "configurable" : true,   
      "writable": true
    },
    "parent" : {
      "get" : function(){
        return this._parent;
      },
      "set" : function(parent){
        if (parent !==this._parent){
          setParent(this,parent);
          this.setUpdateMatrixFlag();
        };
      }
    },
    
    "_matrix" : {
      "value" : undef,
      "configurable" : true,   
      "writable": true
    },
    "matrix" : {
      "get" : function(){
        if (this.flags.UpdateMatrix){
          calculateUpdateMatrix(this);
        };
        return this._matrix;
      }
    },
    
    "_worldScale" : {
      "value" : undef,
      "configurable" : true,   
      "writable": true
    },
    "worldScale" : {
      "get" : function(){
        if (this.flags.UpdateMatrix){
          calculateUpdateMatrix(this);
        };
        return this._worldScale;
      }
    },
    
    "_worldTranslation" : {
      "value" : undef,
      "configurable" : true,   
      "writable": true
    },
    "worldTranslation" : {
      "get" : function(){
        if (this.flags.UpdateMatrix){
          calculateUpdateMatrix(this);
        };
        return this._worldTranslation;
      }
    },
    
    "_worldRotation" : {
      "value" : undef,
      "configurable" : true,   
      "writable": true
    },
    "worldRotation" : {
      "get" : function(){
        if (this.flags.UpdateMatrix){
          calculateUpdateMatrix(this);
        };
        return this._worldRotation;
      }
    },
    
    "_boundingBox" : {
      "value" : undef,
      "configurable" : true,   
      "writable": true
    },
    "boundingBox" : {
      "get" : function(){
        if (this.flags.UpdateBoundingBox){
          calculateUpdateBoundingBox(this);
        };
        return this._boundingBox;
      }
    },
    
    
    "controllers" : {
      "value":[],
      "configurable" : true,   
      "writable": true
    },
    "lastUpdate" : {
      "value": -1,
      "configurable" : true,   
      "writable": true
    }
    
  });
  
  
  
  node.prototype.update = function(info){
    this.lastUpdate = info.counter;
    
    var i,l = this.controllers.length;

    for(i = 0;i<l;i++){
      this.controllers[i].update(info);
    }  
    l = this.children.length;
    for(i = 0;i<l;i++){
      this.children[i].update(info);
    }
  };
  
  node.prototype.render = function(info){
    var i,l = this.children.length;
    for(i = 0;i<l;i++){
      this.children[i].render(info);
    } 
  };
  
  node.prototype.setUpdateMatrixFlag = function(){
    setUpdateMatrixFlag(this);
  };
  
  node.prototype.setUpdateBoundingBoxFlag = function(){
    setUpdateBoundingBoxFlag(this);
  };
  
  node.prototype.removeAllChildren = function(){
    removeAllChildren(this);
  };
  
  node.prototype.addChildren = function(children){
    addChildren(this,children);
  };
  node.prototype.addController = function(controller){
    controller.node = this;
    this.controllers.push(controller);
  };
  
  node.prototype.addChild = function(children){
    addChildren(this,children);
  };
  
  node.prototype.removeParent = function(){
    removeParent(this);
  };
  node.prototype.setParent = function(parent){
    setParent(this,parent);
  };
  
  node.prototype._calculateUpdateMatrix = function(){
    calculateUpdateMatrix(this);
  };
  
  
  var setUpdateBoundingBoxFlag = function(node1){
    if (!node1.flags.UpdateBoundingBox){
      node1.flags.UpdateBoundingBox = true;
      if (node1.parent){
        node1.parent.setUpdateBoundingBoxFlag();
      }
    }
  };
  
  var setUpdateMatrixFlag = function(node1){
    var i,l,c;
    if (!node1.flags.UpdateMatrix){
      node1.flags.UpdateMatrix = true;
      c = node1.children;
      l = c.length;
      for(i = 0;i <l;i++){
        c[i].setUpdateMatrixFlag();
      }
    }
  };
  
  var removeAllChildren = function(node1){
    var c = node1._children,l,i;
    if (c != undef && c.length > 0){
      l = c.length;
      for(i = 0;i <l;i++){
        c[i]._parent = undef;
      }
    }
    node1._children = [];
  };
  
  var addChildren = function(node1,children){
    var c,l,i,children2;
    if (children){
      l = children.length;
      if (!l){
        children2 = [children];
        l = 1;
      } else {
        children2 = children;
      }
      for (i = 0;i<l;i++){
        children2[i].parent = node1;
      }
    }
  };
  
  var removeParent = function(node1){
    var i = node1.parent.children.indexOf(node1);
    if (i !== -1) {
      node1.parent.children.splice(i,1);
      node1.parent = undef;
    }
  };
  
  var setParent = function(node1,parent){
    if (node1.parent !==  undef){
      node1.removeParent();
    };
    node1._parent = parent;
    
    if (parent !== undef) {
      node1._parent._children.push(node1);
    };
  };

  
  var calculateUpdateBoundingBox = function(node1){
    var children = node1.children,
        l = children.length,i,
        b = node1._boundingBox,bc;
        
    if (node1.flags.UpdateBoundingBox){
      b.minX  = Number.POSITIVE_INFINITY; b.plusX = Number.NEGATIVE_INFINITY;
      b.minY  = Number.POSITIVE_INFINITY; b.plusY = Number.NEGATIVE_INFINITY;
      b.minZ  = Number.POSITIVE_INFINITY; b.plusZ = Number.NEGATIVE_INFINITY;
      
      for (i = 0; i<l; i++){
        bc = children[i].boundingBox;
        if (bc.minX  !== Number.POSITIVE_INFINITY || bc.plusX !== Number.NEGATIVE_INFINITY ||
            bc.minY  !== Number.POSITIVE_INFINITY || bc.plusY !== Number.NEGATIVE_INFINITY ||
            bc.minZ  !== Number.POSITIVE_INFINITY || bc.plusZ !== Number.NEGATIVE_INFINITY) {
            
            if (bc.minX < b.minX){
              b.minX = bc.minX;
            }
            
            if (bc.plusX > b.plusX){
              b.plusX = bc.plusX;
            }
            
            if (bc.minY < b.minY){
              b.minY = bc.minY;
            }
            
            if (bc.plusY > b.plusY){
              b.plusY = bc.plusY;
            }
            
            if (bc.minZ < b.minZ){
              b.minZ = bc.minZ;
            }
            
            if (bc.plusZ > b.plusZ){
              b.plusZ = bc.plusZ;
            }
              
        };
      };
    };
    
  };
  
  var calculateUpdateMatrix = function(node1){
    var parent = node1.parent;
    if(node1.flags.UpdateMatrix){
      if (parent){
        vec3.scaleVec3(node1.scale,parent.worldScale,node1._worldScale);
        quat4.multiply(parent.worldRotation,node1.rotation,node1._worldRotation);
        quat4.multiplyVec3(parent.worldRotation,node1.translation ,node1._worldTranslation);
        vec3.scaleVec3(node1._worldTranslation,parent.worldScale);
        vec3.add(node1._worldTranslation,parent.worldTranslation);
      } else {
        node1._worldRotation = node1._rotation;
        node1._worldTranslation = node1._translation;
        node1._worldScale = node1._scale;
      }; 
      mat4.identity(node1._matrix);
      mat4.scale(node1._matrix,node1._worldScale);
      mat4.multiply(node1._matrix,quat4.toMat4(node1._worldRotation));
      mat4.setTranslation(node1._matrix,node1._worldTranslation);
      node1.flags.UpdateMatrix = false;
    };
  };
  
  nexboundingboxCounter = 0;
  node.prototype.showBounds = function(){
    if (EWGL.DEBUG){
      if (!this.flags.hasBoundingBoxOutline){
        for(var i = 0;i<this.children.length;i++){
          this.children[i].showBounds();
        };
        this.flags.hasBoundingBoxOutline = true;
        this.attachNewBoundingBoxOutline();
      }
    };
  };
  
  
  
  node.$ = function(name){
    return node.Nodes[name];
  };
    
  node.getById = function(ID){
    return node.NodesById[ID];
  };
  
  node.prototype.attachNewNode = function(args){
    args = args || {};
    args.parent = this;
    return new node(args);
  };
      
  node.Nodes = {};
  node.NodesById = {};
  
  
  global.node = node;
}(EWGL));


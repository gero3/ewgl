(function(global){
  
  var list = EWGL.list;
  
  var counterid = 0;
  var undef,p;
  
  var node = function(argus){
    
    var args = argus || {};
    var self = this;
    this.name = args.name;
    this.id = "node" + (counterid++);
    
    this.flags = {};
    this.controllers = new list(args.controllers,
                                function(item){
                                  item.node = self;
                                  self.flags.hasControllers = true;
                                },
                                function(item){
                                  item.node = undef;
                                  if (children.length === 0){
                                    self.flags.hasControllers = false;
                                  }
                                });
    
    this._rotation = quat4.create();
    this._translation = vec3.create();
    this._scale = vec3.create();
    
    this.rotation = args.rotation || quat4.create([0,0,0,1]);
    this.translation = args.translation || vec3.create();
    this.scale = args.scale || vec3.create([1,1,1]);
    
    this._worldRotation = quat4.create([0,0,0,1]);
    this._worldTranslation = vec3.create([0,0,0]);
    this._worldScale = vec3.create([1,1,1]);
    this._matrix = mat4.create();
    
    this._worldInfo = {
      "worldScale" : this._worldScale,
      "worldTranslation" : this._worldTranslation,
      "worldRotation" : this._worldRotation,
      "matrix" : this._matrix
    };
    
    this._boundingBox = new EWGL.boundingBox();
    
    
    
    this.parent = args.parent || undef;
    this.children = new list( args.children,
                              function(item){
                                item._parent = self; 
                                self.flags.hasChildren = true;
                              },
                              function(item){
                                item._parent = undef;
                                if (children.length ===0){
                                  self.flags.hasChildren = false;
                                }
                              });
          
    
    return this;
  };
  
  global.defineProperties(node.prototype,{
    "_name": { 
      "value" : undef,
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
      "value" : undef
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
      "value" : quat4.create([0,0,0,1])
    },
    "rotation": {
      "get" : function(){
        return this._rotation;
      },
      "set" : function(rot){
          quat4.set(rot,this._rotation) ;
          this.setUpdateMatrixFlag();
          this.setUpdateBoundingBoxFlag();
      }
    },

    "_translation":{
      "value":vec3.create()
    },
    "translation": {
      "get" : function(){
        return this._translation;
      },
      "set" : function(pos){
          vec3.set(pos,this._translation);
          this.setUpdateMatrixFlag();
          this.setUpdateBoundingBoxFlag();
      }
    },
    
    "_scale":{
      "value":vec3.create()
    },
    "scale": {
      "get" : function(){
        return this._scale;
      },
      "set" : function(scale){
          if (!scale.length){
            scale = [scale,scale,scale];
          }
          vec3.set(scale,this._scale);
          this.setUpdateMatrixFlag();
          this.setUpdateBoundingBoxFlag();
      }
    },
    
    "flags":{
      "value":{}
    },
    
    "children" : {
      "value" :new list(),
      "configurable" : true,   
      "writable": true
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
        }
      }
    },
    
    "_matrix" : {
      "value" : undef
    },
    "matrix" : {
      "get" : function(){
        if (this.flags.UpdateMatrix){
          calculateUpdateMatrix(this);
        }
        return this._matrix;
      }
    },
    
    "_worldScale" : {
      "value" : undef
    },
    "worldScale" : {
      "get" : function(){
        if (this.flags.UpdateMatrix){
          calculateUpdateMatrix(this);
        }
        return this._worldScale;
      }
    },
    
    "_worldTranslation" : {
      "value" : undef
    },
    "worldTranslation" : {
      "get" : function(){
        if (this.flags.UpdateMatrix){
          calculateUpdateMatrix(this);
        }
        return this._worldTranslation;
      }
    },
    
    "_worldRotation" : {
      "value" : undef
    },
    "worldRotation" : {
      "get" : function(){
        if (this.flags.UpdateMatrix){
          calculateUpdateMatrix(this);
        }
        return this._worldRotation;
      }
    },
    
    "_worldInfo" : {
      "value" : undef
    },
    "worldInfo" : {
      "get" : function(){
        if (this.flags.UpdateMatrix){
          calculateUpdateMatrix(this);
        }
        return this._worldInfo;
      }
    },
    
    "_boundingBox" : {
      "value" : undef
    },
    "boundingBox" : {
      "get" : function(){
        if (this.flags.UpdateBoundingBox){
          calculateUpdateBoundingBox(this);
        }
        return this._boundingBox;
      }
    },
    
    
    "_controllers" : {
      "value":new list()
    },
    
    
    "lastUpdate" : {
      "value": -1
    }
    
  });
  
  
  
  node.prototype.update = function(info){
    this.lastUpdate = info.counter;
    var i,l = this.controllers.length;

    for(i = 0;i<l;i++){
      this.controllers[i].update(info);
    }  
    var i2,children = this.children,l2 = children.length;
        
    for(i2 = 0;i2<l2;i2++){
      children[i2].update(info);
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
    this.controllers.add(controller);
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
    var i,l,c,flags = node1.flags;
    if (!node1.flags.UpdateMatrix){
      flags.UpdateMatrix = true;
      if (flags.hasChildren){
        c = node1.children;
        l = c.length;
        for(i = 0;i <l;i++){
          c[i].setUpdateMatrixFlag();
        }
      }
    }
  };
  
  var addChildren = function(node1,children){
    var c,l,i,children2;
    if (children){
      l = children.length;
      if (!l){
        node1.children.add(children);
      } else {
        node1.children.addRange(children);
      }
    }
  };
  
  var removeParent = function(node1){
    if (node1.parent !==  undef){ 
      node1.parent.children.remove(node1);
    }
  };
  
  var setParent = function(node1,parent){
    if (node1.parent !==  undef){
      node1.removeParent();
    }
    
    if (parent !== undef) {
      parent.children.add(node1);
    }
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
              
        }
      }
    }
    
  };
  
  var destMatrix = mat4.create();
  var calculateUpdateMatrix = function(node1){
    
    var parent = node1._parent;
    
    var node1Scale = node1._scale;
    var node1Rotation =node1._rotation;
    var node1Translation = node1._translation;
    
    
    var matrix = node1._matrix;
    var node1WorldScale = node1._worldScale;
    var node1WorldRotation = node1._worldRotation;
    var node1WorldTranslation = node1._worldTranslation;
    
    if(node1.flags.UpdateMatrix){
      if (parent){
        var worldInfo = parent.worldInfo;
        var parentWorldScale = worldInfo.worldScale;
        var parentWorldRotation = worldInfo.worldRotation;
        var parentWorldTranslation = worldInfo.worldTranslation;
        
        
        vec3.scaleVec3(node1Scale,parentWorldScale,node1WorldScale);
        quat4.multiply(parentWorldRotation,node1Rotation,node1WorldRotation);
        quat4.multiplyVec3(parentWorldRotation,node1Translation ,node1WorldTranslation);
        vec3.scaleVec3(node1WorldTranslation,parentWorldScale);
        vec3.add(node1WorldTranslation,parentWorldTranslation);
        
      } else {
        vec3.set(node1Scale,node1WorldScale);
        quat4.set(node1Rotation,node1WorldRotation);
        vec3.set(node1Translation,node1WorldTranslation);
      }
      
      mat4.compose(node1WorldTranslation,node1WorldRotation,node1WorldScale,matrix);
      
      node1.flags.UpdateMatrix = false;
      node1.flags.MatrixUpdated = true;
    }
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

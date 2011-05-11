(function(global){
  var undef;
  var node = global.node;
  
  var geometry = function geometry(args){
    //important to keep the prototypal chain clean
    if (args === undef){
      args = {};
    };
    node.call(this,args);
    
    this.mesh = args.mesh || new global.mesh();
    this.material = args.material || global.materialList.baseMaterial;
    this.materialOptions =  args.materialOptions || {};
    
    return this;
  };
  
  geometry.prototype = new node();
  
  Object.defineProperties(geometry.prototype,{
    "_mesh":{
      "value":undef,
      "configurable" : true,   
      "writable": true
    },
    "mesh": {
      "get" : function(){
        return this._mesh;
      },
      "set" : function(mesh){
        if (mesh !== this._mesh){
          this._mesh= mesh;
          this._mesh.flags.changedMesh = true;
        }
      }
    }, 
    "_material":{
      "value":undef,
      "configurable" : true,   
      "writable": true
    },
    "material": {
      "get" : function(){
        return this._material;
      },
      "set" : function(material){
        if (this._material && this._material.geometries.indexOf(this) > -1){
          this._material.geometries.splice(this._material.geometries.indexOf(this),1);
        }
        if (material){ 
          this._material= material;
          material.geometries.push(this);
          this.flags.changedMaterial = true;
        }
      }
    }
  });
  geometry.prototype.SetColor = function(color){
    if (!this.mesh.vertexbuffers.position){
      return;
    }
    var data = this.mesh.vertexbuffers.position.getData();
    
    
  };
  
  geometry.prototype.update = function(info){
    node.prototype.update.call(this,info);
    this.material.lastUpdate = info.counter;
  };
  
  geometry.create = function(args){
    return new geometry(args);
  };
  
  global.node.prototype.attachNewGeometry = function(args){
    args = args || {};
    args.parent = this;
    return new geometry(args);
  };
  
  global.geometry = geometry;
  
  
  
  
}(EWGL));

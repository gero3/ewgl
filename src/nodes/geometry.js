(function(global){
  var undef;
  var node = global.node;
  
  var POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
  var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
  
  var geometry = function geometry(args){
    //important to keep the prototypal chain clean
    if (args === undef){
      args = {};
    }
    node.call(this,args);
    
    this.mesh = args.mesh || new global.mesh();
    this.material = args.material || global.materialList.baseMaterial;
    this.materialOptions =  args.materialOptions || {};
    
    return this;
  };
  
  global.inherit(node,geometry);
  
  global.defineProperties(geometry.prototype,{
    "_mesh":{
      "value":undef,
    },
    "mesh": {
      "get" : function(){
        return this._mesh;
      },
      "set" : function(mesh){
        if (mesh !== this._mesh){
          var id;
          if (this._material && this._mesh){
            id = this._material.meshes[this._mesh.meshId];      
            this._material.geometries[id].splice(this._material.geometries[id].indexOf(this),1);
          }
          this._mesh= mesh;
          this._mesh.flags.changedMesh = true;
          if (this._material &&  this._mesh){ 
             id = this._material.meshes[this._mesh.meshId];
            if (id === undef){
              this._material.meshes[this._mesh.meshId] = this._material.geometries.length;
              id = this._material.geometries.length;
              this._material.geometries[id] = [];
            }
            this._material.geometries[id].push(this);
          }
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
        var id;
        if (this._material && this._mesh){
          id = this._material.meshes[this._mesh.meshId];      
          this._material.geometries[id].splice(this._material.geometries[id].indexOf(this),1);
        }
       
          this._material= material;
          this.flags.changedMaterial = true;
        if (material){   
          if( this._mesh){
            id = this._material.meshes[this._mesh.meshId];
            if (id === undef){
              this._material.meshes[this._mesh.meshId] = this._material.geometries.length;
              id = this._material.geometries.length;
              this._material.geometries[id] = [];
            }
            this._material.geometries[id].push(this);
          }
        }
      }
    },
    "_boundingBox" : {
      "value" : undef,
      "configurable" : true,   
      "writable": true
    },
    "boundingBox" : {
      "get" : function(){
        if (!this.flags.staticBoundingBox && this.flags.UpdateBoundingBox){
          calculateUpdateBoundingBox(this);
        }
        return this._boundingBox;
      }
    }
  }); 
  
  var calculateUpdateBoundingBox = function(geom1){
    var mesh = geom1.mesh,x,y,z;
    if (! geom1.flags.NoBoundingBox){
      if (mesh.flags.boundingBoxChanged){
        if (!mesh.boundingBox){
          mesh.boundingBox = new global.boundingBox();
        }
        mesh.boundingBox.getBoundingFromPoints( mesh.vertexbuffers.position.getData() );
        mesh.flags.boundingBoxChanged = false;        
      }
      var matrix = geom1.matrix;
      var mb = mesh.boundingBox;
      var b = geom1._boundingBox;
      
      mb.toAABB(matrix,b);
    }
  };
  
  
  geometry.prototype.setColor = function(color){
    var buffers = this.mesh.vertexbuffers;
    if (!buffers.position){
      return;
    }
    var size = buffers.position.size/3;
    var data = [];
    while(size > 0){
      
      data.push(color[0]);
      data.push(color[1]);
      data.push(color[2]);
      data.push(1);
      
      size--;
    }
    if (buffers.color){
      buffers.color.setData(data);
    } else { 
      this.mesh.addNewVertexbuffer({"type" :"color","data":data});
    }
  };
  
  geometry.prototype.setTexture = function(texture){
    this.materialOptions.texture = texture;
  };
  
  geometry.create = function(args){
    return new geometry(args);
  };
  
  var nodeUpdate = node.prototype.update;
  geometry.prototype.update = function(info){
      nodeUpdate.call(this,info);
      this.material.lastUpdate = info.counter;
  };
  
  global.node.prototype.attachNewGeometry = function(args){
    args = args || {};
    args.parent = this;
    return new geometry(args);
  };
  
  global.mesh.addFlagsToSet("position","boundingBoxChanged");
  global.mesh.addFlagsToSet("position","boundingSphereChanged");
  
  global.geometry = geometry;
  
  
  
  
}(EWGL));

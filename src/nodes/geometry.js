(function(global){
  var undef;
  var node = global.node;
  
  var POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
  var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
  
  var vecs = vec3.createFixedPool(8);
  
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
      /*
      mat4.multiplyVec3(matrix,[mb.minX,mb.minY,mb.minZ],vecs[0]);
      mat4.multiplyVec3(matrix,[mb.minX,mb.minY,mb.plusZ],vecs[1]);
      
      mat4.multiplyVec3(matrix,[mb.minX,mb.plusY,mb.minZ],vecs[2]);
      mat4.multiplyVec3(matrix,[mb.minX,mb.plusY,mb.plusZ],vecs[3]);
      
      mat4.multiplyVec3(matrix,[mb.plusX,mb.minY,mb.minZ],vecs[4]);
      mat4.multiplyVec3(matrix,[mb.plusX,mb.minY,mb.plusZ],vecs[5]);
      
      mat4.multiplyVec3(matrix,[mb.plusX,mb.plusY,mb.minZ],vecs[6]);
      mat4.multiplyVec3(matrix,[mb.plusX,mb.plusY,mb.plusZ],vecs[7]);
      

      
      b.minX  = POSITIVE_INFINITY;
      b.plusX = NEGATIVE_INFINITY;
      
      b.minY  = POSITIVE_INFINITY;
      b.plusY = NEGATIVE_INFINITY;
      
      b.minZ  = POSITIVE_INFINITY;
      b.plusZ = NEGATIVE_INFINITY;
      
      for (var i= 0,l= vecs.length;i<l;i++){
        var vec =  vecs[i];
        x = vec[0];
        y = vec[1];
        z = vec[2];
        
        if (x < b.minX){
          b.minX = x;
        } else if (x > b.plusX){
          b.plusX = x;
        }
        
        if (y < b.minY){
          b.minY = y;
        } else if (y > b.plusY){
          b.plusY = y;
        }
        
        if (z < b.minZ){
          b.minZ = z;
        } else if (z > b.plusZ){
          b.plusZ = z;
        }
      }  */
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

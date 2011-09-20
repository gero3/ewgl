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
    
    if (mesh.flags.boundingBoxChanged){
      if (!mesh.boundingBox){
        mesh.boundingBox = new global.boundingBox();
      }
      mesh.boundingBox.getBoundingFromPoints(mesh.vertexbuffers.position.getData());
      mesh.flags.boundingBoxChanged = false;        
    }
    if (! geom1.flags.NoBoundingBox){
      var matrix = geom1.matrix;
      var mb = mesh.boundingBox;
      
      mat4.multiplyVec3(matrix,[mb.minX,mb.minY,mb.minZ],vecs[0]);
      mat4.multiplyVec3(matrix,[mb.minX,mb.minY,mb.plusZ],vecs[1]);
      
      mat4.multiplyVec3(matrix,[mb.minX,mb.plusY,mb.minZ],vecs[2]);
      mat4.multiplyVec3(matrix,[mb.minX,mb.plusY,mb.plusZ],vecs[3]);
      
      mat4.multiplyVec3(matrix,[mb.plusX,mb.minY,mb.minZ],vecs[4]);
      mat4.multiplyVec3(matrix,[mb.plusX,mb.minY,mb.plusZ],vecs[5]);
      
      mat4.multiplyVec3(matrix,[mb.plusX,mb.plusY,mb.minZ],vecs[6]);
      mat4.multiplyVec3(matrix,[mb.plusX,mb.plusY,mb.plusZ],vecs[7]);
      
      var b = geom1._boundingBox;
      
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
      }   
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
    buffers.color.setData(data);    
  };
  
  geometry.prototype.setTexture = function(texture){
    this.materialOptions.texture = texture;
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
  
  global.mesh.flagsToSet.position = ["boundingBoxChanged"];
  
  global.geometry = geometry;
  
  
  
  
}(EWGL));

(function(global){
  var undef;
  var node = global.node;
  
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
    var matrix = geom1.matrix;
    var mb = mesh.boundingBox;
    var vecs = [];
    
    vecs.push(mat4.multiplyVec3(matrix,[mb.minX,mb.minY,mb.minZ]));
    vecs.push(mat4.multiplyVec3(matrix,[mb.minX,mb.minY,mb.plusZ]));
    
    vecs.push(mat4.multiplyVec3(matrix,[mb.minX,mb.plusY,mb.minZ]));
    vecs.push(mat4.multiplyVec3(matrix,[mb.minX,mb.plusY,mb.plusZ]));
    
    vecs.push(mat4.multiplyVec3(matrix,[mb.plusX,mb.minY,mb.minZ]));
    vecs.push(mat4.multiplyVec3(matrix,[mb.plusX,mb.minY,mb.plusZ]));
    
    vecs.push(mat4.multiplyVec3(matrix,[mb.plusX,mb.plusY,mb.minZ]));
    vecs.push(mat4.multiplyVec3(matrix,[mb.plusX,mb.plusY,mb.plusZ]));
    
    var b = geom1._boundingBox;
    for (var i= 0,l= vecs.length;i<l;i++){
      x = vecs[i][0];
      y = vecs[i][1];
      z = vecs[i][2];
      
      if (x < b.minX){
        b.minX = x;
      }
      
      if (x > b.plusX){
        b.plusX = x;
      }
      
      if (y < b.minY){
        b.minY = y;
      }
      
      if (y > b.plusY){
        b.plusY = y;
      }
      
      if (z < b.minZ){
        b.minZ = z;
      }
      
      if (z > b.plusZ){
        b.plusZ = z;
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

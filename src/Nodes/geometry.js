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
          if (this._material){
            this._material.removeGeometry(this);
          }
          
          this._mesh= mesh;
          this._mesh.flags.changedMesh = true;
          
           if (this._material){   
            this._material.addGeometry(this);
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
        if (this._material != material){
          if (this._material){
            this._material.removeGeometry(this);
          }
          
          this._material= material;
          this.flags.changedMaterial = true;
        
          if (this._material){   
            this._material.addGeometry(this);
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
        if (!this.flags.staticBoundingBox && this.flags.UpdateBoundingBox && ! this.flags.NoBoundingBox){
          calculateUpdateBoundingBox(this);
        }
        return this._boundingBox;
      }
    }
  }); 
  
  var calculateUpdateBoundingBox = function(geom1){
    var mesh = geom1._mesh;
    if (mesh.flags.boundingBoxChanged){
      if (!mesh.boundingBox){
        mesh.boundingBox = new global.boundingBox();
      }
      mesh.boundingBox.getBoundingFromPoints( mesh.vertexbuffers.position.getData() );
      mesh.flags.boundingBoxChanged = false;        
    }
    
    mesh.boundingBox.toAABB(geom1.matrix,geom1._boundingBox);
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
  
  global.mesh.flagsToSet.position = ["boundingBoxChanged"];
  
  global.geometry = geometry;
  
  
  
  
}(EWGL));

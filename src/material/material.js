(function(global){
  var undef;
  
  var emptyTexture;
  
  var materialList = global.materialList;
  var lights = global.lights;
  
  
  var material = function(args){
    
    if (!args) {
      args = {};
    }
    
    //materialList.registerMaterial(this);
    
    this.meshes = {}; 
    this.geometries = [];
    this.zOrdered = false;
    this.shaderProgram = args.shaderProgram || undef;
    this.lastUpdate = -1;
    
    Object.defineProperties(this,{
      "renderer":{
        "get":function(){
          return global.renderer;
        }
      }
    });
    
    
  };
  
  var p = material.prototype;
  
  p.update = function(){};
  
  p.render = function(){};
  
  /*********************************************************************/
  /*                                                                   */
  /*                       Helper Functions                            */
  /*                                                                   */
  /*********************************************************************/

  p.calculateNormals =function(mesh){
    var vertexbuffers = mesh.vertexbuffers;
    
    var positions = vertexbuffers.position.getData();
    var indices = vertexbuffers.indices.getData();
    
    var normal = new Float32Array(positions.length);
    
    var i,l =indices.length;
    var pointindex1,pointindex2,pointindex3;
    var point1 = vec3.create(),
        point2 = vec3.create(),
        point3 = vec3.create(),
        subtract1 = vec3.create(),
        subtract2 = vec3.create(),
        cross = vec3.create(),
        normalVec = vec3.create();
    
    for(i = 0;i<l;i+= 3){
      
      pointindex1 = indices[i] * 3;
      pointindex2 = indices[i + 1] * 3;
      pointindex3 = indices[i + 2] * 3;
      
      vec3.set([positions[pointindex1],positions[pointindex1 + 1],positions[pointindex1 + 2]],point1);
      vec3.set([positions[pointindex2],positions[pointindex2 + 1],positions[pointindex2 + 2]],point2);
      vec3.set([positions[pointindex3],positions[pointindex3 + 1],positions[pointindex3 + 2]],point3);
      
      
      vec3.subtract(point3,point2,subtract1);
      vec3.subtract(point1,point2,subtract2);
      
      vec3.cross(subtract1,subtract2,cross);
      
      vec3.normalize(cross);
      
      normal[pointindex1] += cross[0];
      normal[pointindex2] += cross[0];
      normal[pointindex3] += cross[0];
      
      normal[pointindex1 + 1] += cross[1];
      normal[pointindex2 + 1] += cross[1];
      normal[pointindex3 + 1] += cross[1];
            
      normal[pointindex1 + 2] += cross[2];
      normal[pointindex2 + 2] += cross[2];
      normal[pointindex3 + 2] += cross[2];
      
    }
      
      
    for(i = 0,l = normal.length;i<l;i+= 3){
      
      vec3.set([normal[i],normal[i + 1],normal[i + 2]],normalVec);  
      
      vec3.normalize(normalVec);
      
      normal[i] = normalVec[0];
      normal[i + 1] = normalVec[1];
      normal[i + 2] = normalVec[2];
      
    }
    
    mesh.addNewVertexbuffer({"type" :"normal",
                            "data" :normal});
  };
  
  var FrustrumUpdated,
      _frustum = [quat4.create(),quat4.create(),quat4.create(),quat4.create(),quat4.create(),quat4.create()],
      m = mat4.create(); 
  p.isInFrustrum = function(info,boundingbox,cameraPerspective,cameraMatrix) {
      var i, plane,l;
    if (info.count === FrustrumUpdated){
      FrustrumUpdated = info.count;
      mat4.multiply(cameraPerspective,cameraMatrix,m);
      
      quat4.set( [ m[12] - m[0], m[13] - m[1], m[14] - m[2], m[15] - m[3] ] , _frustum[ 0 ]);
		  quat4.set( [ m[12] + m[0], m[13] + m[1], m[14] + m[2], m[15] + m[3] ] , _frustum[ 1 ]);
		  quat4.set( [ m[12] + m[4], m[13] + m[5], m[14] + m[6], m[15] + m[7] ] , _frustum[ 2 ]);
		  quat4.set( [ m[12] - m[4], m[13] - m[5], m[14] - m[6], m[15] - m[7] ] , _frustum[ 3 ]);
		  quat4.set( [ m[12] - m[8], m[13] - m[9], m[14] - m[10], m[15] - m[11] ] , _frustum[ 4 ]);
		  quat4.set( [ m[12] + m[8], m[13] + m[9], m[14] + m[10], m[15] + m[11] ] , _frustum[ 5 ]);
      
    

		  for ( i = 0; i < 6; i ++ ) {

			  plane = _frustum[ i ];
        l = Math.sqrt( plane[0] * plane[0] + plane[1] * plane[1] + plane[2] * plane[2] );
			  quat4.set([plane[0]/l,plane[1]/l,plane[2]/l,plane[3]/l],plane);

		  }
    }
    
    var radius;
    for(i=0; i < 6; i++) {
      radius = - Math.max( boundingbox.plusX -boundingbox.minX/2 , Math.max( boundingbox.plusY -boundingbox.minY/2, boundingbox.plusZ -boundingbox.minZ/2 ))

    }

    return true;
  };

 global.material = material;

}(EWGL));
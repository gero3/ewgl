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
  
  p.isInFrustrum = function(geom,mesh,camera) {
    if (mesh.flags.boundingSphereChanged){
      if (!mesh.boundingSphere){
        mesh.boundingSphere = new global.boundingSphere();
      }
      mesh.boundingSphere.getBoundingFromPoints( mesh.vertexbuffers.position.getData() );
      mesh.flags.boundingSphereChanged = false;       
    };
    
    return camera.frustrum.isInFrustrum(geom.worldTranslation,geom.worldScale,mesh.boundingSphere);
  };

 global.material = material;

}(EWGL));
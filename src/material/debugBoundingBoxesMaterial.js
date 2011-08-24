(function(global){
    
  materialList = global.materialList;
 
  var debugBoundingBoxesMaterial = {
    "geometries" : [],
    "zOrdered": false,
    "lastUpdate": -1
  };
  Object.defineProperties(debugBoundingBoxesMaterial,{
    "renderer":{
      "get":function(){
        return global.renderer;
      }
    }
  });
  
  
  debugBoundingBoxesMaterial.update = function(){};
  
  debugBoundingBoxesMaterial.render = function(info){
    
    var i,l = debugBoundingBoxesMaterial.geometries.length,
        gl = debugBoundingBoxesMaterial.renderer.gl,
        r = debugBoundingBoxesMaterial.renderer,
        c = r.camera,
        shaderProgram,
        geom,mesh;
    
    //setshader
    if (! debugBoundingBoxesMaterial.shaderProgram){
      createShaderProgram();
    }
    shaderProgram =  debugBoundingBoxesMaterial.shaderProgram;
    r.useProgram(shaderProgram);
    //setcameraMatrix
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, c.perspective);
    gl.uniformMatrix4fv(shaderProgram.cMatrixUniform, false, c.inverseMatrix);
    
    //render Geometries
    for(i=0;i<l;i++){
      geom = debugBoundingBoxesMaterial.geometries[i];
      if(geom.lastUpdate === info.counter){
        mesh = geom.mesh;
        
        //draw
        if (mesh.vertexbuffers.position.flags.dataChanged){
          r.AdjustGLBuffer(mesh.vertexbuffers.position);
        };
        
        if (mesh.vertexbuffers.indices.flags.dataChanged){
          r.AdjustGLELMENTBuffer(mesh.vertexbuffers.indices);
        };        
        
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.position.glObject);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.vertexbuffers.indices.glObject);
        gl.drawElements(gl.LINES, mesh.vertexbuffers.indices.size, gl.UNSIGNED_SHORT, 0);

      };
    };
  };
  
  var vertexshader = 
      "attribute vec3 aVertexPosition;" +
      "uniform mat4 uPMatrix;" +
      "uniform mat4 uCMatrix;" +
      "" + 
      "" + 
      "void main(void) {" +
      "  gl_Position = uPMatrix * uCMatrix * vec4(aVertexPosition, 1.0);" +
      "" +
      "}";
  var fragmentshader = "#ifdef GL_ES\n" +
      "  precision highp float; \n" +
      "#endif \n" + 
      "" +
      "" + 
      "void main(void) { \n" +
      "gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); \n" +
      "}\n";
  
  
  var createShaderProgram = function(){
    var r = debugBoundingBoxesMaterial.renderer;
    
    var shaderProgram = r.createShaderProgram(vertexshader,fragmentshader);
    
    shaderProgram.vertexPositionAttribute =r.getAttribute(shaderProgram,"aVertexPosition");

    
    shaderProgram.pMatrixUniform = r.getUniform(shaderProgram, "uPMatrix");
    shaderProgram.cMatrixUniform = r.getUniform(shaderProgram, "uCMatrix");
    
    debugBoundingBoxesMaterial.shaderProgram = shaderProgram;
  };
  

  
  materialList.registerMaterial(debugBoundingBoxesMaterial);
  
  global.debugBoundingBoxesMaterial = debugBoundingBoxesMaterial;
  
}(EWGL));
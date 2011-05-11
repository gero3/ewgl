(function(global){
    
  materialList = global.materialList;
 
  var linesMaterial = {
    "geometries" : [],
    "zOrdered": false,
    "lastUpdate": -1
  };
  Object.defineProperties(linesMaterial,{
    "renderer":{
      "get":function(){
        return global.renderer;
      }
    }
  });
  
  
  linesMaterial.update = function(){};
  
  linesMaterial.render = function(info){
    
    var i,l = linesMaterial.geometries.length,
        gl = linesMaterial.renderer.gl,
        r = linesMaterial.renderer,
        c = r.camera,
        shaderProgram,
        geom;
    
    //setshader
    if (! linesMaterial.shaderProgram){
      createShaderProgram();
    }
    shaderProgram =  linesMaterial.shaderProgram;
    r.useProgram(shaderProgram);
    //setcameraMatrix
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, c.perspective);
    gl.uniformMatrix4fv(shaderProgram.cMatrixUniform, false, c.inverseMatrix);
    
    //render Geometries
    for(i=0;i<l;i++){
      geom = linesMaterial.geometries[i];
      if(geom.lastUpdate === info.counter){
        
        //setmatrix
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, geom.matrix);
        
        //draw
        if (geom.mesh.vertexbuffers.position.flags.dataChanged){
          r.AdjustGLBuffer(geom.mesh.vertexbuffers.position);
        };
        
        if (geom.mesh.vertexbuffers.color.flags.dataChanged){
          r.AdjustGLBuffer(geom.mesh.vertexbuffers.color);
        };
        
        if (geom.mesh.vertexbuffers.indices.flags.dataChanged){
          r.AdjustGLELMENTBuffer(geom.mesh.vertexbuffers.indices);
        };        
        
        gl.bindBuffer(gl.ARRAY_BUFFER,geom.mesh.vertexbuffers.position.glObject);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER,geom.mesh.vertexbuffers.color.glObject);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geom.mesh.vertexbuffers.indices.glObject);
        gl.drawElements(gl.LINES, geom.mesh.vertexbuffers.indices.size, gl.UNSIGNED_SHORT, 0);

      };
    };
  };
  
  var vertexshader = 
      "attribute vec3 aVertexPosition;" +
      "" +
      "attribute vec4 aVertexColor;" +
      "uniform mat4 uMVMatrix;" + 
      "uniform mat4 uPMatrix;" +
      "uniform mat4 uCMatrix;" +
      "varying vec4 vColor;" +
      "" + 
      "" + 
      "void main(void) {" +
      "  gl_Position = uPMatrix * (uCMatrix * uMVMatrix) * vec4(aVertexPosition, 1.0);" +
      "  vColor = aVertexColor;" +
      "" +
      "}";
  var fragmentshader = "#ifdef GL_ES\n" +
      "  precision highp float; \n" +
      "#endif \n" + 
      "varying vec4 vColor;" +
      "" +
      "" + 
      "void main(void) { \n" +
      "gl_FragColor = vColor; \n" +
      "}\n";
  
  
  var createShaderProgram = function(){
    var r = linesMaterial.renderer;
    
    var shaderProgram = r.createShaderProgram(vertexshader,fragmentshader);
    
    shaderProgram.vertexPositionAttribute =r.getAttribute(shaderProgram,"aVertexPosition");
    shaderProgram.vertexColorAttribute =r.getAttribute(shaderProgram,"aVertexColor");
    shaderProgram.TexturePosition =r.getAttribute(shaderProgram,"aTexturePosition");

    
    shaderProgram.pMatrixUniform = r.getUniform(shaderProgram, "uPMatrix");
    shaderProgram.cMatrixUniform = r.getUniform(shaderProgram, "uCMatrix");
    shaderProgram.mvMatrixUniform = r.getUniform(shaderProgram, "uMVMatrix");
    shaderProgram.samplerUniform = r.getUniform(shaderProgram, "uSampler");
    
    linesMaterial.shaderProgram = shaderProgram;
  };
  

  
  materialList.registerMaterial(linesMaterial);
  
  global.linesMaterial = linesMaterial;
  
}(EWGL));
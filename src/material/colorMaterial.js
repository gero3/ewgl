(function(global){
  var undef;
  
  var emptyTexture;
  
  var materialList = global.materialList;
  var lights = global.lights;

  var testMatrix4 = mat4.create();
  var testMatrix3 = mat3.create();
  

  var colorMaterial = new global.material({"shaderProgram":global.shaders.colorShader});
  
  colorMaterial.render = function(info){
    
    var i,renderer = colorMaterial.renderer,
        mesheslength = colorMaterial.geometries.length,
        geomLength,
        gl = renderer.gl,
        shaderProgram = this.shaderProgram,
        geom,mesh,geoms,size,matrix,cameraMatrix,
        camera = colorMaterial.renderer.camera;
    
    shaderProgram.use();

    //setcameraMatrix
    gl.uniformMatrix4fv(shaderProgram.uniforms.pMatrixUniform, false, camera.perspective);
    gl.uniformMatrix4fv(shaderProgram.uniforms.cMatrixUniform, false, camera.inverseMatrix);
    
    lights.vsShaderExtension.setShaderPieces(shaderProgram,lights.vsShaderExtension.calculateID());
    
    //render Geometries
    for(i=0;i<mesheslength;i++){ 
      geomLength = colorMaterial.geometries[i].length;
      if (geomLength > 0){
        mesh = colorMaterial.geometries[i][0].mesh;
        
        if (mesh.vertexbuffers.position.flags.dataChanged){
          renderer.AdjustGLBuffer(mesh.vertexbuffers.position);
        }
        
        if (! mesh.vertexbuffers.normal){
         this.calculateNormals(mesh);
        }
        
        if (mesh.vertexbuffers.normal.flags.dataChanged){
          renderer.AdjustGLBuffer(mesh.vertexbuffers.normal);
        }
        
        if (mesh.vertexbuffers.color.flags.dataChanged){
          renderer.AdjustGLBuffer(mesh.vertexbuffers.color);
        }
        
        if (mesh.vertexbuffers.indices.flags.dataChanged){
          renderer.AdjustGLELMENTBuffer(mesh.vertexbuffers.indices);
        }
      
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.position.glObject);
        gl.vertexAttribPointer(shaderProgram.attributes.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.normal.glObject);
        gl.vertexAttribPointer(shaderProgram.attributes.VertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.color.glObject);
        gl.vertexAttribPointer(shaderProgram.attributes.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
        
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.vertexbuffers.indices.glObject);
        
        geoms = colorMaterial.geometries[i];
        size = mesh.vertexbuffers.indices.size;
        camera = colorMaterial.renderer.camera;
        cameraMatrix =  camera.matrix;
        for(j=0;j<geomLength;j++){
          geom = geoms[j];
          if (geom.lastUpdate === this.lastUpdate && this.isInFrustrum(geom,mesh,camera)){
            matrix =  geom.matrix;

            gl.uniformMatrix4fv(shaderProgram.uniforms.mvMatrixUniform, false, matrix);
            
            var test = mat4.multiply(cameraMatrix,matrix,testMatrix4);
            var test2 = mat4.toMat3(mat4.inverse(test),testMatrix3);
            test2 = mat3.transpose(test2);
            
            gl.uniformMatrix3fv(shaderProgram.uniforms.NMatrixUniform, false, test2);   

            gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, 0);
          } else {
            //gl.drawElements(gl.LINES, size, gl.UNSIGNED_SHORT, 0);
            if (! info.frustrumCulled){
              info.frustrumCulled = 1;
            }else {
               info.frustrumCulled++; 
            }
          } 
        }
      }
    }
  };
  
  materialList.registerMaterial(colorMaterial);
  
  global.colorMaterial = colorMaterial;
  
}(EWGL));
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
        l = colorMaterial.geometries.length,
        gl = renderer.gl,
        shaderProgram = this.shaderProgram,
        geom,mesh;
    
    shaderProgram.use();
    
    //setcameraMatrix
    gl.uniformMatrix4fv(shaderProgram.uniforms.pMatrixUniform, false, colorMaterial.renderer.camera.perspective);
    gl.uniformMatrix4fv(shaderProgram.uniforms.cMatrixUniform, false, colorMaterial.renderer.camera.inverseMatrix);
    
    lights.vsShaderExtension.setShaderPieces(shaderProgram,lights.vsShaderExtension.calculateID());
    
    //render Geometries
    for(i=0;i<l;i++){
      geom = colorMaterial.geometries[i];
      if(geom.lastUpdate === info.counter){
        mesh = geom.mesh;
        //setmatrix
        gl.uniformMatrix4fv(shaderProgram.uniforms.mvMatrixUniform, false, geom.matrix);
        
        var test = mat4.multiply( colorMaterial.renderer.camera.matrix,geom.matrix,testMatrix4);
        var test2 = mat4.toMat3(mat4.inverse(test),testMatrix3);
        test2 = mat3.transpose(test2);
        
        gl.uniformMatrix3fv(shaderProgram.uniforms.NMatrixUniform, false, test2);   
        
        //draw
        if (mesh.vertexbuffers.position.flags.dataChanged){
          renderer.AdjustGLBuffer(mesh.vertexbuffers.position);
        }
        
        if (! mesh.vertexbuffers.normal){
         this.calculateNormals(geom);
        }
        
        if (mesh.vertexbuffers.normal.flags.dataChanged){
          renderer.AdjustGLBuffer(mesh.vertexbuffers.normal);
        }
        
        if (mesh.vertexbuffers.color.flags.dataChanged){
          renderer.AdjustGLBuffer(mesh.vertexbuffers.color);
        }
        /*
        if (mesh.vertexbuffers.texture.flags.dataChanged){
          renderer.AdjustGLBuffer(mesh.vertexbuffers.texture);
        }
        */
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
        gl.drawElements(gl.TRIANGLES, mesh.vertexbuffers.indices.size, gl.UNSIGNED_SHORT, 0);
        
      }
    }
  };
  
  materialList.registerMaterial(colorMaterial);
  
  global.colorMaterial = colorMaterial;
  
}(EWGL));
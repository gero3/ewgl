(function(global){
  var undef;
  
  var emptyTexture;
  
  var materialList = global.materialList;
  var lights = global.lights;
  var shaderExt = global.shaderExtension;
  

  var basematerial = new global.material({"shaderProgram":global.shaders.baseShader});
  
  basematerial.render = function(info){
    
    var i,renderer = basematerial.renderer,
        l = basematerial.geometries.length,
        gl = renderer.gl,
        shaderProgram = this.shaderProgram,
        geom,mesh;
    
    shaderProgram.use();
    
    //setcameraMatrix
    gl.uniformMatrix4fv(shaderProgram.uniforms.pMatrixUniform, false, basematerial.renderer.camera.perspective);
    gl.uniformMatrix4fv(shaderProgram.uniforms.cMatrixUniform, false, basematerial.renderer.camera.inverseMatrix);
    
    lights.vsShaderExtension.setShaderPieces(shaderProgram,lights.vsShaderExtension.calculateID());
    
    //render Geometries
    for(i=0;i<l;i++){
      geom = basematerial.geometries[i];
      if(geom.lastUpdate === info.counter){
        mesh = geom.mesh;
        //setmatrix
        gl.uniformMatrix4fv(shaderProgram.uniforms.mvMatrixUniform, false, geom.matrix);
        
        var test = mat4.multiply( basematerial.renderer.camera.inverseMatrix,geom.matrix,mat4.create());
        var test2 = mat4.toMat3(test,mat3.create());
        test2 = mat3.transpose(test2);
        
        gl.uniformMatrix3fv(shaderProgram.uniforms.NMatrixUniform, false, test2);   
        
        //ready the 
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
        
        if (mesh.vertexbuffers.texture.flags.dataChanged){
          renderer.AdjustGLBuffer(mesh.vertexbuffers.texture);
        }
        
        if (mesh.vertexbuffers.indices.flags.dataChanged){
          renderer.AdjustGLELMENTBuffer(mesh.vertexbuffers.indices);
        }
        
        if (!geom.materialOptions.texture){
          geom.materialOptions.texture = createEmptyTexture();
        }
        
        if (!geom.materialOptions.texture.texture){
          geom.materialOptions.texture.texture = gl.createTexture();
        }
        
        if (geom.materialOptions.texture.flags.imageLoaded){
          gl.bindTexture(gl.TEXTURE_2D, geom.materialOptions.texture.texture);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, geom.materialOptions.texture.image);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
          gl.bindTexture(gl.TEXTURE_2D, null);
          geom.materialOptions.texture.flags.imageLoaded = false;
        }
        
        
        
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.position.glObject);
        gl.vertexAttribPointer(shaderProgram.attributes.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.normal.glObject);
        gl.vertexAttribPointer(shaderProgram.attributes.VertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.color.glObject);
        gl.vertexAttribPointer(shaderProgram.attributes.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.texture.glObject);
        gl.vertexAttribPointer(shaderProgram.attributes.TexturePositionAttribute, 2, gl.FLOAT, false, 0, 0);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, geom.materialOptions.texture.texture);
        gl.uniform1i(shaderProgram.uniforms.samplerUniform, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.vertexbuffers.indices.glObject);
        gl.drawElements(gl.TRIANGLES, mesh.vertexbuffers.indices.size, gl.UNSIGNED_SHORT, 0);
        
      }
    }
  };
  
  var createEmptyTexture = function(){
     if (!emptyTexture){
       emptyTexture = new EWGL.texture({"url":"http://media.tojicode.com/q3bsp/demo_baseq3/webgl/no-shader.png"});
     }
     return emptyTexture;
  };

  
  materialList.registerMaterial(basematerial);
  
  global.baseMaterial = basematerial;
  
}(EWGL));
(function(global){
  var undef;
  
  var emptyTexture;
  
  var materialList = global.materialList;
  var lights = global.lights;
  var shaderExt = global.shaderExtension;

  var colorMaterial = new global.material();
  
  colorMaterial.render = function(info){
    
    var i,renderer = colorMaterial.renderer,
        l = colorMaterial.geometries.length,
        gl = renderer.gl,
        shaderProgram,
        geom,mesh;
    
    //setshader
    if (!checkShaderValidation()){
      lights.calculateSimpleLights();
      createShaderProgram();
    }
    shaderProgram =  colorMaterial.shaderProgram;
    renderer.useProgram(shaderProgram);
    
    //setcameraMatrix
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, colorMaterial.renderer.camera.perspective);
    gl.uniformMatrix4fv(shaderProgram.cMatrixUniform, false, colorMaterial.renderer.camera.inverseMatrix);
    
    lights.setSimpleLightsUniforms(renderer,shaderProgram);
    
    //render Geometries
    for(i=0;i<l;i++){
      geom = colorMaterial.geometries[i];
      if(geom.lastUpdate === info.counter){
        mesh = geom.mesh;
        //setmatrix
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, geom.matrix);
        
        var test = mat4.multiply( colorMaterial.renderer.camera.inverseMatrix,geom.matrix,mat4.create());
        var test2 = mat4.toMat3(test,mat3.create());
        test2 = mat3.transpose(test2);
        
        gl.uniformMatrix3fv(shaderProgram.NMatrixUniform, false, test2);   
        
        //draw
        if (mesh.vertexbuffers.position.flags.dataChanged){
          renderer.AdjustGLBuffer(mesh.vertexbuffers.position);
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
        
        
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.position.glObject);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.normal.glObject);
        gl.vertexAttribPointer(shaderProgram.VertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.color.glObject);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.vertexbuffers.indices.glObject);
        gl.drawElements(gl.TRIANGLES, mesh.vertexbuffers.indices.size, gl.UNSIGNED_SHORT, 0);
        
      }
    }
  };
  
  var prevcache = {}; 
  var checkShaderValidation = function(){
    
    if (!colorMaterial.shaderProgram){
      return false;
    }
    
    var id = lights.calculateSimpleLightsId();
    if ( id != prevcache.lights){
      prevcache.lights = id;
      return false;
    }
    prevcache.lights = id;
    
    return true;
  };
  
  var vertexshader = new shaderExt({"type": shaderExt.types.vertex});
  
  vertexshader.addAttribute("aVertexPosition","vec3");
  vertexshader.addAttribute("aVertexNormal","vec3");
  vertexshader.addAttribute("aVertexColor","vec4");
  
  vertexshader.addUniform("uMVMatrix","mat4");
  vertexshader.addUniform("uPMatrix","mat4");
  vertexshader.addUniform("uCMatrix","mat4");
  vertexshader.addUniform("uNMatrix","mat3");  

  vertexshader.addVarying("vColor","vec4");
  
  vertexshader.appendProgram("gl_Position = uPMatrix * (uCMatrix * uMVMatrix) * vec4(aVertexPosition, 1.0);");
  vertexshader.appendProgram("vColor = aVertexColor;");
  
      
  var fragmentshader = new shaderExt({"type": shaderExt.types.fragment});
  
  fragmentshader.addPreprocessor("#ifdef GL_ES\n  precision highp float; \n#endif \n");
  
  fragmentshader.addVarying("vColor","vec4");
  
  fragmentshader.appendProgram("gl_FragColor = vColor;");


  var createShaderProgram = function(){
    var start = +(new Date());
    var r = colorMaterial.renderer;
    
    var shaderProgram = r.createShaderProgram(
        r.combineShaderExtensions([vertexshader, lights.vsShaderExtension]),
        r.combineShaderExtensions([fragmentshader, lights.fsShaderExtension])
    );
    
    shaderProgram.vertexPositionAttribute =r.getAttribute(shaderProgram,"aVertexPosition");
    shaderProgram.vertexColorAttribute =r.getAttribute(shaderProgram,"aVertexColor");
    shaderProgram.VertexNormalAttribute =r.getAttribute(shaderProgram,"aVertexNormal");
    
    shaderProgram.pMatrixUniform = r.getUniform(shaderProgram, "uPMatrix");
    shaderProgram.cMatrixUniform = r.getUniform(shaderProgram, "uCMatrix");
    shaderProgram.mvMatrixUniform = r.getUniform(shaderProgram, "uMVMatrix");
    shaderProgram.NMatrixUniform = r.getUniform(shaderProgram, "uNMatrix");
    
    
    colorMaterial.shaderProgram = shaderProgram;
    //console.log( +(new Date()) - start);
  };
  
  
  
  materialList.registerMaterial(colorMaterial);
  
  global.colorMaterial = colorMaterial;
  
}(EWGL));
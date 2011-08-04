(function(global){
  var undef;
  
  var emptyTexture;
  
  var materialList = global.materialList;
  var lights = global.lights;
  var shaderExt = global.shaderExtension;
  
  var basematerial = {
    "geometries" : [],
    "zOrdered": false,
    "shaderProgram" : undef,
    "lastUpdate": -1
  };
  
  Object.defineProperties(basematerial,{
    "renderer":{
      "get":function(){
        return global.renderer;
      }
    }
  });
  
  
  basematerial.update = function(){};
  
  basematerial.render = function(info){
    
    var i,renderer = basematerial.renderer,
        l = basematerial.geometries.length,
        gl = renderer.gl,
        shaderProgram,
        geom,mesh;
    
    
    
    //setshader
    if (!checkShaderValidation()){
      lights.calculateSimpleLights();
      createShaderProgram();
    }
    shaderProgram =  basematerial.shaderProgram;
    renderer.useProgram(shaderProgram);
    
    //setcameraMatrix
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, basematerial.renderer.camera.perspective);
    gl.uniformMatrix4fv(shaderProgram.cMatrixUniform, false, basematerial.renderer.camera.inverseMatrix);
    
    lights.setSimpleLightsUniforms(renderer,shaderProgram);
    
    //render Geometries
    for(i=0;i<l;i++){
      geom = basematerial.geometries[i];
      if(geom.lastUpdate === info.counter){
        mesh = geom.mesh;
        //setmatrix
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, geom.matrix);
        
        var test = mat4.multiply( basematerial.renderer.camera.inverseMatrix,geom.matrix,mat4.create());
        var test2 = mat4.toMat3(test,mat3.create());
        test2 = mat3.transpose(test2);
        
        gl.uniformMatrix4fv(shaderProgram.NMatrixUniform, false, test2);   
        
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
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.normal.glObject);
        gl.vertexAttribPointer(shaderProgram.VertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.color.glObject);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.texture.glObject);
        gl.vertexAttribPointer(shaderProgram.TexturePositionAttribute, 2, gl.FLOAT, false, 0, 0);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, geom.materialOptions.texture.texture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.vertexbuffers.indices.glObject);
        gl.drawElements(gl.TRIANGLES, mesh.vertexbuffers.indices.size, gl.UNSIGNED_SHORT, 0);
        
      }
    }
  };
  var prevcache = {}; 
  var checkShaderValidation = function(){
    
    if (!basematerial.shaderProgram){
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
  
  var createEmptyTexture = function(){
     if (!emptyTexture){
       emptyTexture = new EWGL.texture({"url":"http://media.tojicode.com/q3bsp/demo_baseq3/webgl/no-shader.png"});
     }
     return emptyTexture;
  };
 
  var vertexshader = new shaderExt({"type": shaderExt.types.vertex});
  
  vertexshader.addAttribute("aVertexPosition","vec3");
  vertexshader.addAttribute("aVertexNormal","vec3");
  vertexshader.addAttribute("aTexturePosition","vec2");
  vertexshader.addAttribute("aVertexColor","vec4");
  
  vertexshader.addUniform("uMVMatrix","mat4");
  vertexshader.addUniform("uPMatrix","mat4");
  vertexshader.addUniform("uCMatrix","mat4");
  vertexshader.addUniform("uNMatrix","mat3");  
  
  vertexshader.addVarying("vTexture","vec2");
  vertexshader.addVarying("vColor","vec4");
  
  vertexshader.appendProgram("gl_Position = uPMatrix * (uCMatrix * uMVMatrix) * vec4(aVertexPosition, 1.0);");
  vertexshader.appendProgram("vColor = aVertexColor;");
  vertexshader.appendProgram("vTexture = aTexturePosition;");
  
      
  var fragmentshader = new shaderExt({"type": shaderExt.types.fragment});
  
  fragmentshader.addPreprocessor("#ifdef GL_ES\n  precision highp float; \n#endif \n");
  
  fragmentshader.addVarying("vTexture","vec2");
  fragmentshader.addVarying("vColor","vec4");
  
  fragmentshader.addUniform("uSampler","sampler2D");
  
  fragmentshader.appendProgram("gl_FragColor = texture2D(uSampler, vec2(vTexture.s, vTexture.t));");


  var createShaderProgram = function(){
    var start = +(new Date());
    var r = basematerial.renderer;
    

    
    var shaderProgram = r.createShaderProgram(
        r.combineShaderExtensions([vertexshader, lights.vsShaderExtension]),
        r.combineShaderExtensions([fragmentshader, lights.fsShaderExtension])
    );
    
    shaderProgram.vertexPositionAttribute =r.getAttribute(shaderProgram,"aVertexPosition");
    shaderProgram.vertexColorAttribute =r.getAttribute(shaderProgram,"aVertexColor");
    shaderProgram.TexturePositionAttribute =r.getAttribute(shaderProgram,"aTexturePosition");
    shaderProgram.VertexNormalAttribute =r.getAttribute(shaderProgram,"aVertexNormal");
    
    shaderProgram.pMatrixUniform = r.getUniform(shaderProgram, "uPMatrix");
    shaderProgram.cMatrixUniform = r.getUniform(shaderProgram, "uCMatrix");
    shaderProgram.mvMatrixUniform = r.getUniform(shaderProgram, "uMVMatrix");
    shaderProgram.samplerUniform = r.getUniform(shaderProgram, "uSampler");
    shaderProgram.NMatrixUniform = r.getUniform(shaderProgram, "uNMatrix");
    
    
    basematerial.shaderProgram = shaderProgram;
    //console.log( +(new Date()) - start);
  };
  
  
  
  materialList.registerMaterial(basematerial);
  
  global.baseMaterial = basematerial;
  
}(EWGL));
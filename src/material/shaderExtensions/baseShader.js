(function(global){
  
  var shaderExt = global.shaderExtension;
  
  var program = new global.shaderProgram({"renderer": global.renderer});
  
  //*****************************************************************//
  //                           vertexshader                          //
  //*****************************************************************//
  
  var vertexshader = new shaderExt({"type": shaderExt.types.vertex});
  
  vertexshader.addAttribute("aVertexPosition","vec3");
  vertexshader.addAttribute("aVertexNormal","vec3");
  vertexshader.addAttribute("aTexturePosition","vec2");
  
  vertexshader.addUniform("uMVMatrix","mat4");
  vertexshader.addUniform("uPMatrix","mat4");
  vertexshader.addUniform("uCMatrix","mat4");
  vertexshader.addUniform("uNMatrix","mat3");  
  
  vertexshader.addVarying("vTexture","vec2");
  
  vertexshader.appendProgram("gl_Position = uPMatrix * (uCMatrix * uMVMatrix) * vec4(aVertexPosition, 1.0);");
  vertexshader.appendProgram("vTexture = aTexturePosition;");
  
  program.vsMain = vertexshader;
  
  //*****************************************************************//
  //                     fragmentshader                              //
  //*****************************************************************//
  
  var fragmentshader = new shaderExt({"type": shaderExt.types.fragment});
  
  fragmentshader.addPreprocessor("#ifdef GL_ES\n  precision highp float; \n#endif \n");
  
  fragmentshader.addVarying("vTexture","vec2");
  
  fragmentshader.addUniform("uSampler","sampler2D");
  
  fragmentshader.appendProgram("gl_FragColor = texture2D(uSampler, vec2(vTexture.s, vTexture.t));");
  
  program.fsMain = fragmentshader;
  
  //*****************************************************************//
  //                  shader Extensions                              //
  //*****************************************************************//
  
  program.extensions.push(global.lights.vsShaderExtension);
  program.extensions.push(global.lights.fsShaderExtension);

  
  //*****************************************************************//
  //                             common                              //
  //*****************************************************************//
  
  vertexshader.calculateID = false;
  fragmentshader.calculateID = false;
  
  vertexshader.getShaderInputs = function(shaderProgram,id){
    var program = shaderProgram.program;
    var r = shaderProgram.renderer;
    var uniforms = shaderProgram.uniforms;
    var attributes = shaderProgram.attributes;
    
    attributes.vertexPositionAttribute = r.getAttribute(program,"aVertexPosition");
    attributes.TexturePositionAttribute = r.getAttribute(program,"aTexturePosition");
    attributes.VertexNormalAttribute =  r.getAttribute(program,"aVertexNormal");
    
    uniforms.pMatrixUniform =  r.getUniform(program, "uPMatrix");
    uniforms.cMatrixUniform = r.getUniform(program, "uCMatrix");
    uniforms.mvMatrixUniform =  r.getUniform(program, "uMVMatrix");
    uniforms.samplerUniform =  r.getUniform(program, "uSampler");
    uniforms.NMatrixUniform =  r.getUniform(program, "uNMatrix");
    
  };
  
  global.shaders = global.shaders || {};
  global.shaders.baseShader = program;
  
}(EWGL));
(function(global){
  
  var shaderExt = global.shaderExtension;
  
  var program = new global.shaderProgram({"renderer": global.renderer});
  
  //*****************************************************************//
  //                           vertexshader                          //
  //*****************************************************************//
  
  var vertexshader = new shaderExt({"type": shaderExt.types.vertex});
  
  vertexshader.addAttribute("aVertexPosition","vec3");

  vertexshader.addUniform("uPMatrix","mat4");
  vertexshader.addUniform("uCMatrix","mat4");
  
  vertexshader.appendProgram("gl_Position = uPMatrix * uCMatrix * vec4(aVertexPosition, 1.0);");
  
  program.vsMain = vertexshader;
  
  //*****************************************************************//
  //                     fragmentshader                              //
  //*****************************************************************//
  
    var fragmentshader = new shaderExt({"type": shaderExt.types.fragment});
  
  fragmentshader.addPreprocessor("#ifdef GL_ES\n  precision highp float; \n#endif \n");
  
  fragmentshader.appendProgram("gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);");

  program.fsMain = fragmentshader;
    
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
    
    uniforms.pMatrixUniform =  r.getUniform(program, "uPMatrix");
    uniforms.cMatrixUniform = r.getUniform(program, "uCMatrix");
  };
  
  global.shaders = global.shaders || {};
  global.shaders.whiteColorShader = program;
  
}(EWGL));
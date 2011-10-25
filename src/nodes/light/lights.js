(function(global) {

  var shaderExt = global.shaderExtension;

  var lights = {
    lights: [],
    flags: {},
    types: {
      ambientLight: 1,
      directionalLight: 2
    },
    usedLights: {},
    vsShaderExtension: new shaderExt({
      "type": shaderExt.types.vertex
    }),
    fsShaderExtension: new shaderExt({
      "type": shaderExt.types.fragment
    })
  };

  lights.addLight = function(light) {
    lights.lights.push(light);
    lights.flags.changedLights = true;
  };

  var calculateSimpleLightsId = function() {
    var usedLights = lights.usedLights;
    var ambientlights = (usedLights[1] && 1) || 0;
    var directionalLights = (usedLights[2] && usedLights[2].length) || 0;

    return (directionalLights * 100 + ambientlights);
  };
  lights.vsShaderExtension.calculateID = calculateSimpleLightsId;
  lights.fsShaderExtension.calculateID = calculateSimpleLightsId;
  
  
  lights.vsShaderExtension.generateShaderPieces = function(id){
    var vs = lights.vsShaderExtension;
    var ambient = id%100;
    var directional = ((id-ambient)/100)%100;
    var uniformTypes = shaderExt.uniform.types;
    var varyingTypes = shaderExt.varying.types;
    
    if (vs.stack[id]){
      vs.useId(id);
      return;
    }
    
    vs.clear();
    
    if (ambient > 0){
      vs.addUniform("uAmbientColor", uniformTypes.vec3);
      vs.addVarying("vLightWeighting", varyingTypes.vec3);
      vs.appendProgram("vLightWeighting = uAmbientColor;");
    } else if(directional > 0){
      vs.addVarying("vLightWeighting", varyingTypes.vec3);
      vs.appendProgram("vLightWeighting = vec3(0.0,0.0,0.0);");
    }
    
    if (directional >= 1) {
      vs.appendProgram("float directionalWeighting;");
      vs.appendProgram("vec3 transformedNormal;"); 

      for (var i = 0; i < directional; i++) {
        vs.addUniform("uDirectionalColor" + i, uniformTypes.vec3);
        vs.addUniform("uDirectionalDirection" + i, uniformTypes.vec3);

        vs.appendProgram("transformedNormal = uNMatrix * aVertexNormal;");
        vs.appendProgram("directionalWeighting = max(dot(normalize(transformedNormal), normalize(uDirectionalDirection" + i + ")), 0.0);");
        vs.appendProgram("vLightWeighting += uDirectionalColor" + i + " * directionalWeighting;");

      }
      
    }
    vs.idNumber = id;
    
  };
  
  lights.fsShaderExtension.generateShaderPieces = function(id){
    var fs = lights.fsShaderExtension;
    var ambient = id%100;
    var directional = (id-ambient)/100%100;
    var varyingTypes = shaderExt.varying.types;
    
    if (fs.stack[id]){
      fs.useId(id);
      return;
    }
    
    fs.clear();
    
    if (ambient >= 1 || directional >= 1){
      fs.addVarying("vLightWeighting", varyingTypes.vec3);
      fs.appendProgram("gl_FragColor = vec4(gl_FragColor.rgb * vLightWeighting, gl_FragColor.a);");
    }
    
    fs.idNumber = id;
  };

  var getShaderInputs = function(shaderProgram,id){
    var uniforms = shaderProgram.uniforms;
    var ambient = id%100;
    var directional = ((id-ambient)/100)%100;
    var renderer = shaderProgram.renderer;
    var i,l;
    
    if (ambient > 0) {
     uniforms.AmbientUniform = renderer.getUniform(shaderProgram.program, "uAmbientColor");
    }
    if (directional > 0) {
      for (i = 0, l = directional; i < l; i++) {
        var color = "directionalLightColor" + i;
        var direction = "directionalLightDirection" + i;
        
        uniforms[color] = renderer.getUniform(shaderProgram.program, "uDirectionalColor" + i);
        uniforms[direction] = renderer.getUniform(shaderProgram.program, "uDirectionalDirection" + i);
      }
    }
  }
  
  lights.vsShaderExtension.getShaderInputs = getShaderInputs;
  
  
  var test = vec3.create();
  var setSimpleLightsUniforms = function(shaderProgram,id){
    
    var uniforms = shaderProgram.uniforms;
    var ambient = id%100;
    var directional = ((id-ambient)/100)%100;
    var renderer = shaderProgram.renderer;
    var gl = renderer.gl;
    var i,l;
    
    vec3.set([0,0,0],test);
    if (ambient > 0) {
      for (i = 0, l = lights.usedLights[1].length; i < l; i++) {
        vec3.add(test, lights.usedLights[1][i].color);
      }
      gl.uniform3fv(uniforms.AmbientUniform, test);
    }
    if (directional > 0) {
      for (i = 0, l = directional; i < l; i++) {
        var color = "directionalLightColor" + i;
        var direction = "directionalLightDirection" + i;
        
        gl.uniform3fv(uniforms[color], lights.usedLights[2][i].color);
        gl.uniform3fv(uniforms[direction], lights.usedLights[2][i].direction);
        
      }
    }
  };
  
  lights.vsShaderExtension.setShaderPieces = setSimpleLightsUniforms;

  global.lights = lights;


}(EWGL));
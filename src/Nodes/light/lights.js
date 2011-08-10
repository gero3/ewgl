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

  lights.calculateSimpleLightsId = function() {
    var usedLights = lights.usedLights;
    var ambientlights = (usedLights[1] && 1) || 0;
    var directionalLights = (usedLights[2] && usedLights[2].length) || 0;

    return (directionalLights * 100 + ambientlights);
  };

  lights.calculateSimpleLights = function() {
    var usedLights = lights.usedLights,
        vs = lights.vsShaderExtension,
        fs = lights.fsShaderExtension,
        uniformTypes = shaderExt.uniform.types,
        varyingTypes = shaderExt.varying.types,
        i, l;
        
    var ambientlights = (usedLights[1] && 1) || 0;
    var directionalLights = (usedLights[2] && usedLights[2].length) || 0;
    var nb = (directionalLights * 100 + ambientlights);
    
    if (vs.stack[nb] && fs.stack[nb]){
      
      vs.useId(nb);
      fs.useId(nb);
      return ;
    }
    
    vs.clear();
    fs.clear();

    if (usedLights[1] && usedLights[1].length > 0) {
      vs.addUniform("uAmbientColor", uniformTypes.vec3);
      vs.addVarying("vLightWeighting", varyingTypes.vec3);
      vs.appendProgram("vLightWeighting = uAmbientColor;");

      fs.addVarying("vLightWeighting", varyingTypes.vec3);
      fs.appendProgram("gl_FragColor = vec4(gl_FragColor.rgb * vLightWeighting, gl_FragColor.a);");
      
    }
    if (usedLights[2] && usedLights[2].length > 0) {
      vs.appendProgram("float directionalWeighting;");
      vs.appendProgram("vec3 transformedNormal;"); 

      for (i = 0, l = usedLights[2].length; i < l; i++) {
        vs.addUniform("uDirectionalColor" + i, uniformTypes.vec3);
        vs.addUniform("uDirectionalDirection" + i, uniformTypes.vec3);

        vs.appendProgram("transformedNormal = uNMatrix * aVertexNormal;");
        //vs.appendProgram("transformedNormal = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0) * aVertexNormal;");
        vs.appendProgram("directionalWeighting = max(dot(normalize(transformedNormal), normalize(uDirectionalDirection" + i + ")), 0.0);");
        //vs.appendProgram("directionalWeighting = max(dot(transformedNormal, uDirectionalDirection" + i + "), 0.0);");
        vs.appendProgram("vLightWeighting += uDirectionalColor" + i + " * directionalWeighting;");

      }

      nb += usedLights[2].length * 100;

    }
    vs.idNumber = nb;
    fs.idNumber = nb;
  };
  
  lights.setSimpleLightsUniforms = function(renderer,shaderProgram){
    
    shaderProgram.lights = shaderProgram.lights || {};
    
    var uniforms = shaderProgram.lights;
    var usedLights = lights.usedLights;
    var ambientlights = usedLights[lights.types.ambientLight];
    var directionalLight = usedLights[lights.types.directionalLight];
    var gl = renderer.gl;
    var i,l;
    
    
    if (ambientlights && ambientlights.length > 0) {
      uniforms.AmbientUniform = uniforms.AmbientUniform || renderer.getUniform(shaderProgram, "uAmbientColor");
      var test = vec3.create();
      for (i = 0, l = ambientlights.length; i < l; i++) {
        vec3.add(test, ambientlights[i].color);
      }
      gl.uniform3fv(uniforms.AmbientUniform, test);
    }
    if (directionalLight && directionalLight.length > 0) {
      for (i = 0, l = directionalLight.length; i < l; i++) {
        var color = "directionalLightColor" + i;
        var direction = "directionalLightDirection" + i;
        
        uniforms[color] = uniforms[color] || renderer.getUniform(shaderProgram, "uDirectionalColor" + i);
        uniforms[direction] = uniforms[direction] || renderer.getUniform(shaderProgram, "uDirectionalDirection" + i);
        
        gl.uniform3fv(uniforms[color], directionalLight[i].color);
        gl.uniform3fv(uniforms[direction], directionalLight[i].direction);
        
      }
    }
    
  };


  global.lights = lights;


}(EWGL));
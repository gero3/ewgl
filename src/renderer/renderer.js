(function(global) {

  var _renderer, undef;
  var renderer = {};

  Object.defineProperties(renderer, {
    "_canvas": {
      "value": undef,
      "configurable": true,
      "writable": true
    },
    "canvas": {
      "get": function() {
        return renderer._canvas;
      },
      "set": function(value) {
        if (renderer._canvas !== value) {
          removeHandlers(renderer);
          removeglcontext(renderer);
          renderer._canvas = value;
          addglcontext(renderer);
          addHandlers(renderer);
          setOptions(renderer);
        }
      }
    },

    "_gl": {
      "value": undef,
      "configurable": true,
      "writable": true
    },
    "gl": {
      "get": function() {
        return renderer._gl;
      }
    },

    "backcolor": {
      "value": [0, 0, 0, 1]
    },

    "_camera": {
      "value": undef,
      "configurable": true,
      "writable": true
    },
    "camera": {
      "get": function() {
        return renderer._camera;
      },
      "set": function(value) {
        if (value !== renderer._camera) {
          renderer._camera = value;
          value.updateView(renderer.canvas);
        }
      }
    }
  });

  var removeHandlers = function(renderer) {

    };
  var removeglcontext = function(renderer) {

    };
  var addglcontext = function(renderer) {
      var context = renderer._canvas.getContext("experimental-webgl");
      renderer._gl = context;
      };
  var addHandlers = function(renderer) {

    };
  var setOptions = function(renderer) {
      if (renderer._camera) {
        renderer._camera.updateView(renderer.canvas);
      }
      if (renderer.backcolor) {
        renderer.gl.clearColor(renderer.backcolor[0], renderer.backcolor[1], renderer.backcolor[2], renderer.backcolor[3]);
      }
      renderer.gl.enable(renderer.gl.DEPTH_TEST);
      renderer.gl.clear(renderer.gl.COLOR_BUFFER_BIT | renderer.gl.DEPTH_BUFFER_BIT);
      };

  renderer.clear = function() {
    renderer.gl.clear(renderer.gl.COLOR_BUFFER_BIT | renderer.gl.DEPTH_BUFFER_BIT);
  };

  renderer.createShaderProgram = function(vertexshader, fragmentshader) {
    var gl = renderer.gl;

    var start = +(new Date());
    var fragshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragshader, fragmentshader);
    gl.compileShader(fragshader);
    if (!gl.getShaderParameter(fragshader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(fragshader));
      return null;
    }
    console.log("fragshader alone:" + (+(new Date()) - start));
    start = +(new Date());
    var vertshader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertshader, vertexshader);
    gl.compileShader(vertshader);
    if (!gl.getShaderParameter(vertshader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(vertshader));
      return null;
    };
    console.log("vertshader alone:" + (+(new Date()) - start));
    start = +(new Date());
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertshader);
    gl.attachShader(shaderProgram, fragshader);
    gl.linkProgram(shaderProgram);
    console.log("linkshader alone:" + (+(new Date()) - start));
    start = +(new Date());
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);
    return shaderProgram;
  };

  renderer.getAttribute = function(shaderProgram, name) {
    var gl = renderer.gl;
    var returnValue = gl.getAttribLocation(shaderProgram, name);
    gl.enableVertexAttribArray(returnValue);
    return returnValue;
  };

  renderer.getUniform = function(shaderProgram, name) {
    return renderer.gl.getUniformLocation(shaderProgram, name);
  };

  renderer.AdjustGLBuffer = function(vertexbuffer) {
    var gl = renderer.gl,
        glObject, data = vertexbuffer.getData();
    glObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, glObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    vertexbuffer.glObject = glObject;
    vertexbuffer.size = data.length;
    vertexbuffer.flags.dataChanged = false;
  };

  renderer.AdjustGLELMENTBuffer = function(vertexbuffer) {
    var gl = renderer.gl,
        glObject, data = vertexbuffer.getData();
    glObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);

    vertexbuffer.glObject = glObject;
    vertexbuffer.size = data.length;
    vertexbuffer.flags.dataChanged = false;

  };


  usedShaderProgram = undef;
  renderer.useProgram = function(shaderProgram) {
    if (usedShaderProgram !== shaderProgram) {
      renderer.gl.useProgram(shaderProgram);
      usedShaderProgram = shaderProgram;
    };
  };

  global.renderer = renderer;



}(EWGL));
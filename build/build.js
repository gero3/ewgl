var fs = require('fs');
var uglifyjs = require('uglify-js');
var http = require('http');
var buffer = require('buffer');

var files = [
  "src/core.js",
  
  "src/math/glmatrix.js",
  "src/math/glmatrixUtils/vec3.js",
  "src/math/glmatrixUtils/mat4.js",
  "src/math/boundingBox.js",
  "src/math/plane.js", 
  "src/math/frustrum.js", 
  
  "src/input/inputmanager.js",
  "src/input/keyboard.js", 
  "src/input/mouse.js",
  
  "src/renderer/renderer.js",
  "src/renderer/mesh.js", 
  "src/renderer/texture.js",
  "src/renderer/shaderProgram.js",
  "src/renderer/shaderExtension.js",
  
  
  "src/Nodes/light/lights.js",
  "src/Nodes/light/light.js",
  "src/Nodes/light/ambientLight.js",
  "src/Nodes/light/directionalLight.js",
    
  "src/material/shaderExtensions/baseShader.js",
  "src/material/shaderExtensions/colorShader.js",
  "src/material/shaderExtensions/whiteColorShader.js",
    
  "src/material/materialList.js",
  "src/material/material.js",
  "src/material/baseMaterial.js",
  "src/material/colorMaterial.js",
  "src/material/linesMaterial.js",
  "src/material/skyboxMaterial.js",
    
  "src/primitives/triangle.js",
  "src/primitives/quad.js",
  "src/primitives/cube.js",
  "src/primitives/sphere.js", 
  "src/primitives/skybox.js",  
  "src/primitives/boundingBoxOutline.js",
 
  "src/loaders/loader.js",
  "src/loaders/imageLoader.js",
  "src/loaders/textureLoader.js",
    
  "src/controller/controller.js", 
  "src/controller/positioncontroller.js", 
  "src/controller/pathcontroller.js", 
  "src/controller/distanceAngleController.js", 
  
  "src/application.js",
  "src/stats.js"
];

var ReadFile = function(args,callback){
  fs.readFile(args.file, args.encoding || 'UTF8', function (err, data) {
    if (err) throw err;
    console.log(args.file + " has been read.");
    args.data = data;
    callback();
  });
};

var readAllFiles = function(args,completeCallBack){
    var counter= args.length;
    var callBack = function(){
      counter--;
      if (counter ===0){
        completeCallBack();
      }
    };
    args.forEach(function(args){
      ReadFile(args,callBack);
    });
};

var concatFiles = function(files,callback){
  var container = [];
  files.forEach(function(file){
    var obj = {"file":file};
    container.push(obj);
  });
  
  readAllFiles(container,function(){
    var data = "";
    container.forEach(function(args){
      data = data +"; \n\n" + args.data;
    });
    callback(data);  
  });
};


var WriteFile = function(args,callback){
  fs.writeFile(args.file,args.data,args.encoding || 'UTF8',function(err, data){
    if (err) throw err;
    console.log(args.file + " has been written.");
    if (callback){
      callback();
    }
  });
};

concatFiles(files,function(data){
  var compressed = uglifyjs(data);
  console.log(
    "Data compressed by " + 
    parseInt((1 -(compressed.length/data.length))*100,10) +
    "%.");
  WriteFile({"file":"lib/EWGL.js","data":data});
  WriteFile({"file":"lib/EWGL-min.js","data":compressed});
});

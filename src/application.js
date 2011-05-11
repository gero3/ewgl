(function(global){
  
  var info = {};
  
  var app = function(){
    var camera,renderer,rootNode;
    
    renderer = global.renderer;
    this.renderer = global.renderer;
    
    this.materialList = global.materialList;
    
    this.input = global.inputManager;
    
    rootNode = new global.node({"name":"rootNode"});
    this.rootNode = rootNode;
    
    camera = new global.cameraNode({"name":"mainCamera","parent":this.rootNode});
    renderer.camera = camera;
    
    this.stats = new global.stats();
    
    this.assetManager = global.loader; 
    this.assetManager.onLoadedCompleted = (function(self){
      return function(){
          self.startRendering();
      };
    }(this));
    this.renderer.canvas = createcanvas();
    
  };
  
  Object.defineProperties(app.prototype,{
    "camera":{
      "get": function(){
        return this.renderer.camera;
      },
      "set": function(cam){
        this.renderer.camera = cam;
      }
    }
  });
  
  app.prototype.startRendering = function(){
    var applicationtest = this;
    timestart = +(new Date());
    var render = function(){
      requestAnimFrame(render);
      applicationtest.stats.update(info);
      applicationtest.update(info);
      applicationtest.input.update(info);
      applicationtest.rootNode.update(info);
      applicationtest.materialList.render(info);
      
    };
    render();
  };

  app.prototype.renderOnce= function(){
    this.stats.update(info);
    this.update(info);
    this.input.update(info);
    this.rootNode.update(info);
    this.materialList.render(info);
  };

  
  app.prototype.update = function(info){
    
  };
  
  
  var createcanvas =function(){
    var canvas;
    canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    return canvas;
  };
  
  global.app = app;
  
}(EWGL));


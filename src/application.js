window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
      window.setTimeout(callback, 1000/60);
    };
})();

(function(global){
  
  var info = {};
  
  var app = function(){
    var camera,renderer2,rootNode;
    
    renderer2 = renderer;
    this.renderer = renderer;
    
    this.materialList = materialList;
    
    this.input = inputManager;
    
    rootNode = new node({"name":"rootNode"});
    this.rootNode = rootNode;
    camera = new cameraNode({"name":"mainCamera","parent":this.rootNode});
    renderer.camera = camera;
    
    this.renderer.canvas = createcanvas();
    
  };
  
  app.prototype.startRendering = function(){
    var applicationtest = this;
    timestart = +(new Date());
    var render = function(){
      requestAnimFrame(render);
      updateinfo(info);
      applicationtest.update(info);
      applicationtest.input.update(info);
      applicationtest.rootNode.update(info);
      applicationtest.materialList.render(info);
      
    };
    render();
  };

  app.prototype.renderOnce= function(){
    updateinfo(info);
    this.update(info);
    this.input.update(info);
    this.rootNode.update(info);
    this.materialList.render(info);
  };
  
  var rendercounter = 0;
  var timestart = 0; 
  var updateinfo = function(info){
    info.counter = rendercounter++;
    info.timeElapsed = +(new Date()) -timestart;
    timestart = +(new Date());
  };
  
  app.prototype.update = function(info){
    
  };
  
  
  var createcanvas =function(){
    var canvas;
    canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 600;
    document.body.appendChild(canvas);
    return canvas;
  };
  
  global.app = app;
  
}(window));


(function(global){
  
  var inputManager = global.inputManager;
  
  var mouseButtons = {};
  mouseButtons.NONE =0;
  mouseButtons.LEFT = 1;
  mouseButtons.MIDDLE = 2;
  mouseButtons.RIGHT = 3;
   
  var mouseDragHandlers = {},
      mouseUpHandlers = {},
      mouseDownHandlers = {},
      mouseWheelHandlers = {},
      mousePressed = {},
      buttonsPressed = 0,
      startPosition = {},
      prevPosition = [],
      position = [];
      
  mousePressed[mouseButtons.NONE] = true;
  mousePressed[mouseButtons.LEFT] = false;
  mousePressed[mouseButtons.MIDDLE] = false;
  mousePressed[mouseButtons.RIGHT] = false;
  
  var mouseUpdater = function(args){
    var mouseButton,l,handler,i,mousehandlerslist;
    args.mouse = {};
    for (mouseButton in mousePressed){
      if (mousePressed[mouseButton] === true){
        mousehandlerslist = mouseDragHandlers[mouseButton];
        
        args.mouse.startPosition = startPosition[mouseButton];
        args.mouse.prevPosition = prevPosition;
        args.mouse.position = position;
        
        if (mousehandlerslist && mouseButton){
          l = mousehandlerslist.length;
          for (i = 0; i<l; i++){
            inputManager.activateAction(mousehandlerslist[i].name,args);
          }
        }
      }
    }
    prevPosition = position;
  };
  
  var mouseDownUpdater = function(e){
    var mouseButton = e.which,mousehandlerslist = mouseDownHandlers[mouseButton],l, handler,i;
    
    if (mousehandlerslist && !mousePressed[mouseButton]){
      l = mousehandlerslist.length;
      for (i = 0; i<l; i++){
        inputManager.activateAction(mousehandlerslist[i].name,e);
      }
    }
    mousePressed[mouseButtons.NONE] = false;
    mousePressed[mouseButton] = true;
    startPosition[mouseButton] = [e.screenX,e.screenY];
    prevPosition = [e.screenX,e.screenY];
  };
  
  var mouseUpUpdater = function(e){
    var mouseButton = e.which,mousehandlerslist = mouseUpHandlers[mouseButton],l, handler,i;
    
    if (mousehandlerslist){
      l = mousehandlerslist.length;
      for (i = 0; i<l; i++){
        inputManager.activateAction(mousehandlerslist[i].name,e);
      }
    }
    
    mousePressed[mouseButton] = false;
    if (!mousePressed[mouseButtons.LEFT] && !mousePressed[mouseButtons.MIDDLE] && !mousePressed[mouseButtons.RIGHT]){
      mousePressed[mouseButtons.NONE] = true;
    }
  };
  
  function wheel(event){
    var delta = 0;
    if (!event) {
       event = window.event;
    }
    if (event.wheelDelta) { 
      delta = event.wheelDelta/120;
      if (window.opera) {
              delta = -delta;
      }
    } else if (event.detail) {
      delta = -event.detail/3;
    }
    
    var mousehandlerslist = mouseWheelHandlers[0],l, handler,i;

    if (mousehandlerslist){
      l = mousehandlerslist.length;
      for (i = 0; i<l; i++){
          inputManager.activateAction(mousehandlerslist[i].name,delta);
      }
    }
    if (event.preventDefault) {
      event.preventDefault();
      event.returnValue = false;
    }
  }
  
  var mousemove = function(e){
    position = [e.screenX,e.screenY];  
  };
      
      
  document.addEventListener("mousedown",mouseDownUpdater,true);
  document.addEventListener("mouseup",mouseUpUpdater,true);
  document.addEventListener("mousemove",mousemove,true);
  window.addEventListener('DOMMouseScroll', wheel, true);

  window.onmousewheel = document.onmousewheel = wheel;
  
  inputManager.updateCallbacks.push(mouseUpdater);
  
  inputManager.addMouseDragHandler = inputManager.createAddHandler(mouseDragHandlers);
  inputManager.addMouseUpHandler = inputManager.createAddHandler(mouseUpHandlers);
  inputManager.addMouseWheelHandler = inputManager.createAddHandler(mouseWheelHandlers);
  inputManager.addMouseDownHandler = inputManager.createAddHandler(mouseDownHandlers);
  
  inputManager.mouse = {};
  inputManager.mouse.mouseButtons = mouseButtons;
  inputManager.mouse.mousePressed = mousePressed;
    
}(EWGL));  
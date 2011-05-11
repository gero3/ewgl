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
      mousePressed = {},
      buttonsPressed = 0,
      startPosition = {};
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
  
  var mousemove = function(e){
    position = [e.screenX,e.screenY];  
  };
      
      
  document.addEventListener("mousedown",mouseDownUpdater,true);
  document.addEventListener("mouseup",mouseUpUpdater,true);
  document.addEventListener("mousemove",mousemove,true);
  inputManager.updateCallbacks.push(mouseUpdater);
  
  inputManager.addMouseDragHandler = inputManager.createAddHandler(mouseDragHandlers);
  inputManager.addMouseUpHandler = inputManager.createAddHandler(mouseUpHandlers);
  inputManager.addMouseDownHandler = inputManager.createAddHandler(mouseDownHandlers);
  
  inputManager.mouse = {};
  inputManager.mouse.mouseButtons = mouseButtons;
  inputManager.mouse.mousePressed = mousePressed;
    
}(EWGL));  
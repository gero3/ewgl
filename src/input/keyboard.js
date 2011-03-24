(function(global){
  
  var keyhandlers = {};
  var keydownhandlers = {};
  var keyuphandlers = {};
  var keypressed = {};
  
  var keys = {};
  keys.BACKSPACE=8;
  keys.TAB=9;
  keys.ENTER=13;
  keys.SHIFT=16;
  keys.CTRL=17;
  keys.ALT=18;
  keys.PAUSE_BREAK=19;
  keys.CAPS_LOCK=20;
  keys.ESCAPE=27;
  keys.PAGE_UP=33;
  keys.PAGE_DOWN=34;
  keys.END=35;
  keys.HOME=36;
  keys.LEFT_ARROW=37;
  keys.UP_ARROW=38;
  keys.RIGHT_ARROW=39;
  keys.DOWN_ARROW=40;
  keys.INSERT=45;
  keys.DELETE=46;
  keys[0]=48;
  keys[1]=49;
  keys[2]=50;
  keys[3]=51;
  keys[4]=52;
  keys[5]=53;
  keys[6]=54;
  keys[7]=55;
  keys[8]=56;
  keys[9]=57;
  keys.A=65;
  keys.B=66;
  keys.C=67;
  keys.D=68;
  keys.E=69;
  keys.F=70;
  keys.G=71;
  keys.H=72;
  keys.I=73;
  keys.J=74;
  keys.K=75;
  keys.L=76;
  keys.M=77;
  keys.N=78;
  keys.O=79;
  keys.P=80;
  keys.Q=81;
  keys.R=82;
  keys.S=83;
  keys.T=84;
  keys.U=85;
  keys.V=86;
  keys.W=87;
  keys.X=88;
  keys.Y=89;
  keys.Z=90;
  keys.LEFT_WINDOW_KEY=91;
  keys.RIGHT_WINDOW_KEY=92;
  keys.SELECT_KEY=93;
  keys.NUMPAD_0=96;
  keys.NUMPAD_1=97;
  keys.NUMPAD_2=98;
  keys.NUMPAD_3=99;
  keys.NUMPAD_4=100;
  keys.NUMPAD_5=101;
  keys.NUMPAD_6=102;
  keys.NUMPAD_7=103;
  keys.NUMPAD_8=104;
  keys.NUMPAD_9=105;
  keys.MULTIPLY=106;
  keys.ADD=107;
  keys.SUBTRACT=109;
  keys.DECIMAL_POINT=110;
  keys.DIVIDE=111;
  keys.F1=112;
  keys.F2=113;
  keys.F3=114;
  keys.F4=115;
  keys.F5=116;
  keys.F6=117;
  keys.F7=118;
  keys.F8=119;
  keys.F9=120;
  keys.F10=121;
  keys.F11=122;
  keys.F12=123;
  keys.NUM_LOCK=144;
  keys.SCROLL_LOCK=145;
  keys.SEMI_COLON=186;
  keys.EQUAL_SIGN=187;
  keys.COMMA=188;
  keys.DASH=189;
  keys.PERIOD=190;
  keys.FORWARD_SLASH=191;
  keys.GRAVE_ACCENT=192;
  keys.OPEN_BRACKET=219;
  keys.BACK_SLASH=220;
  keys.CLOSE_BRAKET=221;
  keys.SINGLE_QUOTE=222;
  keys.SPACE=32;
  
  var keyDownUpdater = function(e){
    
    var key = e.which,keyhandlerslist = keydownhandlers[key],l, handler,i;
    
    if (keyhandlerslist && !keypressed[key]){
      l = keyhandlerslist.length;
      for (i = 0; i<l; i++){
        inputmanager.activateAction(keyhandlerslist[i].name,e);
      };
    };
    keypressed[key] = true;
    
  };
  
  
  var keyUpUpdater =function(e){
    var key = e.which, keyhandlerslist = keyuphandlers[key],l, handler,i;
    
    if (keyhandlerslist){
      l = keyhandlerslist.length;
      for (i = 0; i<l; i++){
        inputManager.activateAction(keyhandlerslist[i].name,e);
      }; 
    };
    if (keypressed[key]){
      delete keypressed[key];
    };
  };
  
  var keyUpdater = function(args){
    var key,l,handler,i,keyhandlerslist;
    
    for (key in keypressed){
      keyhandlerslist = keyhandlers[key];
      if (keyhandlerslist && key){
        l = keyhandlerslist.length;
        for (i = 0; i<l; i++){
          inputManager.activateAction(keyhandlerslist[i].name,args);
        }; 
      };
    };
  };
  
  document.addEventListener("keydown",keyDownUpdater,true);
  document.addEventListener("keyup",keyUpUpdater,true);
  inputManager.updateCallbacks.push(keyUpdater);
  
  
  inputManager.addKeyHandler = inputManager.createAddHandler(keyhandlers);
  inputManager.addKeyUpHandler = inputManager.createAddHandler(keyuphandlers);
  inputManager.addKeyDownHandler = inputManager.createAddHandler(keydownhandlers);
  
  inputManager.keyboard = {};
  inputManager.keyboard.keys = keys;
  inputManager.keyboard.keyspressed = keypressed;
  
}(window))
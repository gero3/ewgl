(function(global){
  var undef;
  
  var controller = global.controller;
  var input = global.inputManager;
  
  input.addKeyHandler({"name":"distanceAngleController.left",
                      "keyName":input.keyboard.keys.LEFT_ARROW
  });
  input.addKeyHandler({"name":"distanceAngleController.right",
                       "keyName":input.keyboard.keys.RIGHT_ARROW
  });
  input.addKeyHandler({"name":"distanceAngleController.down",
                       "keyName":input.keyboard.keys.DOWN_ARROW
  });
  input.addKeyHandler({"name":"distanceAngleController.up",
                       "keyName":input.keyboard.keys.UP_ARROW
  });
  input.addMouseDragHandler({"name":"distanceAngleController.drag",
                            "keyName":input.mouse.mouseButtons.LEFT
  });
  
  input.addMouseWheelHandler({"name":"distanceAngleController.wheel"});
  
  var distanceAngleController= function(args){
    this.distance = 0;
    this.height = 0;
    this.angle = 0;
    this.targetPosition = args.targetPosition || vec3.create(0,0,0);
    this.initialVecUp = [0,1,0];
  };
  
  
  distanceAngleController.prototype = new controller({});
  distanceAngleController.prototype.distance = 0;
  distanceAngleController.prototype.angle = quat4.create();
  
  distanceAngleController.prototype.changedNode = function(){ 
    var node = this.node;
    var targetPosition = this.targetPosition;
    var self = this;
    if (this.node){
      //this.targetPosition = this.node.worldTranslation;
      var diff = vec3.subtract(this.node.worldTranslation,this.targetPosition,[]);
      this.distance = Math.sqrt(diff[0]*diff[0] + diff[2]* diff[2]);
      this.height = diff[1];
      this.angle = Math.atan2(diff[2],diff[0]);
      targetPosition = this.targetPosition;
      input.addMapping("distanceAngleController.left",
                        function(){
                           self.angle += 0.05;
                           update(self ,node ,targetPosition);
                         });
      input.addMapping("distanceAngleController.right",
                        function(){
                          self.angle -= 0.05;
                          update(self ,node ,targetPosition);
                        });
      
      input.addMapping("distanceAngleController.up",
                        function(){
                           self.distance -= 0.3;
                           update(self ,node ,targetPosition);
                        });
      input.addMapping("distanceAngleController.down",
                        function(){
                           self.distance += 0.3;
                           update(self ,node ,targetPosition);
                        });
                        
      input.addMapping("distanceAngleController.drag",
                        function(args){
                           var mouse = args.mouse;
                           if (mouse.position[0] > mouse.prevPosition[0] ){
                             self.angle += 0.05;
                           } else if (mouse.position[0] < mouse.prevPosition[0] ) {
                             self.angle -= 0.05;
                           }
                           update(self ,node ,targetPosition);
                        });
                        
     input.addMapping("distanceAngleController.wheel",
                        function(delta){
                          self.distance -= 1* delta;
                          update(self ,node ,targetPosition);
                        });
      node.lookAt(targetPosition);
    }
  };
  
  
  var update = function(self,node,targetPosition){
    node.translation = vec3.add([Math.cos(self.angle)*self.distance, self.height, Math.sin(self.angle)*self.distance],targetPosition); 
    node.lookAt(targetPosition);
  };
  
  global.distanceAngleController = distanceAngleController;
  
}(EWGL));
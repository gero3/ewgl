(function(global){
  var undef;
  
  var controller = global.controller;
  
  var distanceAngleController= function(args){
    this.distance = 0;
    this.angle = vec3.create();
    this.targetPosition = args.targetPosition || vec3.create();
  };
  
  
  distanceAngleController.prototype = new controller({});
  distanceAngleController.prototype.distance = 0;
  distanceAngleController.prototype.angle = quat4.create();
  
  distanceAngleController.prototype.changedNode = function(){ 
    if (this.node){
      this.distance = vec3.length(vec3.subtract(this.node.worldTranslation,this.targetPosition,[]));
      vec3.direction(this.node.worldTranslation, this.targetPosition, this.angle);
      var node = this.node;
      var targetPosition = this.targetPosition;
      var self = this;
      input.addKeyHandler({"name":"left",
                           "keyName":input.keyboard.keys.LEFT_ARROW,
                           "func":function(){
                             self.angle[0] += 0.05;
                             update(self ,node ,targetPosition);
                           }
                          });
      input.addKeyHandler({"name":"right",
                           "keyName":input.keyboard.keys.RIGHT_ARROW,
                           "func":function(){
                             self.angle[0] -= 0.05;
                             update(self ,node ,targetPosition);
                           }
                          });
      
      input.addKeyHandler({"name":"up",
                           "keyName":input.keyboard.keys.UP_ARROW,
                           "func":function(){
                             self.distance -= 0.3;
                             update(self ,node ,targetPosition);
                           }
                          });
      input.addKeyHandler({"name":"down",
                           "keyName":input.keyboard.keys.DOWN_ARROW,
                           "func":function(){
                             self.distance += 0.3;
                             update(self ,node ,targetPosition);
                           }
                          });
      
    };
    
    
  };
  
  var update = function(self,node,targetPosition){
    vec3.normalize(self.angle);                         
    node.translation = vec3.add([self.angle[0]*self.distance, self.angle[1]*self.distance, self.angle[2]*self.distance],targetPosition); 
    console.log(vec3.cross(vec3.direction(targetPosition,node.worldTranslation,[]),[-1,0,0]));
    node.lookAt(targetPosition);
  };
  
  global.distanceAngleController = distanceAngleController;
  
}(EWGL));
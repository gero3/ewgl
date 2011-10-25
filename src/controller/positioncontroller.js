(function(global){
  var undef;
  
  var controller = global.controller;
  
  var positionController = function(args){
    this._node =args.node;
    this.rpm = args.rpm || 0;
    this.axis = args.axis || vec3.create();
    this.normalizedAxis = vec3.create();
    this.startRotation = quat4.create();
    this.rotationToSet = quat4.create();
      if(!args.notStarting){
        this.start();
      } else {
        this.stop();
      }
      
  };
  
  
  
  positionController.prototype = new controller({});
  
  
  positionController.prototype.rpm = 0;
  positionController.prototype.axis = [0,0,0];
  positionController.prototype.startTime = 0;
  positionController.prototype.enabled = false;
  positionController.prototype.startRotation = quat4.create();
  
  positionController.prototype.start =function(){
    this.startTime = +(new Date());
    this.enabled = true; 
  };
  positionController.prototype.stop =function(){
    this.startTime = +(new Date());
    this.enabled = false; 
  };
  positionController.prototype.update = function(info){    
    var time = info.now - this.startTime;
    var angle = time * this.rpm/60000;
    var axis = vec3.normalize(this.axis,this.normalizedAxis);
    this.rotationToSet[0] = axis[0]* Math.sin(angle/2);
    this.rotationToSet[1] = axis[1]* Math.sin(angle/2);
    this.rotationToSet[2] = axis[2]* Math.sin(angle/2);
    this.rotationToSet[3] = Math.cos(angle/2);
    
    this.node.rotation = this.rotationToSet;
  };
  
  positionController.prototype.changedNode = function(){  
    if(this.node){
      this.startRotation = quat4.create(this.node.rotation);
    }
  };
  
  global.positionController = positionController;
  
}(EWGL));
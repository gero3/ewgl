(function(global){
  var undef;
  
  var controller = global.controller;
  
  var pathController = function(args){
    this._node =args.node;
    this.path = args.path || [];
    this.totaltime = getTotaltime(this.path);
    if(!args.notStarting){
      this.start();
    } else {
      this.stop();
    };
  };
  
  
  
  pathController.prototype = new controller({});
  
  pathController.prototype.rpm = 0;
  pathController.prototype.path = [];
  pathController.prototype.totaltime = 0;
  pathController.prototype.enabled = false;
  
  var getTotaltime = function(path){
    
    var i,l= path.length,total = 0;
    for (i= 0;i<l;i++){
      total += path[i].time;
    };
    return total;
  };
  
  pathController.prototype.start =function(){
    this.startTime = +(new Date());
    this.enabled = true; 
  };
  
  pathController.prototype.stop =function(){
    this.startTime = +(new Date());
    this.enabled = false; 
  };
  
  pathController.prototype.update = function(){    
    var time = +(new Date()) - this.startTime;
    var timeLeft = time % this.totaltime;
    var path = this.path;
    var i = 0,l= path.length,total = 0;
    var translation = vec3.create()
    for (i= 0;i<l;i++){
      if ((total + path[i].time) < timeLeft) {
        total += path[i].time;
        vec3.add(translation ,path[i].translation);
      } else if (total < timeLeft){
        var diff = timeLeft - total;
        var diff2 = vec3.scale(path[i].translation,diff/path[i].time,vec3.create());
        vec3.add(translation ,diff2);
        total += path[i].time;
      };
    };
    this.node.translation = translation ;
  };
  
  global.pathController= pathController;
  
}(EWGL));
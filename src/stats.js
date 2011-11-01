(function(global){
  
  var undef;
  var newTime,
      i,
      prevTime,
      timeCapsule, 
      firstTime;
  
  var stats = function(){
    
    prevTime = +(new Date());
    
    this.timeCapsule = [];
    for(i = 0; i < 100;i++){
      this.timeCapsule.push(prevTime);
    }
    
    this.counter = 0;
  };
  
  stats.prototype.update = function(info){
    timeCapsule = this.timeCapsule;
    
    newTime = Date.now();
    prevTime = timeCapsule[99];
    firstTime = timeCapsule[0];
    
    timeCapsule.shift();
    timeCapsule.push(newTime);
    
    this.counter++; 
    
    info.now = newTime;
    info.timeElapsed = newTime - prevTime;
    info.counter = this.counter;
    info.AvgTime = (newTime - firstTime)/99;
    info.fps = parseInt(1000/info.AvgTime + 0.5,10);
    
  };
  
  global.stats = stats;
  
}(EWGL));

(function(global){

  var boundingSphere = function(){
      
    this.radius = 0;
    this.radiusSquared = 0;
      
  };
  
  boundingSphere.prototype.getBoundingFromPoints = function(points){
    var x=0,
        y=0,
        z=0,
        radiusSq=0,
        checkSq=0,
        size = points.length;;
        
    for(var i = 0;i<size;i+=3){
        
      x = points[i];
      y = points[i + 1];
      z = points[i + 2];
      
      checkSq = x*x+y*y+z*z;
      
      if (radiusSq < checkSq){
        radiusSq = checkSq;
      }        
    }
    
    this.radius = Math.sqrt(radiusSq);
    this.radiusSquared = radiusSq;
    
  };
  
  
  global.boundingSphere = boundingSphere;

}(EWGL));

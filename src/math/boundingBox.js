(function(global){
  
  var boundingBox = function(args){
    
    if (args){
      this.minX  = args.minX  || Number.POSITIVE_INFINITY;
      this.plusX = args.plusX || Number.NEGATIVE_INFINITY;
    
      this.minY  = args.minY  || Number.POSITIVE_INFINITY;
      this.plusY = args.plusY || Number.NEGATIVE_INFINITY;
    
      this.minZ  = args.minZ  || Number.POSITIVE_INFINITY;
      this.plusZ = args.plusZ || Number.NEGATIVE_INFINITY;
    } else { 
      this.minX  = Number.POSITIVE_INFINITY;
      this.plusX = Number.NEGATIVE_INFINITY;
    
      this.minY  = Number.POSITIVE_INFINITY;
      this.plusY = Number.NEGATIVE_INFINITY;
    
      this.minZ  = Number.POSITIVE_INFINITY;
      this.plusZ = Number.NEGATIVE_INFINITY;
    }
  };
  
  boundingBox.prototype.getBoundingFromPoints = function(points){
    
    this.minX  = Number.POSITIVE_INFINITY;
    this.plusX = Number.NEGATIVE_INFINITY;
    
    this.minY  = Number.POSITIVE_INFINITY;
    this.plusY = Number.NEGATIVE_INFINITY;
    
    this.minZ  = Number.POSITIVE_INFINITY;
    this.plusZ = Number.NEGATIVE_INFINITY;
    
    var size = points.length /3;
    var x,y,z;
    
    for(var i = 0;i<size;i+=3){
      x = points[i];
      y = points[i + 1];
      z = points[i + 2];
      
      if (x < this.minX){
        this.minX = x;
      }
      
      if (x > this.plusX){
        this.plusX = x;
      }
      
      if (y < this.minY){
        this.minY = y;
      }
      
      if (y > this.plusY){
        this.plusY = y;
      }
      
      if (z < this.minZ){
        this.minZ = z;
      }
      
      if (z > this.plusZ){
        this.plusZ = z;
      }
    }
  };
  
  
  
  EWGL.boundingBox = boundingBox;
  
}(EWGL));
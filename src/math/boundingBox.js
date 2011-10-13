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
    
    var size = points.length;
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
  
  var vecs = vec3.createFixedPool(8);
    
  
  boundingBox.prototype.toAABB = function(mat,AABB){
    var a00 = mat[0], a01 = mat[1], a02 = mat[2];
    var a10 = mat[4], a11 = mat[5], a12 = mat[6];
    var a20 = mat[8], a21 = mat[9], a22 = mat[10];
    var a30 = mat[12], a31 = mat[13], a32 = mat[14];
    
    var minX = this.minX, minY = this.minY, minZ = this.minZ;
    var plusX = this.plusX, plusY = this.plusY, plusZ = this.plusZ;
    
    var a00minX  = a00 * minX,  a01minX  = a01 * minX,  a02minX  = a02 * minX;
    var a00plusX = a00 * plusX, a01plusX = a01 * plusX, a02plusX = a02 * plusX;
    
    var a10minY  = a10 * minY,  a11minY  = a11 * minY,  a12minY  = a12 * minY;
    var a10plusY = a10 * plusY, a11plusY = a11 * plusY, a12plusY = a12 * plusY;
    
    var a20minZ  = a20 * minZ,  a21minZ  = a21 * minZ,  a22minZ  = a22 * minZ;
    var a20plusZ = a20 * plusZ, a21plusZ = a21 * plusZ, a22plusZ = a22 * plusZ;
    
    var minX2,minY2,minZ2;
    var maxX2,maxY2,maxZ2;
    
    if (a00minX < a00plusX){
      minX2 = a00minX;
      maxX2 = a00plusX;
    } else {
      minX2 = a00plusX;
      maxX2 = a00minX;
    }
    
    if (a10minY < a10plusY){
      minY2 = a10minY;
      maxY2 = a10plusY;
    } else {
      minY2 = a10plusY;
      maxY2 = a10minY;
    }
    
    if (a20minZ < a20plusZ){
      minZ2 = a20minZ;
      maxY2 = a20plusZ;
    } else {
      minZ2 = a20plusZ;
      maxZ2 = a20minZ;
    }
    
    AABB.minX = minX2 + minY2 + minZ2 + a30;
    AABB.plusX = maxX2 + maxY2 + maxZ2 + a30;
    
    if (a01minX < a01plusX){
      minX2 = a01minX;
      maxX2 = a01plusX;
    } else {
      minX2 = a01plusX;
      maxX2 = a01minX;
    }
    
    if (a11minY < a11plusY){
      minY2 = a11minY;
      maxY2 = a11plusY;
    } else {
      minY2 = a11plusY;
      maxY2 = a11minY;
    }
    
    if (a21minZ < a21plusZ){
      minZ2 = a21minZ;
      maxY2 = a21plusZ;
    } else {
      minZ2 = a21plusZ;
      maxZ2 = a21minZ;
    }
    
    AABB.minY = minX2 + minY2 + minZ2 + a31;
    AABB.plusY = maxX2 + maxY2 + maxZ2 + a31;
    
    
    if (a02minX < a02plusX){
      minX2 = a02minX;
      maxX2 = a02plusX;
    } else {
      minX2 = a02plusX;
      maxX2 = a01minX;
    }
    
    if (a12minY < a12plusY){
      minY2 = a12minY;
      maxY2 = a12plusY;
    } else {
      minY2 = a12plusY;
      maxY2 = a12minY;
    }
    
    if (a22minZ < a22plusZ){
      minZ2 = a22minZ;
      maxY2 = a22plusZ;
    } else {
      minZ2 = a22plusZ;
      maxZ2 = a22minZ;
    }
    
    AABB.minZ = minX2 + minY2 + minZ2 + a32;
    AABB.plusZ = maxX2 + maxY2 + maxZ2 + a32;
    
    
    /*vecs[0][0] = a00minX  + a10minY  + a20minZ  + a30;
    vecs[1][0] = a00minX  + a10minY  + a20plusZ + a30;
    vecs[2][0] = a00minX  + a10plusY + a20minZ  + a30;
    vecs[3][0] = a00minX  + a10plusY + a20plusZ + a30;
    vecs[4][0] = a00plusX + a10minY  + a20minZ  + a30;
    vecs[5][0] = a00plusX + a10minY  + a20plusZ + a30;
    vecs[6][0] = a00plusX + a10plusY + a20minZ  + a30;
    vecs[7][0] = a00plusX + a10plusY + a20plusZ + a30;
    
    vecs[0][1] = a01minX  + a11minY  + a21minZ  + a31;
    vecs[1][1] = a01minX  + a11minY  + a21plusZ + a31;
    vecs[2][1] = a01minX  + a11plusY + a21minZ  + a31;
    vecs[3][1] = a01minX  + a11plusY + a21plusZ + a31;
    vecs[4][1] = a01plusX + a11minY  + a21minZ  + a31;
    vecs[5][1] = a01plusX + a11minY  + a21plusZ + a31;
    vecs[6][1] = a01plusX + a11plusY + a21minZ  + a31;
    vecs[7][1] = a01plusX + a11plusY + a21plusZ + a31;
    
    vecs[0][2] = a02minX  + a12minY  + a22minZ  + a32;
    vecs[1][2] = a02minX  + a12minY  + a22plusZ + a32;
    vecs[2][2] = a02minX  + a12plusY + a22minZ  + a32;
    vecs[3][2] = a02minX  + a12plusY + a22plusZ + a32;
    vecs[4][2] = a02plusX + a12minY  + a22minZ  + a32;
    vecs[5][2] = a02plusX + a12minY  + a22plusZ + a32;
    vecs[6][2] = a02plusX + a12plusY + a22minZ  + a32;
    vecs[7][2] = a02plusX + a12plusY + a22plusZ + a32;
    
    var b = AABB,x,y,z;
    b.minX  = vecs[0][0];
    b.plusX = vecs[0][0];
      
    b.minY  = vecs[0][1];
    b.plusY = vecs[0][1];
    
    b.minZ  = vecs[0][2];
    b.plusZ = vecs[0][2];
    
    for (var i= 1,l= vecs.length;i<l;i++){
      var vec =  vecs[i];
      x = vec[0];
      y = vec[1];
      z = vec[2];
      
      if (x < b.minX){
        b.minX = x;
      } else if (x > b.plusX){
        b.plusX = x;
      }
      
      if (y < b.minY){
        b.minY = y;
      } else if (y > b.plusY){
        b.plusY = y;
      }
      
      if (z < b.minZ){
        b.minZ = z;
      } else if (z > b.plusZ){
        b.plusZ = z;
      }
    }*/
  };
  
  EWGL.boundingBox = boundingBox;
  
}(EWGL));
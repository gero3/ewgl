
(function(global){
  
  var plane = global.plane;

  var frustrum = function(args){
    this.near = new plane();
    this.far = new plane();
   
    this.left = new plane();
    this.right = new plane();
    
    this.bottom = new plane();
    this.top = new plane();
   
    this.planes = [this.near,this.far,this.left,this.right,this.bottom,this.top];
    this.cameraMatrix = mat4.create();
  };
  
  
  frustrum.prototype.extractPlanes = function(perpectivematrix,modelviewmatrix) {
    var matrix = this.cameraMatrix;
    
    var m = function(row,col){
      return matrix[col*4+row-5];  
    };

    mat4.multiply(perpectivematrix,modelviewmatrix,matrix);

    this.near.setCoefficients(
        m(3,1) + m(4,1),
				m(3,2) + m(4,2),
				m(3,3) + m(4,3),
				m(3,4) + m(4,4));
	  this.far.setCoefficients(
				-m(3,1) + m(4,1),
				-m(3,2) + m(4,2),
				-m(3,3) + m(4,3),
				-m(3,4) + m(4,4));
    this.bottom.setCoefficients(
				 m(2,1) + m(4,1),
				 m(2,2) + m(4,2),
				 m(2,3) + m(4,3),
				 m(2,4) + m(4,4));
	  this.top.setCoefficients(
				-m(2,1) + m(4,1),
				-m(2,2) + m(4,2),
				-m(2,3) + m(4,3),
				-m(2,4) + m(4,4));
	  this.left.setCoefficients(
				 m(1,1) + m(4,1),
				 m(1,2) + m(4,2),
				 m(1,3) + m(4,3),
				 m(1,4) + m(4,4));
	  this.right.setCoefficients(
				-m(1,1) + m(4,1),
				-m(1,2) + m(4,2),
				-m(1,3) + m(4,3),
				-m(1,4) + m(4,4));

  };
  
  frustrum.prototype.AABBisInFrustrum = function(AABB){
    
    for(var i=0; i < 6; i++) {
      var vecTest = vec3.create([AABB.minX,AABB.minY,AABB.minZ]);
      var plane = this.planes[i];
      
      if (plane.normal[0] > 0){
        vecTest[0] = AABB.plusX;
      }
      
      if (plane.normal[1] > 0){
        vecTest[1] = AABB.plusY;
      }
      
      if (plane.normal[2] > 0){
        vecTest[2] = AABB.plusZ;
      }
      
      if ((plane.distance + plane.normal[0]*vecTest[0] +plane.normal[1]*vecTest[1] +plane.normal[2]*vecTest[2]) < 0){
        console.log(i);
        return false;
      }  
    }
    return true;
  };
  
  
  frustrum.prototype.isInFrustrum = function(position,scale,sphere){
    
		radius = -sphere.radius * Math.max( scale[0], Math.max( scale[1], scale[2] ) );

		for ( var i = 0; i < 6; i ++ ) {
      var plane = this.planes[i];
      var normal = plane.normal;
			distance = normal[0] * position[0] + normal[1] * position[1] + normal[2] * position[2] + plane.distance;
			if ( distance <= radius ) return false;

		}
    return true;
  };
  
  frustrum.create = function(args){
    return new frustrum(args);
  };
  
  global.frustrum = frustrum;

})(EWGL);
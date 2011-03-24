(function(global){
  
  var p = node.prototype;
  
  p.translate = function(vec){
    vec3.add(this.translation ,vec);
    this.setTransformFlag();
  };
  
  p.rotate = function(quat){
    quat4.multiply(this.rotation,quat);
    this.setTransformFlag();
  };
  
  
  p.lookAt = function(pos, upDir){
    
    var direction,left;
    var up = upDir || [0,1,0];
    direction = vec3.direction(pos,this.worldTranslation,[]);
    direction[2] = -direction[2];
    
    left = vec3.create(up);
    vec3.cross(left,direction);
    vec3.normalize(left);
    if (left[0]===0 && left[1]===0 && left[2]===0){
      if (direction[0] !== 0) {
        vec3.set([direction[1], -direction[0], 0],left);
      } else {
        vec3.set([0, direction[2], -direction[1]],left);
      }
    };
    
    up = vec3.create(direction);
    vec3.cross(up,left);
    vec3.normalize(up);
    
    
    
    var m00 = left[0], m01 = up[0], m02 = direction[0],
        m10 = left[1], m11 = up[1], m12 = direction[1],
        m20 = left[2], m21 = up[2], m22 = direction[2];
    
    var t = m00 + m11 + m22,s,x,y,z,w;
    
    if (t >= 0) { 
      s =  Math.sqrt(t+1); 
      w = 0.5 * s;
      s = 0.5 / s;             
      x = (m21 - m12) * s;
      y = (m02 - m20) * s;
      z = (m10 - m01) * s;
    } else if ((m00 > m11) && (m00 > m22)) {
      s =  Math.sqrt(1.0 + m00 - m11 - m22);
      x = s * 0.5;
      s = 0.5 / s;
      y = (m10 + m01) * s;
      z = (m02 + m20) * s;
      w = (m21 - m12) * s;
    } else if (m11 > m22) {
      s =  Math.sqrt(1.0 + m11 - m00 - m22); 
      y = s * 0.5;
      s = 0.5 / s;
      x = (m10 + m01) * s;
      z = (m21 + m12) * s;
      w = (m02 - m20) * s;
    } else {
      s =  Math.sqrt(1.0 + m22 - m00 - m11); 
      z = s * 0.5;
      s = 0.5 / s;
      x = (m02 + m20) * s;
      y = (m21 + m12) * s;
      w = (m10 - m01) * s;
    };
    
    this.rotation = quat4.create([x,y,z,w]);
    quat4.normalize(this.rotation);
    
  };
  
  
}(window))
  
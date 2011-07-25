(function(global){
  var node = EWGL.node;
  
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
    direction = vec3.direction(this.worldTranslation,pos,[]);

    
    left = vec3.create(up);
    vec3.cross(left,direction);
    vec3.normalize(left);
    if (left[0]===0 && left[1]===0 && left[2]===0){
      if (direction[0] !== 0) {
        vec3.set([direction[1], -direction[0], 0],left);   
      } else {
        vec3.set([0, direction[2], -direction[1]],left);
      }
    }
    
    up = vec3.create(direction);
    vec3.cross(up,left);
    vec3.normalize(up);
    
    
    var m00 = left[0], m10 = up[0], m20 = direction[0],
        m01 = left[1], m11 = up[1], m21 = direction[1],
        m02 = left[2], m12 = up[2], m22 = direction[2];
    
    //console.log(vec3.set(left,[]),vec3.set(up,[]),direction);
    
    var t = m00 + m11 + m22,s,x,y,z,w;
    
    if (t > 0) { 
      s =  Math.sqrt(t+1)*2; 
      w = 0.25 * s;            
      x = (m21 - m12) / s;
      y = (m02 - m20) / s;
      z = (m10 - m01) / s;
    } else if ((m00 > m11) && (m00 > m22)) {
      s =  Math.sqrt(1.0 + m00 - m11 - m22)*2;
      x = s * 0.25;
      y = (m10 + m01) / s;
      z = (m02 + m20) / s;
      w = (m21 - m12) / s;
    } else if (m11 > m22) {
      s =  Math.sqrt(1.0 + m11 - m00 - m22) *2; 
      y = s * 0.25;
      x = (m10 + m01) / s;
      z = (m21 + m12) / s;
      w = (m02 - m20) / s;
    } else {
      s =  Math.sqrt(1.0 + m22 - m00 - m11) *2; 
      z = s * 0.25;
      x = (m02 + m20) / s;
      y = (m21 + m12) / s;
      w = (m10 - m01) / s;
    }
    
    this.rotation = quat4.create([x,y,z,w]);
    quat4.normalize(this.rotation);
    
  //  console.log(quat4.toMat3(this.rotation,[]));
  };
  
  p.lookAt2 = function(pos, upDir){
    
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
    }
    
    up = vec3.create(direction);
    vec3.cross(up,left);
    vec3.normalize(up);
    
    
    var m00 = left[0], m01 = up[0], m02 = direction[0],
        m10 = left[1], m11 = up[1], m12 = direction[1],
        m20 = left[2], m21 = up[2], m22 = direction[2];
    
    var t = m00 + m11 + m22,s,x,y,z,w;
    
    
    w = Math.sqrt( Math.max( 0, 1 + m00 + m11 + m22 ) ) / 2;
    x = Math.sqrt( Math.max( 0, 1 + m00 - m11 - m22 ) ) / 2;
    y = Math.sqrt( Math.max( 0, 1 - m00 + m11 - m22 ) ) / 2;
    z = Math.sqrt( Math.max( 0, 1 - m00 - m11 + m22 ) ) / 2;
    x = m21 - m12 > 0 ? x: -x;
    y = m02 - m20 > 0 ? y: -y;
    z = m10 - m01 > 0 ? z: -z;
    
    this.rotation = quat4.create([x,y,z,w]);
    quat4.normalize(this.rotation);
    
    
   console.log(quat4.toMat3(this.rotation,[]));
    
  };

  
  p.getUp = function(){
    var rotMat = quat4.toMat3(this.worldRotation);
    return [rotMat[3],rotMat[4],rotMat[5]];
  };
  
  
}(EWGL));
  
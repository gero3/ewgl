
mat4.decompose= function(mat,result){
  
  result = result || {};
  
  var t = result.translation = result.translation || vec3.create([0,0,0]);
  var s = result.scale = result.scale || vec3.create([1,1,1]);
  var r = result.rotation = result.rotation || quat4.create([0,0,0,1]);
  
  t[0] = mat[12];
  t[1] = mat[13];
  t[2] = mat[14];
  
  s[0] = Math.sqrt(mat[0] * mat[0] + mat[1] * mat[1] + mat[2] * mat[2]);
  s[1] = Math.sqrt(mat[4] * mat[4] + mat[5] * mat[5] + mat[6] * mat[6]);
  s[2] = Math.sqrt(mat[8] * mat[8] + mat[9] * mat[9] + mat[10] * mat[10]);
  
};

mat4.compose = function(translation, rotation,scale,matrix){

      var x = rotation[0], y = rotation[1], z = rotation[2], w = rotation[3];
      var scalex = scale[0],scaley = scale[1],scalez = scale[2];

      var x2 = x + x;
      var y2 = y + y;
      var z2 = z + z;
    
      var xx = x*x2;
      var xy = x*y2;
      var xz = x*z2;
    
      var yy = y*y2;
      var yz = y*z2;
      var zz = z*z2;
    
      var wx = w*x2;
      var wy = w*y2;
      var wz = w*z2;
      
      matrix[0] =  (1 - (yy + zz))*scalex;
      matrix[1] =  (xy - wz)*scaley;
      matrix[2] =  (xz + wy)*scalez;
      matrix[3] =  0;
      matrix[4] =  (xy + wz)*scalex;
      matrix[5] =  (1 - (xx + zz))*scaley;
      matrix[6] =  (yz - wx)*scalez;
      matrix[7] =  0;
      matrix[8] =  (xz - wy)*scalex;
      matrix[9] =  (yz + wx)*scaley;
      matrix[10] = (1 - (xx + yy))*scalez;
      matrix[11] = 0;
      matrix[12] = translation[0];
      matrix[13] = translation[1];
      matrix[14] = translation[2];
      matrix[15] = 1;
}

mat4.decomposeSRTMatrix = function(mat,result){
  
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
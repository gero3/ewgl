vec3.createFixedPool = function(length){
  var pool = [];
  
  while(length--){
    pool.push(vec3.create());
  }
  return pool;
}
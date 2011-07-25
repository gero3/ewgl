var fs = require('fs');
var http = require('http');
var buffer = require('buffer');



var options = {
  host: 'ewgl.erbix.com',
  port: 80,
  path: '/js/nodes2/textures/sun.jpg'
};

http.get(options, function(res) {
  var test = [];
  //res.setEncoding('utf8');
  res.addListener('data',function(data){
    test.push(data.copy(new Buffer(data.length)));
  });
  res.addListener('end',function(){
    var length= 0;
    for (var i = 0;i<test.length;i++){
      length += test[i].length;
    }
    
    var test1 = new Buffer(length);
    length = 0;
    for (var i = 0;i<test.length;i++){
      test1.copy(test1,length);
      length += test[i].length;
    }
    
    fs.writeFileSync("testTest.jpg",test1);
    console.log(test.length);
  });  
  console.log("Got response: " + JSON.stringify(res.headers));
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});

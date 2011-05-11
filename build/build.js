var fs = require('fs');

var close = function(fd){
  fs.close(fd,function (err, fd) {
    if (err) throw err;
    console.log('file is closed');
  });
}

fs.stat('examples/Example2.html',function (err, stats) {
  if (err) throw err;
  console.log(stats.size);
});

fs.open('examples/Example.html', 'r', function (err, fd) {
  if (err) throw err;
  console.log('file is open');
  var buf = new Buffer(30);
  fs.read(fd,buf,0,30,0,function(err, bytesRead, buffer){
    if (err) throw err;
    console.log(buffer.toString('utf8'));
    
    close(fd);

  });
});


/*
Asynchronous file open. See open(2). Flags can be 'r', 'r+', 'w', 'w+', 'a', or 'a+'. mode defaults to 0666. The callback gets two arguments (err, fd).
fs.read(fd, buffer, offset, length, position, [callback]);

fs.readFile('build/testbuild.js', function (err, data) {
  if (err) throw err;
  console.log(data);
  });
/*
fs.writeFile('build/testbuild.txt', 'Hello Node', function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});
*/
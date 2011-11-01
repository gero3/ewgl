(function(global) {
  
  var indexOf = Array.prototype.indexOf;
  var splice = Array.prototype.splice;
  var push = Array.prototype.push;
  var pop = Array.prototype.pop;
  var undef;
  
  var List = function(args,itemAdded,itemRemoved) {
    this.length = 0;
    
    this.itemAdded = itemAdded || function(){};
    this.itemRemoved = itemRemoved || function(){};
    
    this.add(args);
  };
  
  List.prototype.add = function(args) {
    if (Array.isArray(args) || List.isList(args)) {
      this.addRange(args);
    } else if (args === null || args === undefined) {
      this.length = 0;
    } else {
      this.addOne(args);
    }
    return this;
  };
  
  List.prototype.addOne = function(args) {
    this[this.length] = args;
    this.length++;
    this.itemAdded(args);
    return this;
  };
  
  List.prototype.addRange = function(args) {
    var i, l = args.length;
    for (i = 0; i < l; i++) {
      this[this.length] = args[i];
      this.length++;
      this.itemAdded(args[i]);
    }
    return this;
  };
  
  List.prototype.contains = function(args) {
    var i, l = this.length;
    for (i = 0; i < l; i++) {
      if (this[i] === args) {
        return true;
      }
    }
    return false;
  };
  
  List.prototype.clone = function() {
    return new List(this,this.itemAdded,this.itemRemoved);
  };
  
  List.prototype.clear = function(){
    while(this.length){
      this.itemRemoved(pop.call(this));
    }
    return this;
  };
  
  List.prototype.exists = function(fn) {
    var i, l = this.length;
    for (i = 0; i < l; i++) {
      if (fn(this[i], i)) {
        return true;
      }
    }
    return false;
  };
  List.prototype.findFirst = List.prototype.find = function(fn) {
    var i, l = this.length;
    for (i = 0; i < l; i++) {
      if (fn(this[i], i)) {
        return this[i];
      }
    }
    return undefined;
  };
  
  List.prototype.findAll = function(fn) {
    var i, l = this.length,
        returnValue = new List();
    for (i = 0; i < l; i++) {
      if (fn(this[i], i)) {
        returnValue.add(this[i]);
      }
    }
    return returnValue;
  };
  
  List.prototype.findLast = function(fn) {
    var i, l = this.length;
    for (i = l; i > 0; i--) {
      if (fn(this[i], i)) {
        return this[i];
      }
    }
    return undefined;
  };
  
  List.prototype.forEach = function(fn) {
    var i, l = this.length;
    for (i = 0; i < l; i++) {
      fn(this[i], i);
    }
    return undefined;
  };
  
  List.prototype.remove = function(item) {
    var i = indexOf.call(this,item);
    if (i > -1){
      splice.call(this,i,1);
      this.itemRemoved(item);
    }
  };
  
  List.prototype.removeAll = function(fn) {
    var i, j, l = this.length;
    if (!fn) {
      this.clear();
    } else {
      for (i = 0; i < l; i++) {
        if (fn(this[i], i)) {
          this.removeAt(i);
          l--;
        }
      }
    }
  };
  
  List.prototype.removeAt = function(index){
    if (index > -1){
      this.itemRemoved(splice.call(this,index,1)[0]);
    }
  };
  
  List.isList = function(args) {
    return args instanceof List;
  };
  
  global.list = List;
}(EWGL));
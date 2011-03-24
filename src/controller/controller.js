(function(global){
  var undef;
  
  var controller = function(args){
    this._node =args.node;  
  };
  
  Object.defineProperties(controller.prototype,{
    "node" : {
      "get" : function(){
        return this._node;
      },
      "set" : function(node){
        this._node = node;
        this.changedNode();
      }
    }
  });
  
        
  
  controller.prototype._node = undef;
  controller.prototype.update = function(){};
  controller.prototype.changedNode = function(){};
  
  global.controller = controller;
  
}(window));
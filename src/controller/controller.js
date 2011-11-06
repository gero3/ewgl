(function(global){
  var undef;
  
  var controller = function(args){
    this._node =args.node || undef;  
  };
  
  EWGL.defineProperties(controller.prototype,{
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
  
  //overrideable 
  controller.prototype.update = function(){};
  
  //overrideable
  controller.prototype.changedNode = function(){};
  
  global.controller = controller;
  
}(EWGL));
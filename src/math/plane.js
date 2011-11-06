
(function(global) {
    
    var plane = function(args) {
        
        this._coefficients =  new Float32Array(4);
        this.normal = new Float32Array(this._coefficients.buffer,0,3);
        global.defineProperties(this,{
          "distance":{
            "get": function(){
              return this._coefficients[3];
            },
            "set":function(value){
              this._coefficients[3] = value;
            }
          }
        });        
    };
    
    plane.prototype.setCoefficients = function(a,b,c,d){
        
        var l = Math.sqrt(a*a+b*b+c*c);
        vec3.set([a/l,b/l,c/l],this.normal);
        this.distance = d/l;
        
    };
    
    global.plane = plane;
    
})(EWGL);; 